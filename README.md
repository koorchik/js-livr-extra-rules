# livr-extra-rules

> Extra validation rules for LIVR with zero dependencies

[![npm version](https://badge.fury.io/js/livr-extra-rules.svg)](https://badge.fury.io/js/livr-extra-rules)
[![npm downloads](https://img.shields.io/npm/dm/livr-extra-rules.svg)](https://www.npmjs.com/package/livr-extra-rules)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Known Vulnerabilities](https://snyk.io/test/github/koorchik/js-livr-extra-rules/badge.svg?targetFile=package.json)](https://snyk.io/test/github/koorchik/js-livr-extra-rules?targetFile=package.json)

## Table of Contents

- [Highlights](#highlights)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Rules Overview](#rules-overview)
- [Rule Documentation](#rule-documentation)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [Contributors](#contributors)
- [License](#license)

## Highlights

- **Zero Dependencies** — Lighter builds, easier to maintain high level of security
- **TypeScript Support** — Full type definitions included
- **14 Extra Rules** — Credit cards, UUIDs, dates, IP addresses, and more

## Installation

```sh
npm install livr livr-extra-rules
```

## Quick Start

```js
import LIVR from 'livr';
import extraRules from 'livr-extra-rules';

LIVR.Validator.registerDefaultRules(extraRules);
```

Works with AsyncValidator too:

```js
import LIVR from 'livr/async';
import extraRules from 'livr-extra-rules';

LIVR.AsyncValidator.registerDefaultRules(extraRules);
```

## Rules Overview

| Rule | Description | Error Code(s) |
|------|-------------|---------------|
| [`ipv4`](#ipv4) | Validates IPv4 addresses | `NOT_IP` |
| [`boolean`](#boolean) | Checks for true/false values | `NOT_BOOLEAN` |
| [`credit_card`](#credit_card) | Validates credit card numbers (Luhn) | `WRONG_CREDIT_CARD_NUMBER` |
| [`uuid`](#uuid) | Validates UUID (v1-v5) | `NOT_UUID` |
| [`mongo_id`](#mongo_id) | Validates MongoDB ObjectId | `NOT_ID` |
| [`list_length`](#list_length) | Validates array length | `FORMAT_ERROR`, `TOO_FEW_ITEMS`, `TOO_MANY_ITEMS` |
| [`list_items_unique`](#list_items_unique) | Checks array uniqueness | `FORMAT_ERROR`, `NOT_UNIQUE_ITEMS`, `INCOMPARABLE_ITEMS` |
| [`base64`](#base64) | Validates base64 strings | `MALFORMED_BASE64` |
| [`md5`](#md5) | Validates MD5 hash strings | `NOT_MD5` |
| [`iso_date`](#iso_date) | Extended ISO date validation | `WRONG_DATE`, `DATE_TOO_LOW`, `DATE_TOO_HIGH` |
| [`required_if`](#required_if) | Conditional required field | `REQUIRED` |
| [`is`](#is) | Exact value match | `REQUIRED`, `NOT_ALLOWED_VALUE` |
| [`instance_of`](#instance_of) | Class instance check | `WRONG_INSTANCE` |
| [`has_methods`](#has_methods) | Object method check | `NOT_HAVING_METHOD [method]` |

## Rule Documentation

<details>
<summary><strong><code>ipv4</code></strong> — Validates IPv4 addresses</summary>

```js
{
    field: 'ipv4'
}
```

**Error code:** `NOT_IP`

</details>

<details>
<summary><strong><code>boolean</code></strong> — Checks for true/false values</summary>

Checks that the value is true or false.

- **True values:** `true`, `1`, `'1'`
- **False values:** `false`, `0`, `'0'`

String values (except empty string) will return error `NOT_BOOLEAN`.

Return value will be converted to JavaScript boolean values — `true` or `false`.

```js
{
    field: 'boolean'
}
```

**Error code:** `NOT_BOOLEAN`

</details>

<details>
<summary><strong><code>is</code></strong> — Exact value match</summary>

Checks the presence of the value and its correspondence to the specified value.

```js
{
    field: { 'is': 'some value' }
}
```

**Error codes:** `REQUIRED`, `NOT_ALLOWED_VALUE`

</details>

<details>
<summary><strong><code>credit_card</code></strong> — Validates credit card numbers</summary>

Checks that the value is a credit card number with [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm).

```js
{
    field: 'credit_card'
}
```

**Error code:** `WRONG_CREDIT_CARD_NUMBER`

</details>

<details>
<summary><strong><code>uuid</code></strong> — Validates UUID (v1-v5)</summary>

```js
{
    field1: 'uuid',           // default v4
    field2: { uuid: 'v1' },
    field3: { uuid: 'v2' },
    field4: { uuid: 'v3' },
    field5: { uuid: 'v4' },
    field6: { uuid: 'v5' }
}
```

**Error code:** `NOT_UUID`

</details>

<details>
<summary><strong><code>mongo_id</code></strong> — Validates MongoDB ObjectId</summary>

Checks that the value looks like a MongoDB ObjectId.

```js
{
    field: 'mongo_id'
}
```

**Error code:** `NOT_ID`

</details>

<details>
<summary><strong><code>list_length</code></strong> — Validates array length</summary>

Checks that the value is a list and contains the required number of elements. You can pass an exact number or a range.

> **Note:** Don't forget about the `required` rule if you want the field to be required.

```js
{
    // List is required and should contain exactly 10 items
    list1: ['required', { list_length: 10 }],

    // List is not required but if present, should contain exactly 10 items
    list2: { list_length: 10 },

    // List is not required but if present, should have from 3 to 10 items
    list3: { list_length: [3, 10] }
}
```

**Error codes:** `FORMAT_ERROR`, `TOO_FEW_ITEMS`, `TOO_MANY\_\ITEMS`

</details>

<details>
<summary><strong><code>list_items_unique</code></strong> — Checks array uniqueness</summary>

Checks that items in a list are unique. The rule checks string representations of values and supports only primitive values.

- If the value is not an array → `FORMAT_ERROR`
- If the value is not primitive (array, object) → `INCOMPARABLE_ITEMS`

```js
{
    list: 'list_items_unique'
}
```

**Error codes:** `FORMAT_ERROR`, `NOT_UNIQUE_ITEMS`, `INCOMPARABLE_ITEMS`

</details>

<details>
<summary><strong><code>base64</code></strong> — Validates base64 strings</summary>

```js
{
    field1: 'base64',              // padding is required (default)
    field2: { base64: 'relaxed' }  // padding is optional
}
```

**Error code:** `MALFORMED_BASE64`

</details>

<details>
<summary><strong><code>md5</code></strong> — Validates MD5 hash strings</summary>

```js
{
    field: 'md5'
}
```

**Error code:** `NOT_MD5`

</details>

<details>
<summary><strong><code>iso_date</code></strong> — Extended ISO date validation</summary>

Compatible with the standard `iso_date` rule (and will redefine it) but allows extra params — `min` and `max` dates.

Special date values: `current`, `yesterday`, `tomorrow` — useful for checking if a date is in the future or past.

```js
{
    date1: 'iso_date',
    date2: { iso_date: { min: '2017-10-15' } },
    date3: { iso_date: { max: '2017-10-30' } },
    date4: { iso_date: { min: '2017-10-15T15:30Z', max: '2017-10-30', format: 'datetime' } },
    date5: { iso_date: { min: 'current', max: 'tomorrow' } },
    date6: { iso_date: { format: 'datetime' } }
}
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `min` | ISO 8601 date/datetime, `current`, `tomorrow`, `yesterday` | — |
| `max` | ISO 8601 date/datetime, `current`, `tomorrow`, `yesterday` | — |
| `format` | `date` or `datetime` | `date` |

**Date boundary behavior:**

If you pass only a date (without time) to `min` or `max` and the expected format is `datetime`:
- `min` starts from the beginning of the min date
- `max` ends at the end of the max date

If you pass the time along with the date, you need to specify the time zone.

**Error codes:** `WRONG_DATE`, `DATE_TOO_LOW`, `DATE_TOO_HIGH`

</details>

<details>
<summary><strong><code>required_if</code></strong> — Conditional required field</summary>

Checks that the value is present if another field is present and has a specific value.

**Simple example:**

```js
{
    sendMeEmails: { one_of: [0, 1] },
    email: { required_if: { sendMeEmails: '1' } }
}
```

**With JSON pointer:**

```js
{
    address: {
        nested_object: {
            city: 'required',
            street: 'required'
        }
    },
    email: { required_if: { 'address/city': 'Kyiv' } }
}
```

> **Note:** You cannot access parent fields with JSON pointers here, only siblings and nested values.

**Error code:** `REQUIRED`

</details>

<details>
<summary><strong><code>instance_of</code></strong> — Class instance check</summary>

Checks that the value is an instanceof a class.

> **Note:** This rule is JS-specific and not serializable but can be useful for runtime validations.

```js
class Dog {}

{
    dog1: { instance_of: Dog }
}
```

**Error code:** `WRONG_INSTANCE`

</details>

<details>
<summary><strong><code>has_methods</code></strong> — Object method check</summary>

Checks that the value is an object which has all required methods.

> **Note:** This rule is JS-specific and not serializable but can be useful for runtime validations.

```js
{
    dog1: { has_methods: 'bark' },
    dog2: { has_methods: ['bark', 'getName'] }
}
```

**Error code:** `NOT_HAVING_METHOD [${method}]` (e.g., `NOT_HAVING_METHOD [bark]`)

</details>

## Contributing

To add a new rule:

1. Create a new file in `src/rules/` (see existing rules for reference)
2. Export the rule in `src/index.js`
3. Add positive tests in `tests/test_suite/positive/your_rule_name/`
4. Add negative tests in `tests/test_suite/negative/your_rule_name/`
5. Update this README

## Documentation

- [LIVR for JavaScript](https://www.npmjs.com/package/livr)
- [Official LIVR documentation](http://livr-spec.org/)

## Contributors

[![@vira-khdr](https://github.com/vira-khdr.png?size=40)](https://github.com/vira-khdr) [@vira-khdr](https://github.com/vira-khdr)

## License

MIT
