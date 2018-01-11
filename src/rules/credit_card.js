var util = require('../util');
var numRe = /^\d*$/;

function credit_card() {
    return function(value, params, outputArr) {
        if ( util.isNoValue(value) ) return;
        if (!util.isPrimitiveValue(value) ) return 'FORMAT_ERROR';

        value = value+'';

        if ( value.length > 16 || value.length < 14 ) return 'WRONG_CREDIT_CARD_NUMBER';

        if (!value.match(numRe) ) return 'WRONG_CREDIT_CARD_NUMBER';

        var n = value.length;
        var sum = 0;
        var p = false;

        while ( n-- ) {
            var digit = value.charAt(n) * (1 + p);

            sum += digit - (digit > 9) * 9;
            p = !p;
        }

        if ( sum % 10 ) return 'WRONG_CREDIT_CARD_NUMBER';

        return;
    }
}

module.exports = credit_card;
