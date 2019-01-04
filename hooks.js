const testControllerHolder = require('./testControllerHolder');
const runner = require('./runner')

module.exports = {
    async beforeAll(){
        runner.createTestCafeScript()
        runner.run()
    },
    before(){
        return this.waitForTestController.then(function(t) {
            return t.maximizeWindow()
        });
    },
    after(){
        testControllerHolder.free()
    },
    afterAll(){
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
    }
}
