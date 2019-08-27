const getMemberId = async page =>
  page.$eval('[data-referrerid]', el => el.getAttribute('data-referrerid'));

const getMemberName = async page =>
  page.$eval('[data-testid="profile_name_in_profile_page"] a', el => el.text);

const getMemberPhoto = async page =>
  page.$eval('.photoContainer img', el => el.getAttribute('src'));

const getMemberProfile = async (page, member) => {
  if (!member.id && !member.url) {
    throw Error('Member ID or URL is obligatory.');
  }

  const url = member.id ? `https://facebook.com/${member.id}` : member.url;

  try {
    await page.goto(url);

    const id = await getMemberId(page);
    const name = await getMemberName(page);
    const photo = await getMemberPhoto(page);

    return { id, name, photo, url };
  } catch (error) {
    return null;
  }
};

module.exports = { getMemberProfile };
