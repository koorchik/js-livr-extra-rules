const Dog = require('./samples/Dog');

module.exports = {
    "dog1": {"instance_of": Dog},
    "dog2": {"instance_of": [Dog]},
    "empty_field": {"instance_of": Dog},

    "value_is_string":      {"instance_of": Dog},
    "value_is_hash":        {"instance_of": Dog},
    "value_is_empty_hash":  {"instance_of": Dog},
    "value_is_array":       {"instance_of": Dog},
    "value_is_empty_array": {"instance_of": Dog}
};