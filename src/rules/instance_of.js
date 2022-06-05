const util = require('../util');

function instance_of(expectedClass) {
    if (!expectedClass) {
        throw new Error('LIVR: instance_of requires class');
    }

    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (util.isPrimitiveValue(value)) return 'FORMAT_ERROR';
        
        if (!(value instanceof expectedClass)) return 'WRONG_INSTANCE';
        return;
    };
}

module.exports = instance_of;
