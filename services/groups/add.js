/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { goToGroup } = require('./shared/go-to-group');
const { getMemberProfile } = require('./shared/get-member-profile');
const Status = require('./status');

const approveMemberRequest = async (page, groupId, member) => {
  const profile = await getMemberProfile(page, member);

  if (!profile) {
    return { status: Status.MemberNotFound };
  }

  await goToGroup(page, groupId, 'requests');

  let status = Status.MemberAdded;
  const approveButtonSelector = `[data-testid="${profile.id}"] button[data-testid="approve_pending_member"]`;

  try {
    await page.type('[placeholder="Search by name"]', profile.name);
    await page.waitForSelector(approveButtonSelector, { timeout: 3000 });
    await page.click(approveButtonSelector);
  } catch (error) {
    status = Status.MemberNotRequested;
  }

  return { ...profile, status };
};

const add = async (page, groupId, members) => {
  let response = [];

  for (const member of members) {
    const result = await approveMemberRequest(page, groupId, member);
    response = [...response, result];
  }

  return response[0];
};

module.exports = { add };
