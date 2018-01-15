var util = require('../util');

function required_if(query) {
    var entry;

    if (arguments.length > 1) {
        entry = Object.entries(query);
        entry = entry[0];
        
        if (!util.isPrimitiveValue(entry[1])) {
            throw new Error('LIVR: the target value of the "require_if" rule is incomparable');
        }
        
        if (entry[0].split('/').length > 1) {
            entry[0] = entry[0].split('/');
        }
    }

    return function(value, params) {
        if (!util.isNoValue(value) || !entry) return;

        var checkValue;

        if (Array.isArray(entry[0])) {
            checkValue = params;
            
            for (var i = 0; i < entry[0].length; i++) {
                checkValue = checkValue[entry[0][i]];
            }
        } else checkValue = params[entry[0]];

        if ( checkValue == entry[1] && util.isNoValue(value)) return 'REQUIRED';

        return;
    }
}

module.exports = required_if;