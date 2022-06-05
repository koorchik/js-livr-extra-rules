const Animal = require('./samples/Animal');
const Dog = require('./samples/Dog');

module.exports = {
    "dog1": {"instance_of": Animal},
    "dog2": {"instance_of": Dog},
    "dog3": {"instance_of": [Dog]},
    "empty_field": {"instance_of": Animal},
};