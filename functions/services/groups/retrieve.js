const Status = require("./status");
const { findMember } = require("./shared/findMember");

const retrieve = async (page, id, member) => {
  await page.goto(`https://www.facebook.com/groups/${id}/members/`, {
    waitUntil: "networkidle2"
  });

  const hasMember = await findMember(page, member);
  const status = hasMember ? Status.MemberAdded : Status.MemberNotFound;

  return { ...member, status };
};

module.exports = { retrieve };
