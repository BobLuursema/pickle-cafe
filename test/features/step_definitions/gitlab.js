const { Given, When, Then, testcafe } = require('pickle-cafe')(require('cucumber'))

Given('a user with username {string} and password {string}', async function(name, pass){
    t.ctx.user = {name: name, pass: pass}
    await t.navigateTo('https://gitlab.com/users/sign_in')
})

When('the user tries to login', async function(){
    await this.page.signin(t.ctx.user)
})

Then('the login fails', async function(){
    await t.expect(this.page.login_error.exists).ok()
})

When('a client function is called', async function(){
    await t.navigateTo('https://gitlab.com/users/sign_in')
    const getUrl = testcafe.ClientFunction(() => {
        return document.location.href
    }).with({ boundTestRun: t })
    t.ctx.url = await getUrl()
})

Then('the url is available', async function(){
    await t.expect(t.ctx.url).contains('https://gitlab.com/users/sign_in')
})