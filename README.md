[![Build Status](https://travis-ci.org/koorchik/js-livr-extra-rules.svg?branch=master)](https://travis-ci.org/koorchik/js-livr-extra-rules)

[![npm version](https://badge.fury.io/js/livr-extra-rules.svg)](https://badge.fury.io/js/livr-extra-rules)

# js-livr-extra-rules

LIVR specification contains the most common rules that every implementation should support. 

The module contains extra rules for LIVR. It is absolutely ok for LIVR to have your own custom rules in your project. But there are some rules that are useful cross projects. 


```javascript
import LIVR from livr;
import extraRules from 'livr-extra-rules';
LIVR.Validator.registerDefaultRules(extraRules);
```

## Rules 
 
 * ipv4 

### ipv4

Example:

```javascript
{
    field: 'ipv4'
}
```

**Error code**: 'NOT_IP'

## Rules to do

### uuid

Example:

```javascript
{
    field1: 'uuid', // default v4
    field2: {uuid: 'v4'},
    field2: {uuid: 'v1'}, 
}
```

**Error code**: 'NOT_UUID'

### mongo_id

Checks that the value looks like mongo object id

Example:

```javascript
{
    field: 'mongo_id',  
}
```

**Error code**: 'NOT_ID'

### base64

Checks that the value is a base64 string

Example:

```javascript
{
    field1: 'base64' // by default, passing is required
    field2: { base64: 'relaxed' } // padding is optional
}
```

**Error code**: 'MALFORMED_BASE64'

### base64

Checks that the value is a credit card number with [Lunh Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)

Example:

```javascript
{
    field: 'credit_card'
}
```

**Error code**: 'WRONG\_CREDIT\_CARD\_NUMBER'

### required_if

Checks that the value is present if another field is present and has value.

Simple example:

```javascript
{
    sendMeEmails: { one_if: [0, 1] },
    email: { 'required_if': { sendMeEmails: '1' } }
}
```

Example with JSON pointer:

```javascript
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

### boolean

Checks that the value is true or false

* True values: `true`, `1`
* False values: `false`, `0`, empty string

String values (except empty string) will force error "NOT_BOOLEAN".

Return value will converted to JavaScript boolean values - `true` or `false` 

Example:

```javascript
{
    field: 'boolean'
}
```

**Error code**: 'NOT_BOOLEAN'

## How to add own rule?

if you want to add own rule, you will need:

1. Create a new file for the rule in src/rules (see existing rules)
2. Add rule to src/index.js
3. Add positive tests to tests/test_suite/positive/your\_rule\_name/ (see existing tests)
4. Add negative tests to tests/test_suite/negative/your\_rule\_name/ (see existing tests)
5. Update this README!


### Rules to spec out

The list of rules that are going to be added here

 * min\_iso\_date 
 * max\_iso\_date
 * iso\_date\_between
 * iso_time
 * iso\_future\_date
 * list\_length // { list\_length: 2}, {list\_length: [3, 5]} // list\_length\_between, list\_length\_min? 
