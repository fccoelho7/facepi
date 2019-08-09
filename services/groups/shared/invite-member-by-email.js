/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { goToGroup } = require('./go-to-group');

const inviteMemberByEmail = async (page, groupId, members) => {
  const fieldSelector = 'div.uiStickyPlaceholderInput input';

  await goToGroup(page, groupId, 'members');

  await page.click('div[data-testid="group_more_actions"] > a');

  await page.waitFor(1000);

  await page.keyboard.press('Space');
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

module.exports = { inviteMemberByEmail };
