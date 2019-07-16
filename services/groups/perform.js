const puppeteer = require("puppeteer");
const cookiesRepository = require("../cookies");

const perform = async (groupId, action) => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const context = browser.defaultBrowserContext();
  const page = await browser.newPage();

  const cookies = await cookiesRepository.get();

  await context.overridePermissions("https://www.facebook.com/", [
    "notifications"
  ]);

  if (cookies) {
    await page.setCookie(...cookies);
  } else {
    await login(page, context, "fccoelho7", "Fab***0701");
  }

  await page.goto(`https://www.facebook.com/groups/${groupId}/members/`);

  action(browser, page);
};

module.exports = { perform };
