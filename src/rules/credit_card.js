const util = require('../util');
const numRe = /^\d*$/;

function credit_card() {
    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        value = value + '';

        if (value.length > 16 || value.length < 14) return 'WRONG_CREDIT_CARD_NUMBER';

        if (!value.match(numRe)) return 'WRONG_CREDIT_CARD_NUMBER';

        let n = value.length;
        let sum = 0;
        let p = false;

        while (n--) {
            var digit = value.charAt(n) * (1 + p);

            sum += digit - (digit > 9) * 9;
            p = !p;
        }

        if (sum % 10) return 'WRONG_CREDIT_CARD_NUMBER';

        return;
    };
}

module.exports = credit_card;
