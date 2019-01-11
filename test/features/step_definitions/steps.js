const { GivenTestcafe , WhenTestcafe, ThenTestcafe, testcafe } = require('pickle-cafe')(require('cucumber'))
const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

GivenTestcafe('a user with username {string} and password {string}', async function(name, pass){
    t.ctx.user = {name: name, pass: pass}
    await t.navigateTo('https://gitlab.com/users/sign_in')
})

WhenTestcafe('the user tries to login', async function(){
    await this.page.signin(t.ctx.user)
})

ThenTestcafe('the login fails', async function(){
    await t.expect(this.page.login_error.exists).ok()
})

WhenTestcafe('a client function is called', async function(){
    await t.navigateTo('https://gitlab.com/users/sign_in')
    const getUrl = testcafe.ClientFunction(() => {
        return document.location.href
    }).with({ boundTestRun: t })
    t.ctx.url = await getUrl()
})

ThenTestcafe('the url is available', async function(){
    await t.expect(t.ctx.url).contains('https://gitlab.com/users/sign_in')
})

When('a scenario has no TestCafe', function(){})

Then('TestCafe is not booted', function(){
    expect(typeof this.t).to.equal('undefined')
})