const Cat = require('./samples/Cat');

module.exports = {
    "dog1": {"instance_of": Cat},
    "dog2": {"instance_of": Cat},
    "empty_field": "",
    "extra_field": "aaaa",

    "value_is_string":      "test",
    "value_is_hash":        {"test": 1},
    "value_is_empty_hash":  {},
    "value_is_array":       ["test", 1],
    "value_is_empty_array": []
}