var util = require('../util');
var md5Re = /^[a-f0-9]{32}$/i;

function md5() {
    return function(value) {
        if ( util.isNoValue(value) ) return;
        if (!util.isPrimitiveValue(value) ) return 'FORMAT_ERROR';

        if ( !(value+'').match(md5Re) ) return 'NOT_MD5';
        return;
    }
}

module.exports = md5;