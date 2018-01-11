var util = require('../util');

function list_items_unique() {
    return function(list) {
        if ( util.isNoValue(list) ) return;
        if (!Array.isArray(list) ) return 'FORMAT_ERROR';

        var seen = {};
        var unique = true;
        
        for (var i = 0; i < list.length; i++) {
            if (!util.isPrimitiveValue(list[i]) ) return 'INCOMPARABLE_ITEMS';
            if (seen[list[i]]) {
                unique = false;
            }
            seen[list[i]] = true;
        }

        if (!unique) return 'NOT_UNIQUE_ITEMS'
        
        return;
    }
}

module.exports = list_items_unique;