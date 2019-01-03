const testControllerHolder = require('./testControllerHolder');
const {AfterAll, setDefaultTimeout, Before, After, BeforeAll} = require('cucumber');
const TIMEOUT = 20000;
const runner = require('./runner')

let attachScreenshotToReport = null;

setDefaultTimeout(TIMEOUT);

BeforeAll(async function(){
    runner.createTestCafeScript()
    runner.run()
})

Before(function() {
    return this.waitForTestController.then(function(t) {
        return t.maximizeWindow()
    });
});

After(function(){
    testControllerHolder.free()
})

AfterAll(function() {
    let intervalId = null

    function waitForTestCafe() {
        intervalId = setInterval(checkLastResponse, 500)
    }

    function checkLastResponse() {
        if (t.testRun.lastDriverStatusResponse === 'test-done-confirmation') {
            runner.testcafe.close()
            runner.stream.end()
            clearInterval(intervalId)
        }
    }

    waitForTestCafe()
});

const getIsTestCafeError = function() {
    return isTestCafeError
};

const getAttachScreenshotToReport = function() {
    return attachScreenshotToReport
};

exports.getIsTestCafeError = getIsTestCafeError
exports.getAttachScreenshotToReport = getAttachScreenshotToReport
