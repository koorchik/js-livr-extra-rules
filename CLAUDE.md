# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

livr-extra-rules is an extension library for [LIVR (Language Independent Validation Rules)](http://livr-spec.org/) that provides additional validation rules beyond the core specification. It has **zero dependencies** and works with the JavaScript LIVR implementation.

## Commands

- **Run all tests**: `npm test`
- **Run tests with coverage**: `npm run coverage`
- **Run a single test**: `npx ava tests/test_suite.js --match "LIVR positive tests: rule_name"` or `--match "LIVR negative tests: rule_name"`

## Architecture

### Rule Structure

Each validation rule is a factory function in `src/rules/` that returns a validator function. The validator function:
- Receives the value to validate
- Returns `undefined` if valid
- Returns an error code string (e.g., `'NOT_IP'`, `'FORMAT_ERROR'`) if invalid

Example pattern from `src/rules/ipv4.js`:
```js
function ipv4() {
    return value => {
        if (util.isNoValue(value)) return;
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';
        // validation logic...
        return; // valid
    };
}
```

### Utility Functions (`src/util.js`)

- `isPrimitiveValue(value)` - checks if value is string, finite number, or boolean
- `isNoValue(value)` - checks if value is undefined, null, or empty string
- `JSONPointer(object, pointer)` - traverses object using JSON pointer notation (e.g., `'address/city'`)

### Test Structure

Tests use AVA and are organized in `tests/test_suite/`:
- `positive/` - tests where validation should pass
- `negative/` - tests where validation should fail with specific errors

Each rule has its own directory containing:
- `rules.json` - LIVR validation schema
- `input.json` (or `.js`) - test input data
- `output.json` (or `.js`) - expected output (positive tests)
- `errors.json` - expected error codes (negative tests)

### Adding a New Rule

1. Create rule file in `src/rules/your_rule.js`
2. Export from `src/index.js`
3. Add positive tests in `tests/test_suite/positive/your_rule/`
4. Add negative tests in `tests/test_suite/negative/your_rule/`
