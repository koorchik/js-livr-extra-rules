const util = require('../util');
const isoDateRe = /^(([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]))(T(2[0-3]|[01][0-9]):([0-5][0-9])(:([0-5][0-9])(\.[0-9]+)?)?(Z|[\+\-](2[0-3]|[01][0-9]):([0-5][0-9])))?$/;
const dateRe = /^(\d{4})-([0-1][0-9])-([0-3][0-9])$/;
const isoDateFormats = ['date', 'datetime'];
const isoDateSpecialDates = ['yesterday', 'current', 'tomorrow'];

function iso_date(params) {
    let min;
    let max;
    let format = 'date';

    if (arguments.length > 1) {
        min = getDateFromParams(params.min, 'min');
        max = getDateFromParams(params.max, 'max');

        // max && console.log('max', params.max, (new Date(max)).toISOString());
        if (params.format === 'datetime') format = params.format;
    }

    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        const matched = (value + '').match(isoDateRe);

        if (!matched || !isDateValid(matched[1])) return 'WRONG_DATE';

        const epoch = Date.parse(value);
        if (!epoch && epoch !== 0) return 'WRONG_DATE';

        if (min && epoch < min) return 'DATE_TOO_LOW';
        if (max && epoch > max) return 'DATE_TOO_HIGH';

        const date = new Date(epoch);

        if (format === 'date') {
            outputArr.push(date.toISOString().split('T')[0]);
        } else {
            outputArr.push(date.toISOString());
        }

        return;
    };
}

function getDateFromParams(param, key) {
    if (!param) return;

    const matched = (param + '').match(isoDateRe);

    const i = isoDateSpecialDates.indexOf(param);

    if (i > -1) {
        date = new Date();
        date.setDate(date.getDate() + (i - 1));
    } else if (!matched || !isDateValid(matched[1])) {
        throw new Error('LIVR: wrong date in "' + key + '" parametr');
    } else {
        const epoch = Date.parse(param);

        if (!epoch && epoch !== 0) {
            throw new Error('LIVR: wrong date in "' + key + '" parametr');
        }

        date = new Date(epoch);
    }

    if (!matched || !matched[5]) {
        if (!matched) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
        }

        if (key === 'max') {
            date.setDate(date.getDate() + 1);
            date.setTime(date.getTime() - 1);
        }

        if (!matched) date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }

    return date.getTime();
}

function isDateValid(value) {
    const matched = value.match(dateRe);

    if (matched) {
        const epoch = Date.parse(value);
        if (!epoch && epoch !== 0) return false;

        const d = new Date(epoch);
        d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

        if (
            d.getFullYear() == matched[1] &&
            d.getMonth() + 1 == +matched[2] &&
            d.getDate() == +matched[3]
        ) {
            return true;
        }
    }

    return false;
}

module.exports = iso_date;
