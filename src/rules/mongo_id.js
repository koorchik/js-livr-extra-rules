const util = require('../util');

function mongo_id() {
    return value => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        const str = value + '';
        if (str.length !== 24 || !util.isHex(str, 0, 24)) return 'NOT_ID';

        return;
    };
}

module.exports = mongo_id;
