const util = require('../util');

function list_items_unique() {
    return list => {
        if (util.isNoValue(list)) return;
        if (!Array.isArray(list)) return 'FORMAT_ERROR';

        const seen = new Set();
        let hasDuplicate = false;

        for (const item of list) {
            if (!util.isPrimitiveValue(item)) return 'INCOMPARABLE_ITEMS';
            if (seen.has(item)) {
                hasDuplicate = true;
            } else {
                seen.add(item);
            }
        }

        if (hasDuplicate) return 'NOT_UNIQUE_ITEMS';

        return;
    };
}

module.exports = list_items_unique;
