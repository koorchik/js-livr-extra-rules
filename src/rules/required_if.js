var util = require('../util');

function required_if(query) {
    var key;
    var queryValue;

    if (arguments.length > 1) {
        key = Object.keys(query)[0];
        queryValue = query[key];
        
        if (!util.isPrimitiveValue(query[key])) {
            throw new Error('LIVR: the target value of the "require_if" rule is incomparable');
        }
        
        if (key.split('/').length > 1) {
            key = key.split('/');
        }
    }

    return function(value, params) {
        if (!util.isNoValue(value) || !queryValue) return;

        var checkValue;

        if (Array.isArray(key)) {
            checkValue = params;
            
            for (var i = 0; i < key.length; i++) {
                checkValue = checkValue[key[i]];
            }
        } else checkValue = params[key];

        if ( checkValue == queryValue && util.isNoValue(value)) return 'REQUIRED';

        return;
    }
}

module.exports = required_if;