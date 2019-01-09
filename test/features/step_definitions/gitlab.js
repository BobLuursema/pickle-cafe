const { Given, When, Then } = require('pickle-cafe')(require('cucumber'))

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