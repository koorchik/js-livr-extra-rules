const util = require('../util');
const ipRe = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

function ipv4() {
    return value => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        const match = (value + '').match(ipRe);
        if (!match) return 'NOT_IP';

        for (let i = 1; i < 4; i++) {
            if (match[i].length >= 2 && /^0/.test(match[i])) {
                return 'NOT_IP';
            }
        }

        return;
    };
}

module.exports = ipv4;
