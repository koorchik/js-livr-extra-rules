var util = require('../util');
var requireRe =  /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
var optionalRe = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}(==)?|[A-Za-z0-9+\/]{3}=?)?$/;

function base64(padding) {
    var base64Re = padding === 'relaxed'
        ? optionalRe
        : requireRe;

    return function (value, params, outputArr) {
        if ( util.isNoValue(value) ) return;
        if (!util.isPrimitiveValue(value) ) return 'FORMAT_ERROR';

        if (!(value+'').match(base64Re) ) return 'MALFORMED_BASE64';

        outputArr.push(value+'');

        return;
    }
}

module.exports = base64;