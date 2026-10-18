# Changelog

All notable changes to this project will be documented in this file.

## [1.6.1] - 2026-10-18

### Changed

- **Performance improvements** (no API changes; compared with 1.6.0 on Node.js 26). A schema of 10 fields with these rules validates 3.3x faster with LIVR 2.11, a schema of dates 9x faster
  - `iso_date`: 31x faster for dates, 11x for values with time, 18x with `min` or `max`, 5x for invalid values. Dates are checked and converted arithmetically instead of with `Date` objects, `Date.parse()` and `toISOString()`, a date without time is returned as is, and the regular expression has no capture groups
  - `credit_card`: 3.5x faster, digits are checked in the Luhn loop
  - `ipv4`: 2.3-2.9x faster, one regular expression without capture groups
  - `required_if`: 2.5-3.4x faster, the path to the field is split once per schema
  - `list_items_unique`: 1.7-3x faster for lists of up to 20 items, which are compared pairwise instead of with a `Set`
  - `base64`: 1.8-2.2x faster for valid values, 7x for invalid ones. Characters are checked in a loop instead of with a regular expression
  - `md5`, `mongo_id` and `uuid`: 1.2-1.6x faster for valid values, 2.6-11x for invalid ones. The length is checked first, hex digits in a loop
- The npm package contains only `src/`, `types/`, the README, the license and this changelog. Tests and development files are no longer published

### Fixed

- `list_items_unique` compares string representations of items again, as documented: `[1, "1"]` and `[true, "true"]` are `NOT_UNIQUE_ITEMS`. Version 1.6.0 compared values with `Set`, so such lists passed
- `iso_date` rejected valid dates (for example `1900-12-05`) when the server time zone had a historical offset with seconds or a skipped day (`Pacific/Apia`, `America/Los_Angeles`, `America/Sao_Paulo`). The result no longer depends on the time zone
- `iso_date` with `max` without time depended on the server time zone on days when the clocks change: the end of the day was found by adding a local day of 23 or 25 hours. With `TZ=America/New_York`, `max: "2023-03-12"` rejected `2023-03-12T23:30:00Z`, and `max: "2023-11-05"` accepted `2023-11-06T00:30:00Z`. Now `max` ends at the end of the UTC day
- `iso_date` ignored `min` or `max` equal to `1970-01-01T00:00:00Z` (epoch 0), for example `min: "1970-01-01"`
- `iso_date` read a fraction of a second with 10 or more digits and leading zeros wrong: `.0704757090` was 704 ms instead of 70 ms, as `Date.parse()` in V8 reads it
- `iso_date` with `min` or `max` created a global `date` variable
- Types: projects with `skipLibCheck: false` failed to compile with `TS2666: Exports and export assignments are not permitted in module augmentations` in `types/index.d.ts`

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
