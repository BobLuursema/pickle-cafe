const testControllerHolder = require('./testControllerHolder');
const runner = require('./runner')

module.exports = {
    /* Create the test.js file with all the fixtures and tests, and run it (returns a promise that resolves in the `after` hook) */
    async beforeAll(){
        runner.createTestCafeScript()
        runner.run()
    },
    /* Wait for TestCafé to boot up and return the TestCafé controller */
    before(){
        return this.waitForTestController.then(function(t) {
            return t.maximizeWindow()
        });
    },
    /* Resolve the TestCafé controller promise, this ends the test for TestCafé */
    after(){
        testControllerHolder.free()
    },
    /* Close TestCafé after all the tests have finished */
    afterAll(){
        let intervalId = null

        function waitForTestCafe() {
            intervalId = setInterval(checkLastResponse, 500)
        }

        function checkLastResponse() {
            if(typeof t === 'undefined' || t.testRun.lastDriverStatusResponse === 'test-done-confirmation') {
                runner.close()
                clearInterval(intervalId)
            }
        }

        waitForTestCafe()
    }
}
