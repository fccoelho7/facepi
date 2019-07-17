const add = async (page, id, members) => {
  const fieldSelector = "div.uiStickyPlaceholderInput input";

  await page.goto(`https://www.facebook.com/groups/${id}/members/`, {
    waitUntil: "networkidle2"
  });

  await page.click('div[data-testid="group_more_actions"] > a');

  await page.waitFor(1000);

  await page.keyboard.press("Space");
  await page.keyboard.press("Space");
  await page.keyboard.press("Enter");

  await page.waitFor(2000);

  await page.focus(fieldSelector);

  for (const name of members) {
    await page.keyboard.type(name);
    await page.waitFor(1000);
    await page.keyboard.press("Enter");
    await page.focus(fieldSelector);
    await page.waitFor(1000);
  }

  await page.keyboard.press("Escape");
  await page.keyboard.press("Enter");

  await page.waitFor(2000);

  await page.keyboard.press("Enter");
};

module.exports = { add };
