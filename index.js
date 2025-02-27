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

app.use(express.json());
app.use(logger('common'));

const getBrowserPage = async (browser, cookies) => {
  const page = await browser.newPage();

  if (cookies) {
    await page.setCookie(...cookies);
  }

  return page;
};

const fromBase64 = hash => JSON.parse(Buffer.from(hash, 'base64').toString('ascii'));

app.all('*', async (req, res, next) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: process.env.NODE_ENV !== 'development'
  });

  const context = browser.defaultBrowserContext();

  await context.overridePermissions('https://www.facebook.com/', ['notifications']);

  res.locals.browser = browser;
  res.locals.credentials = fromBase64(process.env.CREDENTIALS);

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
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post('/:id/members/add', async (req, res) => {
  const { browser, credentials } = res.locals;
  const { id } = req.params;
  const { url } = req.body;

  try {
    const page = await getBrowserPage(browser, credentials);
    const data = await add(page, id, url);

    res.send({ data });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.post('/:id/members/remove', async (req, res) => {
  const { browser, credentials } = res.locals;
  const { id: groupId } = req.params;
  const { id: memberId } = req.body;

  try {
    const page = await getBrowserPage(browser, credentials);
    const data = await remove(page, groupId, memberId);

    res.send({ data });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
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
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(400).send({ error: error.message });
  }

  await browser.close();
});

app.use(errorHandler());

if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 5002;
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { app };
