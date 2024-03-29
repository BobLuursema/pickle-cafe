# PickleCafé

[![](https://img.shields.io/npm/v/pickle-cafe.svg)](https://github.com/BobLuursema/pickle-cafe)
[![](https://img.shields.io/github/last-commit/BobLuursema/pickle-cafe.svg)](https://github.com/BobLuursema/pickle-cafe)

PickleCafé is a framework for integrating TestCafé and Cucumber, I have forked this project from https://github.com/rquellh/testcafe-cucumber, extended it and created it as a seperate module using dependency injection.

## Overview

PickleCafé exposes TestCafé's test controller (t) as a global object to the step definitions using the hooks of Cucumber.js. If you need to import anything else from testcafe (like `ClientFunction`) you should import `testcafe` from PickleCafé and get access from there.

You can configure the TestCafé runner using environment variables. Each of these will be passed to the runner.

| TestCafé      | Env variable      | Default |
| ------------- | ----------------- | ------- |
| browsers      | TESTCAFE_BROWSERS | chrome  |
| debug on fail | TESTCAFE_DEBUG    | off     |
| useProxy      | TESTCAFE_PROXY    | none    |
| report folder | TESTCAFE_REPORT   | reports |

## Tutorial

I've tried to not change the API for both Cucumber and TestCafé. To show how to use the integration I will lead you through creating a simple test for GitLab.

Create a folder for the project: `mkdir gitlab-test && cd gitlab-test`.
Make your project an npm module `npm init`, and install PickleCafé and Cucumber `npm install pickle-cafe cucumber`.

First we need a [feature file](https://docs.cucumber.io/gherkin/reference/). Create a folder called `features` in your project, and add a `gitlab.feature` file with the following content:

```gherkin
Feature: gitlab test

    @testcafe
    Scenario: test
        Given a user with username "test" and password "test"
        When the user tries to login
        Then the login fails
```

TestCafé will be started and stopped in Cucumber's Before and After hooks if a scenario is tagged with `@testcafe`, you need to import those so add a `support` folder to the `features` folder. In it create an `env.js` file with the following content:

```javascript
const pickleCafe = require("pickle-cafe")(require("cucumber"));
const { setWorldConstructor } = require("cucumber");

setWorldConstructor(function({ attach, parameters }) {
  this.attach = attach;
  this.parameters = parameters;
  pickleCafe.pickleCafeWorld.call(this);
});

pickleCafe.setupHooks();
```

Inside this file you can still use the hooks from Cucumber as well. Your own Before hooks will run after the integration hooks and your After hooks will run before the integration hooks. This means that in your hooks you have access to the [test controller object](https://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#test-controller) from TestCafé, which is exposed as a global `t` object (so the usage is the same as you would inside of a TestCafé test).

TestCafé is expecting to be able to find `t` simply when you import it, but because of this integration TestCafé cannot do that. This means that you need to [explicitly pass `t` to any `Selector` you create](https://devexpress.github.io/testcafe/documentation/test-api/selecting-page-elements/selectors/selector-options.html#optionsboundtestrun). To make your life a bit easier you can extend your [Page Model](https://devexpress.github.io/testcafe/documentation/recipes/use-page-model.html) from the `BoundTestRunPage` object supplied by PickleCafé. The constructor of that object binds `t` to the object and has its own `Selector` method that you should use. Create a `pages` folder as a sibling of `features` and put a `page.js` file in it with the following content:

```javascript
const { BoundTestRunPage } = require("pickle-cafe")(require("cucumber"));

class Page extends BoundTestRunPage {
  setup() {
    this.username = this.Selector("#user_login");
    this.password = this.Selector("#user_password");
    this.button = this.Selector("input.btn-success");
    this.login_error = this.Selector("span").withText(
      "Invalid Login or password."
    );
  }
  async signin(user) {
    await this.t
      .typeText(this.username, user.name)
      .typeText(this.password, user.pass)
      .click(this.button);
  }
}
module.exports.Page = Page;
```

This page needs to be instantiated after `t` has been instantiated. You can write your own Before hook for that, so add the following code to `env.js`

```javascript
const { Before } = require("cucumber");
const { Page } = require("../../pages/page");

Before({ tags: "@testcafe" }, function() {
  this.page = new Page(t);
});
```

Next we need to [define the steps](https://docs.cucumber.io/cucumber/step-definitions/). Add a `step_definitions` folder inside the `features` folder and add `gitlab.js` with the following content:

```javascript
const {
  GivenTestcafe,
  WhenTestcafe,
  ThenTestcafe,
  testcafe
} = require("pickle-cafe")(require("cucumber"));

GivenTestcafe(
  "a user with username {string} and password {string}",
  async function(name, pass) {
    t.ctx.user = { name: name, pass: pass };
    await t.navigateTo("https://gitlab.com/users/sign_in");
  }
);

WhenTestcafe("the user tries to login", async function() {
  await this.page.signin(t.ctx.user);
});

ThenTestcafe("the login fails", async function() {
  await t.expect(this.page.login_error.exists).ok();
});
```

Pickle Café exposes its own `Given`, `When`, `Then` and `defineStep` function to make the reporting work from both Cucumber and TestCafé. Make sure that you pass in an `async` function, that is necessary for TestCafé. PickleCafé sets the default timeout for these async functions at one minute, see the Cucumber docs to customize the timeout.

The last step is to create a `reports` folder, currently PickleCafé does not expose the TestCafé programming interface for reporting and the setup requires that folder to exist. The final folder structure should look like this:

```
- gitlab-test/
  - features/
    - step_definitions/
      - gitlab.js
    - support/
      - env.js
    - gitlab.feature
  - node_modules/
  - pages/
    - page.js
  - reports/
  - package.json
```

Now we are ready to run the test via Cucumber: `.\node_modules\.bin\cucumber-js`, if everything went well you should see:

```
......

1 scenario (1 passed)
3 steps (3 passed)
0m14.333s
```

Now you are all set to use the BDD goodness with the TestCafé experience.

## Test PickleCafé

Clone the PickleCafé repository, then run `npm install` from the `pickle-cafe` directory and the `test` directory. Run `npm link` from the `pickle-cafe` directory, and then run `npm link pickle-cafe` from the `test` directory.

Finally run `run.cmd` (assuming you're on Windows). This will run four features, of which one should fail and the error should be visisble in the console (via Cucumber) and in `report.txt` for TestCafé. The report is overwritten by each scenario, so only the last TestCafé scenario will be in it.

## Publish

```sh
npm version minor
git push
npm publish
```
