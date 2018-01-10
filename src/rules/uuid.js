var util = require('../util');
const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-4][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function uuid(version) {
    return function(value, params) {
        if ( util.isNoValue(value) ) return;
        if ( typeof value !== 'string' ) return 'FORMAT_ERROR';

        value = value.toLowerCase();

        if ( !value.match(uuidRe) ) return 'NOT_UUID';

        if (typeof version === 'object') version = "v4";

        switch ( version ) {
            case "v1":
                return;
            case "v4":
                if ( ['8', '9', 'a', 'b'].indexOf(value.charAt(19)) === -1) return 'NOT_UUID';
                break;
            default:
                return 'WRONG_UUID_VERSION';
        }
    }
}

module.exports = uuid;