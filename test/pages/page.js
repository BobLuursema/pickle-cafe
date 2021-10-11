const { BoundTestRunPage } = require("pickle-cafe")(require("cucumber"));

class Page extends BoundTestRunPage {
  setup() {
    this.yourName = this.Selector("#developer-name");
    this.button = this.Selector("#submit-button");
    this.thankYou = this.Selector("h1").withText("Thank you");
  }
  async submitform(name) {
    await this.t
      .typeText(this.yourName, name)
      .click(this.button);
  }
}
module.exports.Page = Page;
