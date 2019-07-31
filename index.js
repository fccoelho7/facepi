const express = require('express');
const puppeteer = require('puppeteer');
const logger = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('errorhandler');

const { login } = require('./services/groups/login');
const { add } = require('./services/groups/add');
const { remove } = require('./services/groups/remove');
const { retrieve } = require('./services/groups/retrieve');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(logger('common'));

const getBrowserPage = async (browser, cookies) => {
  const page = await browser.newPage();

  if (cookies) {
    await page.setCookie(...JSON.parse(cookies));
  }

  return page;
};

app.all('*', async (req, res, next) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: process.env.NODE_ENV !== 'development'
  });

  const context = browser.defaultBrowserContext();

  await context.overridePermissions('https://www.facebook.com/', ['notifications']);

  res.locals.browser = browser;
  res.locals.credentials = process.env.CREDENTIALS;

  next();
});

app.get('/status', (req, res) =>
  res.send({
    status: 'Working!',
    credentials: res.locals.credentials
  })
);

app.post('/login', async (req, res) => {
  const { browser } = res.locals;
  const { username, password } = req.body;

  try {
    const page = await browser.newPage();
    const credentials = await login(page, username, password);
    res.json({ message: 'Login successfully!', credentials });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post('/:id/members/add', async (req, res) => {
  const { browser, credentials } = res.locals;
  const { id } = req.params;
  const { member } = req.body;

  try {
    const page = await getBrowserPage(browser, credentials);
    const data = await add(page, id, [member]);

    res.send({ data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post('/:id/members/remove', async (req, res) => {
  const { browser, credentials } = res.locals;
  const { id } = req.params;
  const { member } = req.body;

  try {
    const page = await getBrowserPage(browser, credentials);
    const data = await remove(page, id, [member]);

    res.send({ data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post('/:id/members/retrieve', async (req, res) => {
  const { browser, credentials } = res.locals;
  const { id } = req.params;
  const { member } = req.body;

  try {
    const page = await getBrowserPage(browser, credentials);
    const data = await retrieve(page, id, member);

    res.send({ data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.use(errorHandler());

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { app };
