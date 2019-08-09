const getMemberId = async page =>
  page.$eval('[data-referrerid]', el => el.getAttribute('data-referrerid'));

const getMemberName = async page =>
  page.$eval('[data-testid="profile_name_in_profile_page"] a', el => el.text);

const getMemberPhoto = async page =>
  page.$eval('.photoContainer img', el => el.getAttribute('src'));

const getMemberProfile = async (page, member) => {
  let { id, name, photo, url } = member;
  url = id ? `https://facebook.com/${id}` : url;

  try {
    await page.goto(url);

    id = id || (await getMemberId(page));
    name = await getMemberName(page);
    photo = await getMemberPhoto(page);

    return { id, name, photo, url };
  } catch (error) {
    return null;
  }
};

module.exports = { getMemberProfile };
