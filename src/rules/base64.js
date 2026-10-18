const util = require('../util');

// 1 for the character codes of A-Z, a-z, 0-9, "+" and "/"
const alphabet = new Uint8Array(128);
for (const char of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/') {
    alphabet[char.charCodeAt(0)] = 1;
}

function base64(padding) {
    const isPaddingRequired = padding !== 'relaxed';

    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        const str = value + '';
        if (!isBase64(str, isPaddingRequired)) return 'MALFORMED_BASE64';

        outputArr.push(str);

        return;
    };
}

// Groups of 4 characters. The last group may end with "==" or "=". Without padding
// ("relaxed") the last group may have 2 or 3 characters
function isBase64(str, isPaddingRequired) {
    const length = str.length;
    let dataLength = length;

    if (str.charCodeAt(length - 1) === 61) {
        dataLength--;
        if (str.charCodeAt(length - 2) === 61) dataLength--;
    }

    const remainder = length % 4;
    if (isPaddingRequired || dataLength < length) {
        if (remainder !== 0) return false;
    } else if (remainder === 1) {
        return false;
    }

    for (let i = 0; i < dataLength; i++) {
        const code = str.charCodeAt(i);
        if (code > 127 || alphabet[code] === 0) return false;
    }

    return true;
}

module.exports = base64;
