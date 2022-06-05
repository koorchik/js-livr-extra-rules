const util = require('../util');

function has_methods(requiredMethods) {
    if (!Array.isArray(requiredMethods)) {
        requiredMethods = Array.prototype.slice.call(arguments);
        requiredMethods.pop(); // pop ruleBuilders
    }

    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (util.isPrimitiveValue(value)) return 'FORMAT_ERROR';
        
        for (const method of requiredMethods) {
            if (!value[method] || typeof value[method] !== 'function' ) {
                return `NOT_HAVING_METHOD [${method}]`
            }
        }

        return;
    };
}

module.exports = has_methods;
