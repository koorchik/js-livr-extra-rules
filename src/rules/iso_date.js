const util = require('../util');
const isoDateRe = /^(([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]))(T(2[0-3]|[01][0-9]):([0-5][0-9])(:([0-5][0-9])(\.[0-9]+)?)?(Z|[\+\-](2[0-3]|[01][0-9]):([0-5][0-9])))?$/;
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

        const str = value + '';
        if (!isoDateRe.test(str) || !isDateValid(str)) return 'WRONG_DATE';

        // A date without time is UTC midnight, so the output is the value itself
        if (str.length === 10 && !min && !max) {
            outputArr.push(format === 'date' ? str : str + 'T00:00:00.000Z');
            return;
        }

        const epoch = Date.parse(str);
        if (!epoch && epoch !== 0) return 'WRONG_DATE';

        if (min && epoch < min) return 'DATE_TOO_LOW';
        if (max && epoch > max) return 'DATE_TOO_HIGH';

        const date = new Date(epoch);

        if (format === 'date') {
            outputArr.push(date.toISOString().slice(0, 10));
        } else {
            outputArr.push(date.toISOString());
        }

        return;
    };
}

function getDateFromParams(param, key) {
    if (!param) return;

    let date;
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

// Checks the day of the month. The value starts with "YYYY-MM-DD" matched by isoDateRe
function isDateValid(value) {
    const year = numberAt(value, 0, 4);
    const month = numberAt(value, 5, 2);
    const day = numberAt(value, 8, 2);

    if (day <= 28) return true;
    if (month === 2) {
        const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        return day <= (isLeapYear ? 29 : 28);
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) return day <= 30;
    return true;
}

function numberAt(str, start, length) {
    let number = 0;
    for (let i = start; i < start + length; i++) {
        number = number * 10 + str.charCodeAt(i) - 48;
    }
    return number;
}

module.exports = iso_date;
