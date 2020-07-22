const Page = require('./helpers/page');

let page;
beforeEach(async () => {
  // Puppeteer in action
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("The header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When sign in, shows logout button", async () => {
  // Page.login();
 
  await page.login(); 
  const text = await page.getContentsOf('a[href="/auth/logout"]');
  // const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML );

  expect(text).toEqual("Logout");
});
/** Monkey patch to refactor
 * const Page = require('puppeteer/lib/Page);
 * Page.prototype.login = async function(){
 *  const user = await userFactory();
 *  const {session, sig}=sessionFactory(user);
 *  await this.setCookie({ name: "session", value: session });
 *  await this.setCookie({ name: "session.sig", value: sig });
 *  await this.goto('localhost:3000');
 *  await this.waitFor('a[href="/auth/logout"]')
 * }
 */