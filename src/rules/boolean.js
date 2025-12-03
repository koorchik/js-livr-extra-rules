const util = require('../util');

function boolean() {
    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (value === true || value === 1 || value === 'true' || value === '1') {
            outputArr.push(true);
            return;
        }
        if (value === false || value === 0 || value === 'false' || value === '0') {
            outputArr.push(false);
            return;
        }

        return 'NOT_BOOLEAN';
    };
}

module.exports = boolean;
