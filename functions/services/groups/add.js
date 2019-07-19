const Status = require("./status");

const getMemberIdByUrl = url => {
  const regex = new RegExp("[\\?&]id=([^&#]*)");
  const results = regex.exec(url);

  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const getMemberId = async (page, name) => {
  const url = await page.$eval(
    `.uiProfileBlockContent a[title="${name}"]`,
    el => el.getAttribute("data-hovercard")
  );

  return getMemberIdByUrl(url);
};

const goToPage = async (page, id, suffix = "") => {
  return await page.goto(`https://www.facebook.com/groups/${id}/${suffix}`, {
    waitUntil: "networkidle2"
  });
};

const add = async (page, id, members) => {
  const fieldSelector = "div.uiStickyPlaceholderInput input";

  await goToPage(page, id, "members");

  await page.click('div[data-testid="group_more_actions"] > a');

  await page.waitFor(1000);

  await page.keyboard.press("Space");
  await page.keyboard.press("Space");
  await page.keyboard.press("Enter");

  await page.waitFor(2000);

  await page.focus(fieldSelector);

  for (const member of members) {
    await page.keyboard.type(member.email);
    await page.waitFor(1000);
    await page.keyboard.press("Enter");
    await page.focus(fieldSelector);
    await page.waitFor(1000);
  }

  await page.keyboard.press("Escape");
  await page.keyboard.press("Enter");

  await page.waitFor(1000);

  await goToPage(page, id, "invited");

  let response = [];

  for (const member of members) {
    const { name, email } = member;
    let id = null;
    let status = Status.MemberInvited;

    try {
      id = await getMemberId(page, name);
    } catch {
      status = Status.MemberNotFound;
    }

    response = [...response, { id, name, email, status }];
  }

  return response;
};

module.exports = { add };
