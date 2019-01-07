const wrapper = require('./stepWrapper')
const { BoundTestRunPage } = require('./page')
const pickleCafeWorld = require('./world')
const hooks = require('./hooks')

module.exports = function(cucumber) {
    return {
        /* Run the hooks that start and stop TestCafé for Cucumber */
        setupHooks: function(){
            cucumber.BeforeAll(hooks.beforeAll)
            cucumber.Before(hooks.before)
            cucumber.After(hooks.after)
            cucumber.AfterAll(hooks.afterAll)
            if(process.env.TESTCAFE_DEBUG){
                cucumber.setDefaultTimeout(-1) // Do not timeout while debugging
            }
            else {
                cucumber.setDefaultTimeout(60000)
            }
        },
        /* Exposes TestCafé to the hooks and step definitions */
        setupWorld: function(setupClasses){
            if(setupClasses) global.setupClasses = setupClasses
            cucumber.setWorldConstructor(pickleCafeWorld)
        },
        /* Wrap the Cucumber functions to make the TestCafé reporting work */
        Given: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        When: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        Then: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        BoundTestRunPage
    }
}