const testControllerHolder = {

    t: null,
    captureResolver: null,
    getResolver: null,

    capture: function(t) {
        testControllerHolder.t = t;

        if (testControllerHolder.getResolver) {
            testControllerHolder.getResolver(t);
        }

        return new Promise(function(resolve) {
            testControllerHolder.captureResolver = resolve;
        });
    },

    free: function() {
        testControllerHolder.t = null;

        if (testControllerHolder.captureResolver) {
            testControllerHolder.captureResolver();
        }
    },

    get: function() {
        return new Promise(function(resolve) {
            if (testControllerHolder.t) {
                resolve(testControllerHolder.t);
            } else {
               testControllerHolder.getResolver = resolve;
            }
        });
    },
};

module.exports = testControllerHolder;
