const uuidValidate = require('uuid-validate');
const util         = require('../util');

function uuid() {
    return function(value) {
        if ( util.isNoValue(value) ) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (uuidValidate(value)) {
            return;
        }
        return 'NOT_UUID';
    }
}

module.exports = uuid;
