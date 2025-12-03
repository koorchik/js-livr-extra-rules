# Changelog

All notable changes to this project will be documented in this file.

## [1.6.0] - 2024-12-03

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
