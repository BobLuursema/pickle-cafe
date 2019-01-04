const testControllerHolder = require('./testControllerHolder');
const base64Img = require('base64-img');

module.exports = function({attach, parameters}) {

    this.waitForTestController = testControllerHolder.get()
        .then(function(t) {
            if(global.setupClasses){
                for(let c of setupClasses){
                    this[c.tcName()] = new c(t)
                }
            }
            this.t = t
            return t
        });

    this.attach = attach
    this.parameters = parameters

    this.addScreenshotToReport = function() {
        if (process.argv.includes('--format') || process.argv.includes('-f') || process.argv.includes('--format-options')) {
            testController.takeScreenshot()
                .then(function(screenshotPath) {
                    const imgInBase64 = base64Img.base64Sync(screenshotPath);
                    const imageConvertForCuc = imgInBase64.substring(imgInBase64.indexOf(',') + 1);
                    return attach(imageConvertForCuc, 'image/png');
                })
                .catch(function(error) {
                    console.warn('The screenshot was not attached to the report');
                });
        } else {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    };

    this.attachScreenshotToReport = function(pathToScreenshot) {
        const imgInBase64 = base64Img.base64Sync(pathToScreenshot);
        const imageConvertForCuc = imgInBase64.substring(imgInBase64.indexOf(',') + 1);
        return attach(imageConvertForCuc, 'image/png');
    };
}