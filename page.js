const {Selector} = require('testcafe')

class BoundTestRunPage {
    constructor(t){
        this.t = t
        this.setup()
    }
    setup(){}
    Selector(selector){
        return Selector(selector, {boundTestRun: this.t})
    }
}

module.exports = {
    BoundTestRunPage: BoundTestRunPage
}