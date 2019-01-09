const createTestCafe = require('testcafe');
const glob = require('glob');
const { Parser, AstBuilder } = require('gherkin');
const { readFileSync, writeFileSync, createWriteStream, unlinkSync } = require('fs');

/* Manage the TestCafé server */
class Runner {
    constructor(){
        this.scenarioCount = 0
        this.testcafe = null
        this.stream = null
        this.options = {
            browsers: process.env.TESTCAFE_BROWSERS ? process.env.TESTCAFE_BROWSERS : 'chrome',
            debugOnFail: process.env.TESTCAFE_DEBUG === '1' ? true : false,
            proxy: process.env.TESTCAFE_PROXY ? process.env.TESTCAFE_PROXY : null,
            report_folder: process.env.TESTCAFE_REPORT ? process.env.TESTCAFE_REPORT : 'reports',
        }
    }
    
    /* Dynamically create the test.js file by parsing all the feature files inside the features folder */
    createTestCafeScript(){
        this.stream = createWriteStream(`${this.options.report_folder}/report.txt`)
        const parser = new Parser(new AstBuilder())
        const features = glob.sync('./features/**/*.feature')
            .map(path => parser.parse(readFileSync(path, 'utf8').toString()))
        let importStatement = 'import testControllerHolder from "./node_modules/pickle-cafe/testControllerHolder"\n\n'
        let testCode = ''
        for(let feature of features){
            testCode += `fixture("${feature.feature.name}")\n`
            for(let scenario of feature.feature.children){
                switch(scenario.type){
                    case 'Scenario':
                        testCode += `test("${scenario.name}", testControllerHolder.capture)\n`
                        break
                    case 'ScenarioOutline':
                        for(let example of scenario.examples){
                            for(let i = 0; i < example.tableBody.length; i++){
                                testCode += `test("${scenario.name}-${i}", testControllerHolder.capture)\n`
                            }
                        }
                        break
                }
            }
        }
        writeFileSync('test.js', importStatement + testCode)
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
                debugOnFail: this.options.debugOnFail
            }
            return runner
                .src('./test.js')
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
        unlinkSync('./test.js')
    }
}
module.exports = new Runner()