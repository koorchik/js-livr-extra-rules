const util = require('../util');

function is(allowedValue) {
    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return 'REQUIRED';
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (value + '' === allowedValue + '') {
            outputArr.push(allowedValue);
            return;
        }

        return 'NOT_ALLOWED_VALUE';
    };
}

module.exports = is;
