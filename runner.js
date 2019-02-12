const createTestCafe = require('testcafe');
const { writeFileSync, createWriteStream, unlinkSync } = require('fs');
const generateUUID = function(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,generateUUID)}

/* Manage the TestCafé server */
class Runner {
    constructor(){
        this.scenarioCount = 0
        this.testcafe = null
        this.stream = null
        this.testFile = null
        this.options = {
            browsers: process.env.TESTCAFE_BROWSERS ? process.env.TESTCAFE_BROWSERS : 'chrome',
            debugOnFail: process.env.TESTCAFE_DEBUG === '1' ? true : false,
            proxy: process.env.TESTCAFE_PROXY ? process.env.TESTCAFE_PROXY : null,
            report_folder: process.env.TESTCAFE_REPORT ? process.env.TESTCAFE_REPORT : 'reports',
        }
    }
    
    /* Dynamically create the test.js file by parsing all the feature files inside the features folder */
    createTestCafeScript(testname){
        this.stream = createWriteStream(`${this.options.report_folder}/report.txt`)
        this.testFile = `test_${generateUUID()}.js`
        let importStatement = 'import testControllerHolder from "./node_modules/pickle-cafe/testControllerHolder"\n\n'
        let testCode = ''
        testCode += `fixture("${testname}")\n`
        testCode += `test("${testname}", testControllerHolder.capture)\n`
        writeFileSync(this.testFile, importStatement + testCode)
    }
    
    /* Create the TestCafé runner */
    run(){
        createTestCafe()
        .then(testcafe => {
            this.testcafe = testcafe;
            const runner = testcafe.createRunner();
            if(this.options.proxy){
                runner.useProxy(this.options.proxy)
            }
            let runOptions = {
                debugOnFail: this.options.debugOnFail,
                skipJsErrors: true,
            }
            return runner
                .src(`./${this.testFile}`)
                .screenshots(`${this.options.report_folder}/screenshots/`, true)
                .browsers(this.options.browsers)
                .reporter('spec', this.stream)
                .run(runOptions)
        })
    }

    /* Close the stream, file and browser/server */
    close(){
        this.testcafe.close()
        this.stream.end()
        unlinkSync(`./${this.testFile}`)
    }
}
module.exports = Runner