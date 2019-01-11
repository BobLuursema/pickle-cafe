const wrapper = require('./stepWrapper')
const { BoundTestRunPage } = require('./page')
const pickleCafeWorld = require('./world')
const hooks = require('./hooks')
const testcafe = require('testcafe')

module.exports = function(cucumber) {
    return {
        /* Run the hooks that start and stop TestCafé for Cucumber */
        setupHooks: function(){
            cucumber.Before({tags: '@testcafe'}, hooks.before)
            cucumber.After({tags: '@testcafe'}, hooks.after)
            if(process.env.TESTCAFE_DEBUG){
                cucumber.setDefaultTimeout(-1) // Do not timeout while debugging
            }
            else {
                cucumber.setDefaultTimeout(60000)
            }
        },
        /* Wrap the Cucumber functions to make the TestCafé reporting and debugging work */
        GivenTestcafe: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        WhenTestcafe: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        ThenTestcafe: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        defineStepTestCafe: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        BoundTestRunPage,
        pickleCafeWorld,
        testcafe
    }
}