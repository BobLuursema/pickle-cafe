const {Selector} = require('testcafe')

class BoundTestRunPage {
    constructor(t){
        this.t = t
        this.setup()
    }
    // Can be overriden to do setups of child objects.
    setup(){}
    Selector(selector){
        return Selector(selector, {boundTestRun: this.t})
    }
}

module.exports = {
    BoundTestRunPage: BoundTestRunPage
}