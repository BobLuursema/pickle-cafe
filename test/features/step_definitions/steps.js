const {
  GivenTestcafe,
  WhenTestcafe,
  ThenTestcafe,
  testcafe
} = require("pickle-cafe")(require("cucumber"));
const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");
const debug = require("debug")("pickle-cafe:steps");

GivenTestcafe(
  "a user with name {string}",
  async function (name) {
    debug("Given 1")
    t.ctx.name = name;
    await t.navigateTo("https://devexpress.github.io/testcafe/example/");
  }
);

WhenTestcafe("the user types their name and submits", async function () {
  debug("When 1")
  await this.page.submitform(t.ctx.name);
});

ThenTestcafe("the thank you message appears", async function () {
  debug("Then 1")
  await t.expect(this.page.thankYou.exists).ok();
});

WhenTestcafe("a client function is called", async function () {
  debug("When 2")
  await t.navigateTo("https://devexpress.github.io/testcafe/example/");
  const getUrl = testcafe
    .ClientFunction(() => {
      return document.location.href;
    })
    .with({ boundTestRun: t });
  t.ctx.url = await getUrl();
});

ThenTestcafe("the url is available", async function () {
  debug("Then 2")
  await t.expect(t.ctx.url).contains("https://devexpress.github.io/testcafe/example/");
});

ThenTestcafe("the test fails", async function () {
  debug("Then 2")
  expect(false).to.be.true;
});

Given("a scenario has no TestCafe", function () {
  debug("Given 3")
});

Then("TestCafe is not booted", function () {
  debug("Then 3")
  expect(typeof this.t).to.equal("undefined");
});
