const pickleCafe = require('pickle-cafe')(require('cucumber'))

pickleCafe.setupHooks()
pickleCafe.setupWorld()

const { Before } = require('cucumber')
const { Page } = require('../../pages/page')

Before(function(){
    this.page = new Page(t)
})