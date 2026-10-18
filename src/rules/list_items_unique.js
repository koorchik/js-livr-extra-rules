const util = require('../util');
// Up to this length, comparing every pair of items is faster than a Set
const maxPairwiseLength = 20;

function list_items_unique() {
    return list => {
        if (util.isNoValue(list)) return;
        if (!Array.isArray(list)) return 'FORMAT_ERROR';

        const hasDuplicate =
            list.length <= maxPairwiseLength ? hasDuplicatePairwise(list) : hasDuplicateInSet(list);

        if (hasDuplicate === undefined) return 'INCOMPARABLE_ITEMS';
        if (hasDuplicate) return 'NOT_UNIQUE_ITEMS';

        return;
    };
}

// Items are compared by string representation: 1 and "1" are equal.
// Both functions return undefined if an item is not a primitive value
function hasDuplicatePairwise(list) {
    const keys = new Array(list.length);
    let hasDuplicate = false;

    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!util.isPrimitiveValue(item)) return;

        const key = item + '';
        if (!hasDuplicate) {
            for (let j = 0; j < i; j++) {
                if (keys[j] === key) {
                    hasDuplicate = true;
                    break;
                }
            }
        }
        keys[i] = key;
    }

    return hasDuplicate;
}

function hasDuplicateInSet(list) {
    const seen = new Set();
    let hasDuplicate = false;

    for (const item of list) {
        if (!util.isPrimitiveValue(item)) return;

        const key = item + '';
        if (seen.has(key)) {
            hasDuplicate = true;
        } else {
            seen.add(key);
        }
    }

    return hasDuplicate;
}

module.exports = list_items_unique;
