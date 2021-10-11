const testControllerHolder = require("./testControllerHolder");
const Runner = require("./runner");
const debug = require("debug")("pickle-cafe:hooks");

module.exports = {
  /* Wait for TestCafé to boot up and return the TestCafé controller */
  before(data) {
    debug("before hook - start runner");
    global.testControllerHolder = testControllerHolder;
    this.runner = new Runner();
    this.runner.createTestCafeScript(data.pickle.name);
    this.runner.run();
    debug("return promise that waits for t to be stored in world")
    return this.waitForTestController.then(function (t) {
      debug("runner started");
      return t;
    });
  },
  /* Resolve the TestCafé controller promise, this ends the test for TestCafé */
  after() {
    return new Promise(resolve => {
      debug("after hook - stop runner");
      // Does resolving t here cause an issue if we want to debug?
      testControllerHolder.free();
      let intervalId = null;
      let timeoutId = null;
      let runner = this.runner;

      function waitForTestCafe() {
        intervalId = setInterval(checkLastResponse, 500);
        timeoutId = setTimeout(close, 5000)
      }

      function checkLastResponse() {
        if (
          typeof t === "undefined" ||
          t.testRun.lastDriverStatusResponse === "test-done-confirmation"
        ) {
          close()
        }
      }

      function close() {
        debug("close runner");
        clearTimeout(timeoutId)
        clearInterval(intervalId);
        runner.close();
        resolve();
      }

      waitForTestCafe();
    });
  }
};
