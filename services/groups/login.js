const cookiesRepository = require("../cookies");

const login = async (page, user, password) => {
  await page.type('input[name="email"]', user);
  await page.type('input[name="pass"]', password);
  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  const cookies = await page.cookies();

  cookiesRepository.save(cookies);
};

module.exports = { login };
