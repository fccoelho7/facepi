/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { goToGroup } = require('./shared/go-to-group');
const { getMemberProfile } = require('./shared/get-member-profile');
const Status = require('./status');

const approveMemberRequest = async (page, groupId, url) => {
  const profile = await getMemberProfile(page, { url });

  if (!profile) {
    return { status: Status.MemberNotFound };
  }

  await goToGroup(page, groupId, 'requests');

  let status = Status.MemberAdded;

  const $approveBtn = `[data-testid="${profile.id}"] button[data-testid="approve_pending_member"]`;

  try {
    await page.type('[placeholder="Search by name"]', profile.name);
    await page.waitForResponse(res => res.url().match(/api\/graphql/));
    await page.click($approveBtn);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    status = Status.MemberNotRequested;
  }

  return { ...profile, status };
};

const add = (page, groupId, profileUrl) => approveMemberRequest(page, groupId, profileUrl);

module.exports = { add };
