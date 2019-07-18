const express = require("express");
const puppeteer = require("puppeteer");
const functions = require("firebase-functions");

const { login } = require("./services/groups/login");
const { add } = require("./services/groups/add");
const { remove } = require("./services/groups/remove");

const app = express();
app.use(express.json());

const getBrowserPage = async (browser, cookies) => {
  const page = await browser.newPage();

  if (cookies) {
    await page.setCookie(...JSON.parse(cookies));
  }

  return page;
};

app.all("*", async (req, res, next) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: process.env.NODE_ENV !== "development"
  });

  const context = browser.defaultBrowserContext();

  await context.overridePermissions("https://www.facebook.com/", [
    "notifications"
  ]);

  res.locals.browser = browser;

  next();
});

app.post("/login", async (req, res) => {
  const browser = res.locals.browser;
  const { username, password } = req.body;

  try {
    const page = await browser.newPage();
    const cookies = await login(page, username, password);
    res.json({ message: "Login successfully!", cookies });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post("/:groupId/add", async (req, res) => {
  const browser = res.locals.browser;
  const groupId = req.params.groupId;
  const { members, cookies } = req.body;

  try {
    const page = await getBrowserPage(browser, cookies);
    await add(page, groupId, members);
    res.send({ message: "Members added!" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post("/:groupId/remove", async (req, res) => {
  const browser = res.locals.browser;
  const groupId = req.params.groupId;
  const { members, cookies } = req.body;

  try {
    const page = await getBrowserPage(browser, cookies);
    await remove(page, groupId, members);
    res.send({ message: "Members removed!" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

const opts = { memory: "2GB", timeoutSeconds: 60 };
exports.groups = functions.runWith(opts).https.onRequest(app);
