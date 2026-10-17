const util = require('../util');

function list_items_unique() {
    return list => {
        if (util.isNoValue(list)) return;
        if (!Array.isArray(list)) return 'FORMAT_ERROR';

        const seen = new Set();
        let hasDuplicate = false;

        for (const item of list) {
            if (!util.isPrimitiveValue(item)) return 'INCOMPARABLE_ITEMS';

            // Items are compared by string representation: 1 and "1" are equal
            const key = item + '';
            if (seen.has(key)) {
                hasDuplicate = true;
            } else {
                seen.add(key);
            }
        }

        if (hasDuplicate) return 'NOT_UNIQUE_ITEMS';

        return;
    };
}

module.exports = list_items_unique;
