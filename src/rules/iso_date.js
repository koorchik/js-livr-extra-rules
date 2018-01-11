var util = require('../util');
var isoDateRe = /^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])(T(2[0-3]|[01][0-9]):([0-5][0-9])(:([0-5][0-9])(\.[0-9]+)?)?Z?)?$/;
var isoDateFormats = [ "date", "datetime" ];
var isoDateSpecialDates = [ "yesterday", "current", "tomorrow" ];
var isoDateSpecialAdds = [ -24 * 60 * 60 * 1000, 0, 24 * 60 * 60 * 1000 ];

function iso_date(params) {
    var min;
    var max;
    var format = "date";

    if ( arguments.length > 1 ) {
        min = getDateFromParams(params.min, "min");
        max = getDateFromParams(params.max, "max");
        if ( isoDateFormats.indexOf(params.format) > -1 ) format = params.format;
    }

    return function(value, params, outputArr) {
        if ( util.isNoValue(value) ) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

        if (!(value+'').match(isoDateRe) ) return 'WRONG_DATE';

        var epoch = Date.parse(value);
        if (!epoch && epoch !== 0 ) return 'WRONG_DATE';

        if ( min && epoch < min ) return 'DATE_TOO_LOW';
        if ( max && epoch > max ) return 'DATE_TOO_HIGH';

        var date = new Date(epoch);
        if ( format === "date" ) {
            outputArr.push(date.toISOString());
        } else {
            outputArr.push(date.toISOString());
        }
        
        return;
    }
}

function getDateFromParams(param, key) {
    if (!param) return;

    var i = isoDateSpecialDates.indexOf(param);

    if ( i > -1 ) {
        return new Date(new Date().getTime() + isoDateSpecialAdds[i]).getTime();
    }
    
    if (!(param+'').match(isoDateRe) ) {
        throw new Error('LIVR: wrong date in "' + key + '" parametr');
    }
    
    var epoch = Date.parse(param);

    if (!epoch && epoch !== 0) {
        throw new Error('LIVR: wrong date in "' + key + '" parametr');
    }

    return epoch;
}

module.exports = iso_date;