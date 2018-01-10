'use strict'
var util = require('../util');

function list_length(_minLen, _maxLen) {
    if ( arguments.length === 1 ) {
        throw new Error('LIVR: undefined list_length');
    }

    const minLen = _minLen;
    let maxLen = _minLen;

    if ( arguments.length > 2 ) {
        maxLen = _maxLen;
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