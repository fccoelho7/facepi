const { add } = require("./services/groups/add");
const { remove } = require("./services/groups/remove");
const { perform } = require("./services/groups/perform");

perform("leste.eventos", async (browser, page) => {
  // await add(page, ["dev1@example.com", "dev2@example.com"]);
  await remove(page, ["Amanda Moreira"]);
  browser.close();
});
