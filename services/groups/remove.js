/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Status = require('./status');
const { findMember } = require('./shared/findMember');
const { goToGroupPage } = require('./shared/goToGroupPage');
const { getMemberProfile } = require('./shared/getMemberProfile');

const removeMember = async (page, groupId, member) => {
  await goToGroupPage(page, groupId, 'members');

  const hasMember = await findMember(page, member);

  if (!hasMember) {
    return { ...member, status: Status.MemberNotFound };
  }

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await page.waitFor(1000);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await page.waitFor(5000);

  await page.click('button.layerConfirm');

  await page.waitFor(2000);

  return { ...member, status: Status.MemberRemoved };
};

const remove = async (page, groupId, memberList) => {
  let response = [];

  for (let member of memberList) {
    member = await getMemberProfile(page, member);
    const result = await removeMember(page, groupId, member);

    response = [...response, result];
  }

  return response;
};

module.exports = { remove };
