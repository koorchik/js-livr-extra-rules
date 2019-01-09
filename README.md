# livr-extra-rules

[![Build Status](https://travis-ci.org/koorchik/js-livr-extra-rules.svg?branch=master)](https://travis-ci.org/koorchik/js-livr-extra-rules)
[![npm version](https://badge.fury.io/js/livr-extra-rules.svg)](https://badge.fury.io/js/livr-extra-rules)
[![Known Vulnerabilities](https://snyk.io/test/github/koorchik/js-livr-extra-rules/badge.svg?targetFile=package.json)](https://snyk.io/test/github/koorchik/js-livr-extra-rules?targetFile=package.json)

LIVR specification contains the most common rules that every implementation should support.

The module contains extra rules for [JavaScript LIVR](https://www.npmjs.com/package/livr). It is absolutely ok for LIVR to have your own custom rules in your project. But there are some rules that are useful cross projects.

Moreover, [LIVR](https://www.npmjs.com/package/livr) itself and this module have **zero dependecies**. It means:

-   Lighter builds
-   Easier to maintain high level of security

## Usage

```sh
npm install --save livr livr-extra-rules
```

```js
import LIVR from livr;
import extraRules from 'livr-extra-rules';
LIVR.Validator.registerDefaultRules(extraRules);
```

## Documentation

-   [LIVR for JavaScript](https://www.npmjs.com/package/livr)
-   [Official LIVR documentation](http://livr-spec.org/)

## Rules

-   ipv4
-   boolean
-   credit_card
-   uuid
-   mongo_id
-   list_length
-   list_items_unique
-   base64
-   md5
-   iso_date (extended version)
-   required_if
-   is

### ipv4

Example:

```js
{
    field: 'ipv4';
}
```

**Error code**: 'NOT_IP'

### boolean

Checks that the value is true or false

-   True values: `true`, `1`, `'1'`
-   False values: `false`, `0`, `'0'`

String values (except empty string) will force error "NOT_BOOLEAN".

Return value will converted to JavaScript boolean values - `true` or `false`

Example:

```js
{
    field: 'boolean';
}
```

**Error code**: 'NOT_BOOLEAN'

### is

Сhecks the presence of the value and its correspondence to the specified value

Example:

```js
{
    field: { 'is': 'some value' }
}
```

**Error codes**: 'REQUIRED', 'NOT_ALLOWED_VALUE

### credit_card

Checks that the value is a credit card number with [Lunh Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)

Example:

```js
{
    field: 'credit_card';
}
```

**Error code**: 'WRONG_CREDIT_CARD_NUMBER'

### uuid

Example:

```js
{
    field1: 'uuid', // default v4
    field2: {uuid: 'v1'},
    field3: {uuid: 'v2'},
    field4: {uuid: 'v3'},
    field5: {uuid: 'v4'},
    field6: {uuid: 'v5'}
}
```

**Error code**: 'NOT_UUID'

### mongo_id

Checks that the value looks like mongo object id

Example:

```js
{
    field: 'mongo_id',
}
```

**Error code**: 'NOT_ID'

### list_length

Checks that the value is a list and it contains required number of elements.
You can pass exact number of elements required or a range.

_Do not forget about "required" rule if you want the field to be required._

Example:

```js
{
    list1: ['required', { list_length: 10 }]; // List is required and should contain exactly 10 items,
    list2: {
        list_length: 10;
    } // List is not required but if it is present, it should contain exactly 10 items
    list3: {
        list_length: [3, 10];
    } // List is not required but if it is present, it should has from 3 to 10 items
}
```

**Error codes**: 'FORMAT_ERROR', 'TOO_FEW_ITEMS', 'TOO_MANY\_\ITEMS'

### list_items_unique

Checks that items in list are unique. if the value is not an array, the rule will return "FORMAT_ERROR". The rule will check string representations of the values and supports only primitive values. if the value is not primitive (array, object) then the rule will return 'INCOMPARABLE_ITEMS'

Example:

```js
{
    list: 'list_items_unique';
}
```

**Error codes**: 'FORMAT_ERROR', 'NOT_UNIQUE_ITEMS', 'INCOMPARABLE_ITEMS'

### base64

Checks that the value is a base64 string

Example:

```js
{
    field1: 'base64'; // by default, padding is required
    field2: {
        base64: 'relaxed';
    } // padding is optional
}
```

**Error code**: 'MALFORMED_BASE64'

## md5

Checks the value is a md5 hash string

Example:

```js
{
    field: 'md5';
}
```

**Error code**: 'NOT_MD5'

### iso_date

This rule is compatible with the standard "iso_date" rule (and will redefine it) but allows you to pass extra params - "min" and "max" dates.

There are special dates: "current", "yesterday", "tomorrow". You can use them if you want to check that passed date is in the future or in the past.

Example:

```js
{
    date1: "iso_date",
    date2: { "iso_date": {min: "2017-10-15"} },
    date3: { "iso_date": {max: "2017-10-30"} },
    date4: { "iso_date": {min: "2017-10-15T15:30Z", max: "2017-10-30", format: "datetime"} },
    date5: { "iso_date": {min: "current", max: "tomorrow"} },
    date6: { "iso_date": {format: "datetime"} },
}
```

Supported options:

-   "min" - can be iso8601 date, iso 8601 datetime, "current", "tomorrow", "yesterday".
-   "max" - can be iso8601 date, iso 8601 datetime, "current", "tomorrow", "yesterday".
-   "format" - can be "date", "datetime". (default "date")

If you pass only date (without time) to "min" or "max" and expected format of user's input is "datetime" then:

-   "min" starts from the beginning of min date.
-   "max" ends at the end of the max date.

If you pass the time along with the date, then you need to specify the time zone.

**Error codes**: 'WRONG_DATE', 'DATE_TOO_LOW', 'DATE_TOO_HIGH'

### required_if

Checks that the value is present if another field is present and has value.

Simple example:

```js
{
    sendMeEmails: { one_of: [0, 1] },
    email: { 'required_if': { sendMeEmails: '1' } }
}
```

Example with JSON pointer:

```js
{
    address: {nested_object: {
        city: 'required',
        street: 'required'
    }},

    email: { 'required_if': { 'address/city': 'Kyiv' } }
}
```

You cannot access parent fields with JSON pointers here, only siblings and nested values.

**Error code**: 'REQUIRED'

## How to add own rule?

if you want to add own rule, you will need:

1. Create a new file for the rule in src/rules (see existing rules)
2. Add rule to src/index.js
3. Add positive tests to tests/test_suite/positive/your_rule_name/ (see existing tests)
4. Add negative tests to tests/test_suite/negative/your_rule_name/ (see existing tests)
5. Update this README!

## Contributors

[![@ViraRodionova](https://github.com/ViraRodionova.png?size=40)](https://github.com/ViraRodionova) [@ViraRodionova](https://github.com/ViraRodionova)
