const util = require('../util');

function list_items_unique() {
    return list => {
        if (util.isNoValue(list)) return;
        if (!Array.isArray(list)) return 'FORMAT_ERROR';

        const seen = {};
        let unique = true;

        for (const item of list) {
            if (!util.isPrimitiveValue(item)) return 'INCOMPARABLE_ITEMS';
            if (seen[item]) {
                unique = false;
            }
            seen[item] = true;
        }

        if (!unique) return 'NOT_UNIQUE_ITEMS';

        return;
    };
}

module.exports = list_items_unique;
