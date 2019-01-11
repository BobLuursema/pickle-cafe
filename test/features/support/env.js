const pickleCafe = require('pickle-cafe')(require('cucumber'))
const { setWorldConstructor, Before } = require('cucumber')
const { Page } = require('../../pages/page')

setWorldConstructor(function({attach, parameters}){
    this.attach = attach
    this.parameters = parameters
    pickleCafe.pickleCafeWorld.call(this)
})

pickleCafe.setupHooks()
Before({tags: '@testcafe'}, function(){
    this.page = new Page(t)
})
