const util = require('../util');

function md5() {
    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        const str = value + '';
        if (str.length !== 32 || !util.isHex(str, 0, 32)) return 'NOT_MD5';

        outputArr.push(str);

        return;
    };
}

module.exports = md5;
