# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- **Performance improvements** (no API changes; compared with 1.6.1 on Node.js 26)
  - `iso_date`: 10x faster with `min` or `max`, 5x faster for values with time, 1.4x faster for dates. The date is computed arithmetically instead of with `Date.parse()` and `toISOString()`, and the regular expression has no capture groups
  - `list_items_unique`: 2-3x faster for lists of up to 20 items, which are compared pairwise instead of with a `Set`
  - `required_if`: 2.5-3.4x faster, the path to the field is split once per schema
  - `base64`: 1.7-2x faster for valid values, 7x for invalid ones. Characters are checked in a loop instead of with a regular expression
  - `md5`, `mongo_id` and `uuid`: 1.2-1.6x faster for valid values, 2.5-10x for invalid ones. The length is checked first, hex digits in a loop
- `benchmark.js` passes `ruleBuilders` to the rules as LIVR does (`list_length(2, 6)` was `list_length(2)`) and covers `iso_date` with time, `min` and `max`, and `required_if`

### Fixed

- `iso_date` read a fraction of a second with 10 or more digits and leading zeros wrong: `.0704757090` was 704 ms instead of 70 ms, as `Date.parse()` in V8 reads it

## [1.6.1] - 2026-10-17

### Changed

- **Performance improvements** (no API changes)
  - `iso_date`: 13x faster for valid dates, 3.4x for invalid ones. The day of the month is checked arithmetically instead of creating `Date` objects, and a date without time is returned as is
  - `credit_card`: 2.7-3x faster, digits are checked in the Luhn loop
  - `ipv4`: 2x faster, one regular expression without capture groups

### Fixed

- `list_items_unique` compares string representations of items again, as documented: `[1, "1"]` and `[true, "true"]` are `NOT_UNIQUE_ITEMS`. Version 1.6.0 compared values with `Set`, so such lists passed
- `iso_date` rejected valid dates (for example `1900-12-05`) when the server time zone had a historical offset with seconds or a skipped day (`Pacific/Apia`, `America/Los_Angeles`, `America/Sao_Paulo`). The result no longer depends on the time zone
- `iso_date` with `min` or `max` created a global `date` variable

## [1.6.0] - 2025-12-03

### Changed

- **Performance improvements (~18% faster overall)**
  - Replace `String.match()` with `RegExp.test()` for pattern validation in md5, mongo_id, uuid, base64, and credit_card rules
  - Replace `Array.indexOf()` with direct comparison in boolean rule
  - Use `Set` instead of object for list_items_unique uniqueness check
  - Replace regex check with string indexing for ipv4 leading zero validation
  - Use `slice()` instead of `split()` for iso_date output formatting

### Fixed

- ipv4 rule now correctly checks all 4 octets for leading zeros (previously only checked first 3)

## [1.5.2] - Previous releases

- See git history for previous changes
