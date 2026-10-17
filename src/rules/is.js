const util = require('../util');

function is(allowedValue) {
    const allowedString = allowedValue + '';

    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return 'REQUIRED';
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (value + '' === allowedString) {
            outputArr.push(allowedValue);
            return;
        }

        return 'NOT_ALLOWED_VALUE';
    };
}

module.exports = is;
