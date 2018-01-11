var util = require('../util');

function list_length(param1, param2) {
    var minLen, maxLen;

    if ( arguments.length <= 1 ) {
        throw new Error('LIVR: undefined list_length');
    } else if ( arguments.length === 2 ) {
        minLen = param1;
        maxLen = param1;
    } else if ( arguments.length > 2 ) {
        minLen = param1;
        maxLen = param2;
    }

    return function(value) {
        if ( util.isNoValue(value) ) return;
        if (!Array.isArray(value) ) return 'FORMAT_ERROR';

        if ( value.length < minLen) return 'TOO_FEW_ITEMS';
        if ( value.length > maxLen ) return 'TOO_MANY_ITEMS';

        return;
    }
}

module.exports = list_length;