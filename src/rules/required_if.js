const util = require('../util');

function required_if(query) {
    let queryKey;
    let queryValue;

    if (arguments.length > 1) {
        queryKey = Object.keys(query)[0];
        queryValue = query[queryKey];

        if (!queryValue || !util.isPrimitiveValue(queryValue)) {
            throw new Error(
                'LIVR: the target value of the "require_if" rule is missed or incomparable'
            );
        }
    }

    return (value, params) => {
        if (!util.isNoValue(value) || !queryKey) return;

        var valueToCheck = util.JSONPointer(params, queryKey);

        if (valueToCheck == queryValue && util.isNoValue(value)) return 'REQUIRED';

        return;
    };
}

module.exports = required_if;
