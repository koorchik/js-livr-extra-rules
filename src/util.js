module.exports = {
    isPrimitiveValue(value) {
        if (typeof value == 'string') return true;
        if (typeof value == 'number' && isFinite(value)) return true;
        if (typeof value == 'boolean') return true;
        return false;
    },

    // looksLikeNumber(value) {
    //     if (!isNaN(+value)) return true;
    //     return false;
    // },

    isNoValue(value) {
        return value === undefined || value === null || value === '';
    },

    JSONPointer(object, pointer) {
        const parts = pointer.split('/');
        let value = object;

        for (const part of parts) {
            if (!value) break;
            value = value[part];
        }

        return value;
    }
};
