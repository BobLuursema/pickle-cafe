const createTestCafe = require('testcafe');
const glob = require('glob');
const { Parser, AstBuilder } = require('gherkin');
const { readFileSync, writeFileSync, createWriteStream, unlinkSync } = require('fs');

class Runner {
    constructor(){
        this.scenarioCount = 0
        this.testcafe = null
    }
    
    createTestCafeScript(){
        // Count the amount of tests we're running
        const parser = new Parser(new AstBuilder())
        const features = glob.sync('./features/**/*.feature')
            .map(path => parser.parse(readFileSync(path, 'utf8').toString()))
        // Create the test file
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
    
    run(){
        this.stream = createWriteStream('reports/report.txt')
        createTestCafe()
        .then(testcafe => {
            this.testcafe = testcafe;
            const runner = testcafe.createRunner();
            return runner
                .src('./test.js')
                .screenshots('reports/screenshots/', true)
                .browsers('path:../chrome.lnk')
                .reporter('spec', this.stream)
                .run()
        })
        .then(failedCount => {
            this.stream.end()
            unlinkSync('./test.js')
        });
    }
}
module.exports = new Runner()