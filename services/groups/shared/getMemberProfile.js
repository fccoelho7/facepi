const Status = require('../status');

const getMemberId = async page =>
  page.$eval('[data-referrerid]', el => el.getAttribute('data-referrerid'));

const getMemberName = async page =>
  page.$eval('[data-testid="profile_name_in_profile_page"] a', el => el.text);

const getMemberPhoto = async page =>
  page.$eval('.photoContainer img', el => el.getAttribute('src'));

const getMemberProfile = async (page, member) => {
  const { email } = member;
  let { id, name, photo, status, url } = member;

  try {
    url = id ? `https://facebook.com/${id}` : url;

    await page.goto(url, { waitUntil: 'networkidle2' });

    id = id || (await getMemberId(page));
    name = await getMemberName(page);
    photo = await getMemberPhoto(page);
    status = Status.MemberInvited;
  } catch (error) {
    status = Status.MemberNotFound;
  }

  return { id, name, email, photo, status, url };
};

module.exports = { getMemberProfile };
