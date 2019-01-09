const util = require('../util');

function list_length(param1, param2) {
    let minLen;
    let maxLen;

    if (arguments.length <= 1) {
        throw new Error('LIVR: undefined list_length');
    } else if (arguments.length === 2) {
        minLen = param1;
        maxLen = param1;
    } else if (arguments.length > 2) {
        minLen = param1;
        maxLen = param2;
    }

    return list => {
        if (util.isNoValue(list)) return;
        if (!Array.isArray(list)) return 'FORMAT_ERROR';

        if (list.length < minLen) return 'TOO_FEW_ITEMS';
        if (list.length > maxLen) return 'TOO_MANY_ITEMS';

        return;
    };
}

module.exports = list_length;
