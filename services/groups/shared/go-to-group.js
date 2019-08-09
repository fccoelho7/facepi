const goToGroup = async (page, id, suffix = '') =>
  page.goto(`https://www.facebook.com/groups/${id}/${suffix}`, {
    waitUntil: 'networkidle2'
  });

module.exports = { goToGroup };
