/* Wrapper for the Given, When and Then Cucumber functions, this wrapper adds any error to the TestCafé testrun 
 * since both Cucumber and TestCafé use a catch to find errors in the tests, but Cucumber catches them before TestCafé
 * sees them. This wrapper makes the error also known to TestCafé so that you can also use the TestCafé reporting
*/
module.exports = function(fn){
    const arity = fn.length
    switch(arity){
        case 0:
            return async function(){try {return await fn.apply(this, arguments)} catch(ex){t.testRun.addError(ex);throw ex}}
        case 1:
            return async function(a){try {return await fn.apply(this, arguments)} catch(ex){t.testRun.addError(ex);throw ex}}
        case 2:
            return async function(a, b){try {return await fn.apply(this, arguments)} catch(ex){t.testRun.addError(ex);throw ex}}
        case 3:
            return async function(a, b, c){try {return await fn.apply(this, arguments)} catch(ex){t.testRun.addError(ex);throw ex}}
        default:
            throw Error('Expand wrapper!')
    }
}