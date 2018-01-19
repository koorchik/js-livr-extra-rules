module.exports = {
    'base64': require('./rules/base64'),
    'boolean': require('./rules/boolean'),
    'credit_card': require('./rules/credit_card'),
    'ipv4': require('./rules/ipv4'),
    'is': require('./rules/is'),
    'iso_date': require('./rules/iso_date'),
    'list_items_unique': require('./rules/list_items_unique'),
    'list_length': require('./rules/list_length'),
    'md5': require('./rules/md5'),
    'mongo_id': require('./rules/mongo_id'),
    'required_if': require('./rules/required_if'),
    'uuid': require('./rules/uuid')
};
