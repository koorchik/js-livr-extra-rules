# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

livr-extra-rules is an extension library for [LIVR (Language Independent Validation Rules)](http://livr-spec.org/) that provides additional validation rules beyond the core specification. It has **zero runtime dependencies** (`livr` is only a peer dependency), so do not add any. Users register the rules with `LIVR.Validator.registerDefaultRules(extraRules)` (or `AsyncValidator`). The `iso_date` rule here replaces the core `iso_date` rule.

## Commands

- **Run all tests**: `npm test`. This runs `node --test "tests/*.js"` (`node:test` with `node:assert/strict`, no test framework dependency) and then `tsc --noEmit`, which type-checks `types/index.d.ts` against `test-types.ts`.
- **Run a single test**: `node --test --test-name-pattern="^LIVR positive tests: rule_name$" tests/test_suite.js` (or `negative`). The pattern is a regular expression, so keep the anchors: without them `is` also matches `iso_date`.
- **Coverage**: `npm run coverage` uses Node's built-in coverage for `src/`. It requires at least 85% of lines, branches and functions for all files together, not for each file.
- **Benchmark**: `node benchmark.js`
- **Formatting**: `.prettierrc.json` sets 4 spaces, a print width of 100 and single quotes. There is no lint or format script.

`tsconfig.json` maps `livr/types` to the sibling checkout `../js-validator-livr/types` when it exists. It falls back to `node_modules/livr` when it does not. This lets type tests run against unreleased livr typings.

## Architecture

### Rule contract

Each file in `src/rules/` exports a factory that LIVR calls once per schema field. It returns a validator:

```js
function rule_name(arg1, ...) {          // LIVR always passes `ruleBuilders` as the LAST argument
    if (arguments.length > 1) { ... }    // so this check means "rule arguments were given"
    return (value, params, outputArr) => {
        if (util.isNoValue(value)) return;              // empty values pass; `required` handles presence
        if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';
        // return an error code string when the value is invalid
        // outputArr.push(x) replaces the field's output value (e.g. boolean, iso_date)
        return;                                         // undefined = valid
    };
}
```

- `params` is the whole input object. `required_if` uses it with `util.JSONPointer` to read sibling or nested fields.
- Invalid schema arguments throw in the factory with a `'LIVR: ...'` message. They are not returned as error codes.
- `is` and `required_if` are the exceptions to "empty values pass".
- Rules are registered under snake_case names in `src/index.js`. LIVR adds the camelCase aliases (`creditCard`, `mongoId`, …) at runtime.

### TypeScript types

`types/index.d.ts` augments `livr/types/inference` (`RuleTypeRegistry`, `ParameterizedRuleRegistry`, `TemplateOutputRegistry`) so that `InferFromSchema` understands these rules. The camelCase aliases must be listed there by hand. `test-types.ts` holds compile-time assertions (`Expect<Equal<...>>`) for each rule.

### Tests

`tests/test_suite.js` creates **one test per rule directory** in `tests/test_suite/{positive,negative}/<rule>/`. Each directory has:
- `rules`: the LIVR schema
- `input`: the data to validate
- `output` (positive tests only): the expected output
- `errors` (negative tests only): the expected error codes

Each of these can be a `.json` or a `.js` file. Use `.js` when the data needs real classes or functions, as in `instance_of/samples/`. To add a case, add another field to the existing files instead of creating a new directory.

`npm test` runs every `tests/*.js` file, each in its own process. Put cases the JSON suite cannot express in their own file. For example, `tests/iso_date_time_zones.js` starts a child process for each `TZ` value, so the time zone of the test runner never changes.

### Adding a New Rule

1. Create `src/rules/your_rule.js` and export it from `src/index.js`
2. Add positive and negative tests in `tests/test_suite/{positive,negative}/your_rule/`
3. Add types to `types/index.d.ts` (snake_case name and camelCase alias) and assertions to `test-types.ts`
4. Document the rule in `README.md` (table of contents, overview table and a section) and in `CHANGELOG.md`
