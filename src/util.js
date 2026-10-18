// 1 for the character codes of 0-9, a-f and A-F
const hexDigits = new Uint8Array(128);
for (const char of '0123456789abcdefABCDEF') hexDigits[char.charCodeAt(0)] = 1;

module.exports = {
    isPrimitiveValue(value) {
        if (typeof value == 'string') return true;
        if (typeof value == 'number' && isFinite(value)) return true;
        if (typeof value == 'boolean') return true;
        return false;
    },

    // looksLikeNumber(value) {
    //     if (!isNaN(+value)) return true;
    //     return false;
    // },

    isNoValue(value) {
        return value === undefined || value === null || value === '';
    },

    // "keys" is a JSON pointer split by "/"
    JSONPointer(object, keys) {
        let value = object;

        for (let i = 0; i < keys.length; i++) {
            if (!value) break;
            value = value[keys[i]];
        }

        return value;
    },

    // Checks that the characters from "start" to "end" (not included) are hex digits
    isHex(str, start, end) {
        for (let i = start; i < end; i++) {
            const code = str.charCodeAt(i);
            if (code > 127 || hexDigits[code] === 0) return false;
        }

        return true;
    }
};
