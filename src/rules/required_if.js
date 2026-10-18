const util = require('../util');

function required_if(query) {
    let queryKey;
    let queryKeys;
    let queryValue;

    if (arguments.length > 1) {
        queryKey = Object.keys(query)[0];
        queryValue = query[queryKey];

        if (!queryValue || !util.isPrimitiveValue(queryValue)) {
            throw new Error(
                'LIVR: the target value of the "require_if" rule is missed or incomparable'
            );
        }

        queryKeys = queryKey.split('/');
    }

    return (value, params) => {
        if (!util.isNoValue(value) || !queryKey) return;

        const valueToCheck = util.JSONPointer(params, queryKeys);

        if (valueToCheck == queryValue) return 'REQUIRED';

        return;
    };
}

module.exports = required_if;
