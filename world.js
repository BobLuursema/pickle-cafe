const testControllerHolder = require("./testControllerHolder");
const base64Img = require("base64-img");
const debug = require("debug")("pickle-cafe:world");

/* This function is the World function for Cucumber, variables declared in the `this` here are exposed
 * to the hooks and step definitions in Cucumber.
 */
module.exports = function () {
  this.runner = null;

  this.waitForTestController = testControllerHolder.get().then(function (t) {
    debug("t stored in world");
    this.t = t;
    return t;
  });

  this.addScreenshotToReport = function () {
    if (
      process.argv.includes("--format") ||
      process.argv.includes("-f") ||
      process.argv.includes("--format-options")
    ) {
      testController
        .takeScreenshot()
        .then(function (screenshotPath) {
          const imgInBase64 = base64Img.base64Sync(screenshotPath);
          const imageConvertForCuc = imgInBase64.substring(
            imgInBase64.indexOf(",") + 1
          );
          return attach(imageConvertForCuc, "image/png");
        })
        .catch(function (error) {
          console.warn("The screenshot was not attached to the report");
        });
    } else {
      return Promise.resolve();
    }
  };

  this.attachScreenshotToReport = function (pathToScreenshot) {
    const imgInBase64 = base64Img.base64Sync(pathToScreenshot);
    const imageConvertForCuc = imgInBase64.substring(
      imgInBase64.indexOf(",") + 1
    );
    return attach(imageConvertForCuc, "image/png");
  };
};
