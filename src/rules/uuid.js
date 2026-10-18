const util = require('../util');
// Character code of the version digit (third group) and whether the variant (fourth group)
// must start with 8, 9, a or b
const versions = {
    v1: { versionCode: 0, hasVariant: false },
    v2: { versionCode: 0, hasVariant: false },
    v3: { versionCode: 51, hasVariant: false },
    v4: { versionCode: 52, hasVariant: true },
    v5: { versionCode: 53, hasVariant: true }
};

function uuid(version) {
    if (arguments.length == 1) {
        version = 'v4';
    }

    if (!['v1', 'v2', 'v3', 'v4', 'v5'].includes(version)) {
        throw new Error('LIVR: unsupported uuid version: ' + version);
    }

    const { versionCode, hasVariant } = versions[version];

    return value => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        const str = value + '';
        if (!isUuid(str)) return 'NOT_UUID';
        if (versionCode && str.charCodeAt(14) !== versionCode) return 'NOT_UUID';
        if (hasVariant && !isVariantCode(str.charCodeAt(19))) return 'NOT_UUID';

        return;
    };
}

// 8-4-4-4-12 hex digits
function isUuid(str) {
    return (
        str.length === 36 &&
        str.charCodeAt(8) === 45 &&
        str.charCodeAt(13) === 45 &&
        str.charCodeAt(18) === 45 &&
        str.charCodeAt(23) === 45 &&
        util.isHex(str, 0, 8) &&
        util.isHex(str, 9, 13) &&
        util.isHex(str, 14, 18) &&
        util.isHex(str, 19, 23) &&
        util.isHex(str, 24, 36)
    );
}

// 8, 9, a, b, A or B
function isVariantCode(code) {
    const lowerCode = code | 32;
    return code === 56 || code === 57 || lowerCode === 97 || lowerCode === 98;
}

module.exports = uuid;
