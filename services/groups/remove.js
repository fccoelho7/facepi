/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Status = require('./status');
const { findMember } = require('./shared/find-member');
const { goToGroup } = require('./shared/go-to-group');
const { getMemberProfile } = require('./shared/get-member-profile');

const removeMember = async (page, groupId, member) => {
  await goToGroup(page, groupId, 'members');

  const isMemberInGroup = await findMember(page, member);

  if (!isMemberInGroup) return null;

  const $memberActionsBtn = `[data-testid="admin_action_menu_button-search-${member.id}"]`;
  const $leaveGroupBtn = '[data-testid="leave_group"]';
  const $confirmRemovalBtn = 'button.layerConfirm';

  await page.click($memberActionsBtn);

  await page.waitForSelector($leaveGroupBtn);

  await page.click($leaveGroupBtn);

  await page.waitForSelector($confirmRemovalBtn);

  await page.click($confirmRemovalBtn);

  await page.waitFor(2000);

  return true;
};

const remove = async (page, groupId, memberList) => {
  let response = [];

  for (const member of memberList) {
    const profile = await getMemberProfile(page, member);

    if (!profile) {
      response = [...response, { status: Status.MemberNotFound }];
    }

    await removeMember(page, groupId, profile);

    response = [...response, { status: Status.MemberRemoved }];
  }

  return response[0];
};

module.exports = { remove };
