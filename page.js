const { Selector } = require('testcafe')

/* A class that project can extend to make Selectors easier to use */
class BoundTestRunPage {
    constructor(t){
        this.t = t
        this.setup()
    }
    /* setup will usually be overriden by projects to setup the Selectors of the page */
    setup(){}
    /* Projects should use this method so that the current testrun will always be bound */
    Selector(selector){
        return Selector(selector, {boundTestRun: this.t})
    }
}

module.exports = {
    BoundTestRunPage: BoundTestRunPage
}