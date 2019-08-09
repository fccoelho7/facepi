const Status = require('./status');
const { findMember } = require('./shared/find-member');
const { goToGroup } = require('./shared/go-to-group');

const retrieve = async (page, id, member) => {
  await goToGroup(page, id, 'members');

  const hasMember = await findMember(page, member);
  const status = hasMember ? Status.MemberAdded : Status.MemberNotFound;

  return { ...member, status };
};

module.exports = { retrieve };
