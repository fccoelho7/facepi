/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { goToGroupPage } = require('./shared/goToGroupPage');
const { getMemberProfile } = require('./shared/getMemberProfile');

const inviteMembers = async (page, groupId, members) => {
  const fieldSelector = 'div.uiStickyPlaceholderInput input';

  await goToGroupPage(page, groupId, 'members');

  await page.click('div[data-testid="group_more_actions"] > a');

  await page.waitFor(1000);

  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');

  await page.waitFor(2000);

  await page.focus(fieldSelector);

  for (const member of members) {
    await page.keyboard.type(member.email);
    await page.waitFor(1000);
    await page.keyboard.press('Enter');
    await page.focus(fieldSelector);
    await page.waitFor(1000);
  }

  await page.keyboard.press('Escape');
  await page.keyboard.press('Enter');

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
