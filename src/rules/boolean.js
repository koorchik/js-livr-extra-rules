const util = require('../util');

function boolean() {
    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (['1', 1, 'true', true].indexOf(value) >= 0) {
            outputArr.push(true);
            return;
        } else if (['0', 0, 'false', false].indexOf(value) >= 0) {
            outputArr.push(false);
            return;
        }

        return 'NOT_BOOLEAN';
    };
}

module.exports = boolean;
