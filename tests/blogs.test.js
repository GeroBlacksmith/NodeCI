const Page = require("./helpers/page");

let page;
beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    const label = await page.getContentsOf("form label");
    expect(label).toEqual("Blog Title");
  });
  describe("And using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "My title");
      await page.type(".content input", "My content");
      await page.click("form button");
    });
    test("Submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");
      expect(text).toEqual("Please confirm your entries");
    });
    test("Submitting then saving add blogs to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");
      const text = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");
      expect(text).toEqual("My title");
      expect(content).toEqual("My content");
    });
  });
  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("WHen user is not logged in", async () => {
  const actions = [
    {
      method: "GET",
      path: "/api/blogs",
    },
    {
      method: "POST",
      path: "/api/blogs",
      data:{
          title:'T',
          content:'C'
      }
    },
  ];
  test("Blog related actions are prohibited", async () => {
      const results = await page.execRequest(actions);
      for (let result of results){
          expect(result).toEqual({error:'You must log in!'});
      }
  });
});