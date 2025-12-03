const util = require('../util');
const md5Re = /^[a-f0-9]{32}$/i;

function md5() {
    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (!md5Re.test(value + '')) return 'NOT_MD5';

        outputArr.push(value + '');

        return;
    };
}

module.exports = md5;
