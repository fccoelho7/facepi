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

const getMemberProfile = async (page, member) => {
  const { url, email } = member;
  let id, name, photo, status;

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    id = await getMemberId(page);
    name = await getMemberName(page);
    photo = await getMemberPhoto(page);

    status = id && Status.MemberInvited;
  } catch {
    status = Status.MemberNotFound;
  }

  return { id, name, email, url, photo, status };
};

const inviteMembers = async (page, groupId, members) => {
  const fieldSelector = "div.uiStickyPlaceholderInput input";

  await goToGroupPage(page, groupId, "members");

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
};

const add = async (page, groupId, members) => {
  let response = [];

  for (const member of members) {
    const memberProfile = await getMemberProfile(page, member);

    if (memberProfile.id) {
      await inviteMembers(page, groupId, [member]);
    }

    response = [...response, memberProfile];
  }

  return response;
};

module.exports = { add };
