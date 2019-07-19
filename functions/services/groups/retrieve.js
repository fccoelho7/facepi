const Status = require("./status");
const { findMember } = require("./shared/findMember");
const { goToGroupPage } = require("./shared/goToGroupPage");

const retrieve = async (page, id, member) => {
  await goToGroupPage(page, id, "members");

  const hasMember = await findMember(page, member);
  const status = hasMember ? Status.MemberAdded : Status.MemberNotFound;

  return { ...member, status };
};

module.exports = { retrieve };
