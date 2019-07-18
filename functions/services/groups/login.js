const login = async (page, user, password) => {
  await page.goto("https://www.facebook.com/login", {
    waitUntil: "networkidle2"
  });

  await page.type('input[name="email"]', user);
  await page.type('input[name="pass"]', password);
  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  const cookies = await page.cookies();

  return JSON.stringify(cookies);
};

module.exports = { login };
