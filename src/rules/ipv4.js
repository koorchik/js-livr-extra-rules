const util = require('../util');
// Octet 0-255 without leading zeros
const octet = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])';
const ipRe = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$`);

function ipv4() {
    return value => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (!ipRe.test(value + '')) return 'NOT_IP';

        return;
    };
}

module.exports = ipv4;
