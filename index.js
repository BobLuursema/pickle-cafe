const wrapper = require('./defineStep')
const {BoundTestRunPage} = require('./page')
const pickleCafeWorld = require('./world')
const hooks = require('./hooks')

module.exports = function(cucumber) {
    return {
        setupHooks: function(){
            cucumber.BeforeAll(hooks.beforeAll)
            cucumber.Before(hooks.before)
            cucumber.After(hooks.after)
            cucumber.AfterAll(hooks.afterAll)
            cucumber.setDefaultTimeout(30000)
        },
        setupWorld: function(setupClasses){
            if(setupClasses) global.setupClasses = setupClasses
            cucumber.setWorldConstructor(pickleCafeWorld)
        },
        Given: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        When: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        Then: function(pattern, fn){cucumber.defineStep(pattern, wrapper(fn))},
        BoundTestRunPage
    }
}