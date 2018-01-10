var util = require('../util');
const uuidRe = {
    'v1' : /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    'v3' : /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    'v4' : /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    'v5' : /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
};

function uuid(version) {
    return function(value, params) {
        if ( util.isNoValue(value) ) return;
        if ( typeof value !== 'string' ) return 'FORMAT_ERROR';

        value = value.toLowerCase();

        if (typeof version === 'object') version = "v4";

        if ( [ 'v1', 'v2', 'v3', 'v4', 'v5' ].indexOf(version) !== -1 ) {
            if ( !value.match(uuidRe[version === 'v2' ? 'v1' : version]) ) return 'NOT_UUID';
        } else return 'WRONG_UUID_VERSION';

        return;
    }
}

module.exports = uuid;