const puppeteer = require("puppeteer");

const { cookiesRepository } = require('./cookiesRepository');

const remove = async (page, memberName) => {
  await page.type('input[placeholder="Encontre um membro"]', memberName);

  await page.waitFor(5000);

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await page.waitFor(2000);

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.waitFor(2000);

  await page.click("button.layerConfirm");
};

const login = async (page, user, password) => {
  await page.type('input[name="email"]', user);
  await page.type('input[name="pass"]', password);
  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  const cookies = await page.cookies();

  cookiesRepository.save(cookies);
};

const add = async (page, memberName) => {
  await page.click('div[data-testid="group_more_actions"] > a');

  await page.waitFor(2000);

  await page.keyboard.press("Space");
  await page.keyboard.press("Space");
  await page.keyboard.press("Enter");

  await page.waitFor(2000);

  await page.type("div.uiStickyPlaceholderInput > input", memberName);

  await page.waitFor(3000);

  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Enter");

  await page.waitFor(3000);

  await page.keyboard.press("Enter");
};

const goToGroupMembers = (page, groupId) => {
  await page.goto(`https://www.facebook.com/groups/${groupId}/members/`);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1024, height: 768 }
  });
  const context = browser.defaultBrowserContext();
  const page = await browser.newPage();
  const memberName = process.env.MEMBER_NAME;

  const cookies = await cookiesRepository.get();
  await page.setCookie(...cookies);

  await context.overridePermissions("https://www.facebook.com/", [
    "notifications"
  ]);

  await goToGroupMembers(page, 1202948933104577)

  await login(page, context, "fccoelho7", "Fab***0701");

  await page.waitFor(5000)

  await add(page, memberName);
  await remove(page, memberName);

  browser.close();
})();
