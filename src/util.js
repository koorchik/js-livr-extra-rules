module.exports = {
    isPrimitiveValue: function (value) {
        if (typeof value == 'string') return true;
        if (typeof value == 'number' && isFinite(value)) return true;
        if (typeof value == 'boolean') return true;
        return false;
    },

    looksLikeNumber: function (value) {
        if (! isNaN(+value) ) return true;
        return false;
    },

    isNoValue: function(value) {
        return value === undefined || value === null || value === '';
    }
};