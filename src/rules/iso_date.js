const util = require('../util');
// No capture groups: test() is 2x faster without them
const isoDateRe = /^[0-9]{4}-(?:1[0-2]|0[1-9])-(?:3[01]|0[1-9]|[12][0-9])(?:T(?:2[0-3]|[01][0-9]):[0-5][0-9](?::[0-5][0-9](?:\.[0-9]+)?)?(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9]))?$/;
const isoDateFormats = ['date', 'datetime'];
const isoDateSpecialDates = ['yesterday', 'current', 'tomorrow'];
const minuteMs = 60 * 1000;
const hourMs = 60 * minuteMs;
const dayMs = 24 * hourMs;

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

        // 0 is 1970-01-01, so min and max are compared with undefined
        if (min !== undefined || max !== undefined) {
            const epoch = getEpoch(str);

            if (min !== undefined && epoch < min) return 'DATE_TOO_LOW';
            if (max !== undefined && epoch > max) return 'DATE_TOO_HIGH';
        }

        // A date without time is UTC midnight, so the output is the value itself
        if (str.length === 10) {
            outputArr.push(format === 'date' ? str : str + 'T00:00:00.000Z');
            return;
        }

        const isoString = toISOString(str);
        outputArr.push(format === 'date' ? isoString.slice(0, 10) : isoString);

        return;
    };
}

function getDateFromParams(param, key) {
    if (!param) return;

    const i = isoDateSpecialDates.indexOf(param);
    if (i > -1) return getSpecialDate(i - 1, key);

    const str = param + '';
    if (!isoDateRe.test(str) || !isDateValid(str)) {
        throw new Error('LIVR: wrong date in "' + key + '" parametr');
    }

    const epoch = getEpoch(str);

    // A date without time is UTC midnight, and "max" ends at the end of that UTC day.
    // Adding a local day instead (setDate) gave 23 or 25 hours when the clocks changed
    return key === 'max' && str.length === 10 ? epoch + dayMs - 1 : epoch;
}

// The date on the server ("current"), shifted by dayShift days, as UTC midnight of that date.
// "max" ends at the end of that day
function getSpecialDate(dayShift, key) {
    const date = new Date();
    date.setDate(date.getDate() + dayShift);

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    if (key === 'max') {
        date.setDate(date.getDate() + 1);
        date.setTime(date.getTime() - 1);
    }

    date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

    return date.getTime();
}

// Checks the day of the month. The value starts with "YYYY-MM-DD" matched by isoDateRe
function isDateValid(value) {
    const day = numberAt(value, 8, 2);
    return day <= 28 || day <= daysInMonth(numberAt(value, 0, 4), numberAt(value, 5, 2));
}

function daysInMonth(year, month) {
    if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
}

// The functions below do what Date.parse() and toISOString() do for a value matched by
// isoDateRe, but several times faster. They truncate the fraction of a second to milliseconds,
// as Date.parse() in V8 does for up to 9 digits (it reads ".0704757090" as 704 ms)

function getEpoch(str) {
    const days = daysFromCivil(numberAt(str, 0, 4), numberAt(str, 5, 2), numberAt(str, 8, 2));
    return days * dayMs + (str.length === 10 ? 0 : getTime(str));
}

// Milliseconds from midnight UTC of the date in a value with time to its time in UTC.
// The time zone offset can make it negative, or a day or more
function getTime(str) {
    // "THH:MM"
    let time = numberAt(str, 11, 2) * hourMs + numberAt(str, 14, 2) * minuteMs;
    let i = 16;

    // ":SS" and ".fraction"
    if (str.charCodeAt(i) === 58) {
        time += numberAt(str, 17, 2) * 1000;
        i = 19;

        if (str.charCodeAt(i) === 46) {
            let ms = 0;
            let digits = 0;

            for (i++; isDigitCode(str.charCodeAt(i)); i++) {
                if (digits++ < 3) ms = ms * 10 + str.charCodeAt(i) - 48;
            }
            for (; digits < 3; digits++) ms *= 10;

            time += ms;
        }
    }

    // "Z", "+HH:MM" or "-HH:MM"
    const sign = str.charCodeAt(i);
    if (sign !== 90) {
        const offset = numberAt(str, i + 1, 2) * hourMs + numberAt(str, i + 4, 2) * minuteMs;
        time += sign === 43 ? -offset : offset;
    }

    return time;
}

// "YYYY-MM-DDTHH:MM:SS.sssZ" in UTC for a value with time
function toISOString(str) {
    let time = getTime(str);
    let date = str.slice(0, 10);

    // The time zone offset moved the time to the previous or the next day
    if (time < 0 || time >= dayMs) {
        const dayShift = time < 0 ? -1 : 1;
        date = shiftDate(str, dayShift);
        if (date === undefined) return new Date(getEpoch(str)).toISOString();

        time -= dayShift * dayMs;
    }

    const ms = time % 1000;
    time = (time - ms) / 1000;
    const seconds = time % 60;
    time = (time - seconds) / 60;
    const minutes = time % 60;
    const hours = (time - minutes) / 60;

    return (
        date + 'T' + pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds) + '.' +
        (ms < 100 ? (ms < 10 ? '00' : '0') : '') + ms + 'Z'
    );
}

// "YYYY-MM-DD" of the previous (dayShift -1) or the next (dayShift 1) day.
// Undefined for years outside 0000-9999, as toISOString() writes them as "-000001" and "+010000"
function shiftDate(str, dayShift) {
    let year = numberAt(str, 0, 4);
    let month = numberAt(str, 5, 2);
    let day = numberAt(str, 8, 2) + dayShift;

    if (day < 1) {
        if (--month < 1) {
            month = 12;
            year--;
        }
        day = daysInMonth(year, month);
    } else if (day > daysInMonth(year, month)) {
        day = 1;
        if (++month > 12) {
            month = 1;
            year++;
        }
    }

    if (year < 0 || year > 9999) return;

    return (
        (year < 1000 ? (year < 100 ? (year < 10 ? '000' : '00') : '0') : '') + year + '-' +
        pad2(month) + '-' + pad2(day)
    );
}

// Days since 1970-01-01 in the proleptic Gregorian calendar, as in
// https://howardhinnant.github.io/date_algorithms.html#days_from_civil
function daysFromCivil(year, month, day) {
    if (month <= 2) year--;

    const era = Math.floor(year / 400);
    const yearOfEra = year - era * 400;
    const dayOfYear = Math.floor((153 * (month > 2 ? month - 3 : month + 9) + 2) / 5) + day - 1;
    const dayOfEra =
        yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;

    return era * 146097 + dayOfEra - 719468;
}

function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}

function isDigitCode(code) {
    return code >= 48 && code <= 57;
}

function numberAt(str, start, length) {
    let number = 0;
    for (let i = start; i < start + length; i++) {
        number = number * 10 + str.charCodeAt(i) - 48;
    }
    return number;
}

module.exports = iso_date;
