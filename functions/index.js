const express = require("express");
const puppeteer = require("puppeteer");
const logger = require("morgan");
const errorHandler = require("errorhandler");
// const functions = require("firebase-functions");

const { login } = require("./services/groups/login");
const { add } = require("./services/groups/add");
const { remove } = require("./services/groups/remove");
const { retrieve } = require("./services/groups/retrieve");

const app = express();

app.use(express.json());
app.use(logger("common"));

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
    headless: true
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

app.post("/:id/members/add", async (req, res) => {
  const browser = res.locals.browser;
  const id = req.params.id;
  const { members, cookies } = req.body;

  try {
    const page = await getBrowserPage(browser, cookies);
    const data = await add(page, id, members);

    res.send({ data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post("/:id/members/remove", async (req, res) => {
  const browser = res.locals.browser;
  const id = req.params.id;
  const { members, cookies } = req.body;

  try {
    const page = await getBrowserPage(browser, cookies);
    const data = await remove(page, id, members);

    res.send({ data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post("/:id/members/retrieve", async (req, res) => {
  const browser = res.locals.browser;
  const id = req.params.id;
  const { member, cookies } = req.body;

  try {
    const page = await getBrowserPage(browser, cookies);
    const data = await retrieve(page, id, member);

    res.send({ data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

// const opts = { memory: "2GB", timeoutSeconds: 60 };
// exports.groups = functions.runWith(opts).https.onRequest(app);

app.use(errorHandler());

app.listen(5001);
