const puppeteer = require("puppeteer");

const { cookiesRepository } = require("./cookiesRepository");

const removeOnce = async (page, memberName) => {
  const fieldSelector = 'input[placeholder="Encontre um membro"]';

  // Clear some previously value
  await page.click(fieldSelector, { clickCount: 3 });
  await page.keyboard.press("Backspace");

  await page.waitFor(1000);

  await page.type(fieldSelector, memberName);

  await page.waitFor(3000);

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

  await page.waitFor(2000);
};

const remove = async (page, list) => {
  for (const name of list) {
    await removeOnce(page, name);
  }
};

const login = async (page, user, password) => {
  await page.type('input[name="email"]', user);
  await page.type('input[name="pass"]', password);
  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  const cookies = await page.cookies();

  cookiesRepository.save(cookies);
};

const add = async (page, list) => {
  const fieldSelector = "div.uiStickyPlaceholderInput input";
  await page.click('div[data-testid="group_more_actions"] > a');

  await page.waitFor(500);

  await page.keyboard.press("Space");
  await page.keyboard.press("Space");
  await page.keyboard.press("Enter");

  await page.waitFor(2000);

  await page.focus(fieldSelector);

  for (const name of list) {
    await page.keyboard.type(name);
    await page.waitFor(500);
    await page.keyboard.press("Enter");
    await page.focus(fieldSelector);
    await page.waitFor(500);
  }

  await page.keyboard.press("Escape");
  await page.keyboard.press("Enter");

  await page.waitFor(2000);

  await page.keyboard.press("Enter");
};

const goToGroupMembers = async (page, groupId) => {
  await page.goto(`https://www.facebook.com/groups/${groupId}/members/`);
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1024, height: 768 }
  });
  const context = browser.defaultBrowserContext();
  const page = await browser.newPage();

  const cookies = await cookiesRepository.get();
  await page.setCookie(...cookies);

  await context.overridePermissions("https://www.facebook.com/", [
    "notifications"
  ]);

  await goToGroupMembers(page, 1202948933104577);

  // await login(page, context, "fccoelho7", "Fab***0701");

  // await page.waitFor(5000);

  // await add(page, ["dev1@gmail.com", "dev2@gmail.com", "dev3@gmail.com"]);
  // await remove(page, ["Accácio Jasson Franklin", "Janynne Gomes"]);

  browser.close();
})();
