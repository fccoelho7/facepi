const Status = require("./status");
const { goToGroupPage } = require("./shared/goToGroupPage");

const getMemberId = async page =>
  await page.$eval("[data-referrerid]", el =>
    el.getAttribute("data-referrerid")
  );

const getMemberName = async page =>
  await page.$eval(
    '[data-testid="profile_name_in_profile_page"] a',
    el => el.text
  );

const getMemberPhoto = async page =>
  await page.$eval(".photoContainer img", el => el.getAttribute("src"));

const add = async (page, id, members) => {
  const fieldSelector = "div.uiStickyPlaceholderInput input";

  await goToGroupPage(page, id, "members");

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

  let response = [];

  for (const member of members) {
    const { url, email } = member;

    await page.goto(url, { waitUntil: "networkidle2" });

    const id = await getMemberId(page);
    const name = await getMemberName(page);
    const photo = await getMemberPhoto(page);
    const status = id ? Status.MemberInvited : Status.MemberNotFound;

    response = [...response, { id, name, email, url, photo, status }];
  }

  return response;
};

module.exports = { add };
