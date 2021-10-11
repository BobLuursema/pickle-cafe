const debug = require("debug")("pickle-cafe:t-holder");

/* This object manages the TestCafé test controllers */
const testControllerHolder = {
  t: null,
  captureResolver: null,
  getResolver: null,

  /* This function is called by the tests in the generated test.js file
   * this gives the holder the reference to the test controller.
   */
  capture: function (t) {
    debug("capture t");
    testControllerHolder.t = t;

    if (testControllerHolder.getResolver) {
      debug("someone is waiting for t, resolve it")
      testControllerHolder.getResolver(t);
    } else {
      debug("getResolver is falsy")
    }

    return new Promise(function (resolve) {
      debug("return promise that will resolve when cucumber is done")
      testControllerHolder.captureResolver = resolve;
    });
  },

  /* This function clears the controller to make it ready for the next test */
  free: function () {
    debug("free t");
    testControllerHolder.t = null;

    if (testControllerHolder.captureResolver) {
      debug("resolve testcafe promise")
      testControllerHolder.captureResolver();
    } else {
      debug("no testcafe promise to resolve")
    }
  },

  /* This function is called during the Before hook and makes Cucumber wait until
   * the test controller of TestCafé is ready to use.
   */
  get: function () {
    debug("retrieve t");
    return new Promise(function (resolve) {
      if (testControllerHolder.t) {
        debug("t already exists, resolve this promise")
        resolve(testControllerHolder.t);
      } else {
        debug("hold on to resolver for when t exists")
        testControllerHolder.getResolver = resolve;
      }
    });
  }
};

module.exports = testControllerHolder;
