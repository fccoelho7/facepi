const goToGroupPage = async (page, id, suffix = "") => {
  return await page.goto(`https://www.facebook.com/groups/${id}/${suffix}`, {
    waitUntil: "networkidle2"
  });
};

module.exports = { goToGroupPage };
