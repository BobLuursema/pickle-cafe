const {defineStep} = require('./defineStep')
const {BoundTestRunPage} = require('./page')

module.exports = {
    setupHooks: function(){
        const hooks = require('./hooks.js')
    },
    setupWorld: function(setupClasses){
        global.setupClasses = setupClasses
        const world = require('./world.js')
    },
    Given: defineStep,
    When: defineStep,
    Then: defineStep,
    BoundTestRunPage
}