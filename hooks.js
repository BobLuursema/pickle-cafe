const testControllerHolder = require('./testControllerHolder');
const Runner = require('./runner')

module.exports = {
    /* Wait for TestCafé to boot up and return the TestCafé controller */
    before(data){
        this.runner = new Runner()
        this.runner.createTestCafeScript(data.pickle.name)
        this.runner.run()
        return this.waitForTestController.then(function(t) {
            return t.maximizeWindow()
        });
    },
    /* Resolve the TestCafé controller promise, this ends the test for TestCafé */
    after(){
        testControllerHolder.free()
        let intervalId = null
        let runner = this.runner

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
    },
}
