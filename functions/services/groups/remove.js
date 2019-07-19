const Status = require("./status");
const { findMember } = require("./shared/findMember");

const removeOnce = async (page, member) => {
  const hasMember = await findMember(page, member);

  if (!hasMember) {
    return { ...member, status: Status.MemberNotFound };
  }

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await page.waitFor(1000);

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.waitFor(5000);

  await page.click("button.layerConfirm");

  await page.waitFor(2000);

  return { ...member, status: Status.MemberRemoved };
};

const remove = async (page, id, memberList) => {
  await page.goto(`https://www.facebook.com/groups/${id}/members/`, {
    waitUntil: "networkidle2"
  });

  let response = [];

  for (const member of memberList) {
    const result = await removeOnce(page, member);
    response = [...response, result];
  }

  return response;
};

module.exports = { remove, removeOnce };
