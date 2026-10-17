const util = require('../util');

function credit_card() {
    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        value = value + '';

        if (value.length > 16 || value.length < 14) return 'WRONG_CREDIT_CARD_NUMBER';

        // Luhn checksum
        let sum = 0;
        let isDoubled = false;

        for (let n = value.length - 1; n >= 0; n--) {
            let digit = value.charCodeAt(n) - 48;
            if (digit < 0 || digit > 9) return 'WRONG_CREDIT_CARD_NUMBER';

            if (isDoubled) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            isDoubled = !isDoubled;
        }

        if (sum % 10) return 'WRONG_CREDIT_CARD_NUMBER';

        return;
    };
}

module.exports = credit_card;
