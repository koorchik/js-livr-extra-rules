var util = require('../util');

function boolean() {
    return function(value, params, outputArr) {
        if (value === '') outputArr.push(false);
        if ( util.isNoValue(value) ) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (typeof value === 'string') return 'NOT_BOOLEAN';
        if (typeof value === 'number' && (value < 0 || value > 1)) return 'NOT_BOOLEAN';

        outputArr.push(!!value);

        return;
    }
}

module.exports = boolean;
