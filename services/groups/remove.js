/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Status = require('./status');
const { findMember } = require('./shared/find-member');
const { goToGroup } = require('./shared/go-to-group');
const { getMemberProfile } = require('./shared/get-member-profile');

const removeMember = async (page, groupId, member) => {
  await goToGroup(page, groupId, 'members');

  const isMemberInGroup = await findMember(page, member);

  if (!isMemberInGroup) return;

  const $memberActionsBtn = `[data-testid="admin_action_menu_button-search-${member.id}"]`;
  const $leaveGroupBtn = '[data-testid="leave_group"]';
  const $confirmRemovalBtn = 'button.layerConfirm';

  await page.click($memberActionsBtn);

  await page.waitForSelector($leaveGroupBtn);

  await page.click($leaveGroupBtn);

  await page.waitForSelector($confirmRemovalBtn);

  await page.click($confirmRemovalBtn);

  await page.waitForResponse(res => res.url().match(/ajax\/groups\/remove_member/));
};

const remove = async (page, groupId, memberId) => {
  const profile = await getMemberProfile(page, { id: memberId });

  if (!profile) {
    return { status: Status.MemberNotFound };
  }

  await removeMember(page, groupId, profile);

  return { status: Status.MemberRemoved };
};

module.exports = { remove };
