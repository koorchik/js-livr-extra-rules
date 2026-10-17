# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
