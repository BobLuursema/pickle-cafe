const createTestCafe = require("testcafe");
const { writeFileSync, unlinkSync } = require("fs");
const debug = require("debug")("pickle-cafe:runner");
const generateUUID = function (a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
};

/* Manage the TestCafé server */
class Runner {
  constructor() {
    this.scenarioCount = 0;
    this.testcafe = null;
    this.testFile = null;
    this.options = {
      browsers: process.env.TESTCAFE_BROWSERS
        ? process.env.TESTCAFE_BROWSERS
        : "chrome",
      debugOnFail: process.env.TESTCAFE_DEBUG === "1" ? true : false,
      proxy: process.env.TESTCAFE_PROXY ? process.env.TESTCAFE_PROXY : null,
      report_folder: process.env.TESTCAFE_REPORT
        ? process.env.TESTCAFE_REPORT
        : "reports"
    };
  }

  /* Dynamically create the test.js file by parsing all the feature files inside the features folder */
  createTestCafeScript(testname) {
    debug("create testscript");
    this.testFile = `test_${generateUUID()}.js`;
    let testCode = `fixture("${testname}")\n`;
    testCode += `test("${testname}", testControllerHolder.capture)\n`;
    writeFileSync(this.testFile, testCode);
  }

  /* Create the TestCafé runner */
  run() {
    debug(`start runner from ${this.testFile}`);
    createTestCafe("localhost").then(testcafe => {
      this.testcafe = testcafe;
      const runner = testcafe.createRunner();
      if (this.options.proxy) {
        runner.useProxy(this.options.proxy);
      }
      let runOptions = {
        debugOnFail: this.options.debugOnFail,
        skipJsErrors: true
      };
      return runner
        .src(`./${this.testFile}`)
        .screenshots({
          path: `${this.options.report_folder}/screenshots/`,
          takeOnFails: true
        })
        .browsers(this.options.browsers)
        .reporter("spec", `${this.options.report_folder}/report.txt`)
        .run(runOptions);
    });
  }

  /* Close the stream, file and browser/server */
  close() {
    debug("close testcafe, close report stream, unlink file");
    this.testcafe.close();
    unlinkSync(`./${this.testFile}`);
  }
}
module.exports = Runner;
