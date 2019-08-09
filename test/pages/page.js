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
