const findMember = async (page, member) => {
  const fieldSelector = 'input[placeholder="Encontre um membro"]';

  // Clear some previously value
  await page.click(fieldSelector, { clickCount: 4 });
  await page.keyboard.press('Backspace');

  await page.waitFor(1000);

  await page.type(fieldSelector, member.name);

  await page.waitFor(2000);

  const foundMember = await page.$(`#search_${member.id}`);

  return !!foundMember;
};

module.exports = { findMember };
