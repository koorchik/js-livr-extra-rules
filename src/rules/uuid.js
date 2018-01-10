var util = require('../util');
const uuidRe = {
    'v1' : /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    'v2' : /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    'v3' : /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    'v4' : /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    'v5' : /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
};

function uuid(version, allRules) {
    if (arguments.length == 1)  {
        version = 'v4';
    }

    if ( [ 'v1', 'v2', 'v3', 'v4', 'v5' ].indexOf(version) === -1 ) {
        throw new Error( 'LIVR: unsupported uuid version: ' + version );
    }
    
    return function(value, params) {
        if ( util.isNoValue(value) ) return;
        if (!util.isPrimitiveValue(value) ) return 'FORMAT_ERROR';

        if ( !(value+"").match(uuidRe[version]) ) return 'NOT_UUID';
        return;
    }
}

module.exports = uuid;