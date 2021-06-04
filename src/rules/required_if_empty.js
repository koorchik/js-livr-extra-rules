const util = require('../util');

function required_if_empty(queryKey) {
        if (!util.isPrimitiveValue(queryKey)) {
            throw new Error(
                'LIVR: the target value of the "required_if_empty" rule is missed or incomparable'
            );
        }

    return (value, params) => {
        if (!util.isNoValue(value) || !queryKey) return;

        const valueToCheck = util.JSONPointer(params, queryKey);

        if (!valueToCheck && util.isNoValue(value)) return 'REQUIRED';
    };
}

module.exports = required_if_empty;
