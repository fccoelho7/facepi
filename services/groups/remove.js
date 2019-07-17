const removeOnce = async (page, memberName) => {
  const fieldSelector = 'input[placeholder="Encontre um membro"]';

  // Clear some previously value
  await page.click(fieldSelector, { clickCount: 4 });
  await page.keyboard.press("Backspace");

  await page.waitFor(2000);

  await page.type(fieldSelector, memberName);

  await page.waitFor(3000);

  // Check if there's any match
  const foundMembers = await page.$$(".fbProfileBrowserListItem");

  if (foundMembers.length === 0) {
    throw Error(`Member ${memberName} not found!`);
  }

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await page.waitFor(1000);

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.waitFor(5000);

  await page.click("button.layerConfirm");

  await page.waitFor(2000);
};

const remove = async (page, id, list) => {
  await page.goto(`https://www.facebook.com/groups/${id}/members/`, {
    waitUntil: "networkidle2"
  });

  for (const name of list) {
    await removeOnce(page, name);
  }
};

module.exports = { remove, removeOnce };
