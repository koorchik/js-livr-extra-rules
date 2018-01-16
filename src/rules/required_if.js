var util = require('../util');

function required_if(query) {
    var queryKey;
    var queryValue;

    if (arguments.length > 1) {
        queryKey = Object.keys(query)[0];
        queryValue = query[queryKey];
        
        if (!util.isPrimitiveValue(queryValue)) {
            throw new Error('LIVR: the target value of the "require_if" rule is incomparable');
        }
        
        if (queryKey.split('/').length > 1) {
            queryKey = queryKey.split('/');
        }
    }

    return function(value, params) {
        if (!util.isNoValue(value) || !queryValue) return;

        var checkValue;

        if (Array.isArray(queryKey)) {
            checkValue = params;
            
            for (var i = 0; i < queryKey.length; i++) {
                checkValue = checkValue[queryKey[i]];
            }
        } else checkValue = params[queryKey];

        if ( checkValue == queryValue && util.isNoValue(value)) return 'REQUIRED';

        return;
    }
}

module.exports = required_if;