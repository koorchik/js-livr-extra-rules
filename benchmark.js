#!/usr/bin/env node
/**
 * Performance benchmark for LIVR extra rules
 */

const rules = require('./src/index');

const ITERATIONS = 100000;

// Test data for each rule
const testCases = {
    iso_date: {
        valid: ['2023-01-15', '2024-12-31', '1990-06-20', '2000-02-29'],
        invalid: ['2023-13-01', '2023-02-30', 'not-a-date', '2023/01/15']
    },
    ipv4: {
        valid: ['192.168.1.1', '10.0.0.1', '255.255.255.255', '0.0.0.0'],
        invalid: ['256.1.1.1', '192.168.1', 'abc.def.ghi.jkl', '01.02.03.04']
    },
    uuid: {
        valid: [
            '550e8400-e29b-41d4-a716-446655440000',
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            '6ba7b810-9dad-41d4-80b4-00c04fd430c8'
        ],
        invalid: ['not-a-uuid', '550e8400-e29b-41d4-a716', 'zzzzzzzz-zzzz-4zzz-azzz-zzzzzzzzzzzz']
    },
    md5: {
        valid: ['d41d8cd98f00b204e9800998ecf8427e', '098f6bcd4621d373cade4e832627b4f6'],
        invalid: ['not-md5', 'd41d8cd98f00b204e9800998ecf8427', 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz']
    },
    mongo_id: {
        valid: ['507f1f77bcf86cd799439011', '5f50c31e8c3c6e001f3e6e8a'],
        invalid: ['not-mongo-id', '507f1f77bcf86cd79943901', 'zzzzzzzzzzzzzzzzzzzzzzzz']
    },
    base64: {
        valid: ['SGVsbG8gV29ybGQ=', 'dGVzdA==', 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo='],
        invalid: ['not base64!', 'SGVsbG8gV29ybGQ', '====']
    },
    credit_card: {
        valid: ['4532015112830366', '5425233430109903', '4916338506082832'],
        invalid: ['1234567890123456', '453201511283036', 'notacreditcard']
    },
    boolean: {
        valid: [true, false, 'true', 'false', 1, 0, '1', '0'],
        invalid: ['yes', 'no', 2, 'TRUE']
    },
    list_items_unique: {
        valid: [[1, 2, 3, 4, 5], ['a', 'b', 'c', 'd'], [1, 'a', 2, 'b']],
        invalid: [[1, 2, 2, 3], ['a', 'b', 'a'], [1, 1, 1]]
    },
    list_length: {
        valid: [[1, 2, 3], [1, 2, 3, 4, 5], ['a', 'b', 'c', 'd']],
        invalid: [[1], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], []]
    },
    is: {
        valid: ['expected_value', 'expected_value', 'expected_value'],
        invalid: ['wrong', 'another', 'nope']
    }
};

function benchmark(name, fn, data, iterations) {
    // Warmup
    for (let i = 0; i < 1000; i++) {
        for (const value of data) {
            fn(value, {}, []);
        }
    }

    const start = process.hrtime.bigint();
    for (let i = 0; i < iterations; i++) {
        for (const value of data) {
            fn(value, {}, []);
        }
    }
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    const opsPerSec = Math.round((iterations * data.length) / (durationMs / 1000));
    return { durationMs, opsPerSec };
}

function runBenchmarks() {
    console.log('LIVR Extra Rules Performance Benchmark');
    console.log('='.repeat(60));
    console.log(`Iterations per test: ${ITERATIONS.toLocaleString()}`);
    console.log('');

    const results = {};

    // iso_date
    const isoDateValidator = rules.iso_date();
    results.iso_date_valid = benchmark('iso_date (valid)', isoDateValidator, testCases.iso_date.valid, ITERATIONS);
    results.iso_date_invalid = benchmark('iso_date (invalid)', isoDateValidator, testCases.iso_date.invalid, ITERATIONS);

    // ipv4
    const ipv4Validator = rules.ipv4();
    results.ipv4_valid = benchmark('ipv4 (valid)', ipv4Validator, testCases.ipv4.valid, ITERATIONS);
    results.ipv4_invalid = benchmark('ipv4 (invalid)', ipv4Validator, testCases.ipv4.invalid, ITERATIONS);

    // uuid (v4)
    const uuidValidator = rules.uuid('v4');
    results.uuid_valid = benchmark('uuid (valid)', uuidValidator, testCases.uuid.valid, ITERATIONS);
    results.uuid_invalid = benchmark('uuid (invalid)', uuidValidator, testCases.uuid.invalid, ITERATIONS);

    // md5
    const md5Validator = rules.md5();
    results.md5_valid = benchmark('md5 (valid)', md5Validator, testCases.md5.valid, ITERATIONS);
    results.md5_invalid = benchmark('md5 (invalid)', md5Validator, testCases.md5.invalid, ITERATIONS);

    // mongo_id
    const mongoIdValidator = rules.mongo_id();
    results.mongo_id_valid = benchmark('mongo_id (valid)', mongoIdValidator, testCases.mongo_id.valid, ITERATIONS);
    results.mongo_id_invalid = benchmark('mongo_id (invalid)', mongoIdValidator, testCases.mongo_id.invalid, ITERATIONS);

    // base64
    const base64Validator = rules.base64();
    results.base64_valid = benchmark('base64 (valid)', base64Validator, testCases.base64.valid, ITERATIONS);
    results.base64_invalid = benchmark('base64 (invalid)', base64Validator, testCases.base64.invalid, ITERATIONS);

    // credit_card
    const creditCardValidator = rules.credit_card();
    results.credit_card_valid = benchmark('credit_card (valid)', creditCardValidator, testCases.credit_card.valid, ITERATIONS);
    results.credit_card_invalid = benchmark('credit_card (invalid)', creditCardValidator, testCases.credit_card.invalid, ITERATIONS);

    // boolean
    const booleanValidator = rules.boolean();
    results.boolean_valid = benchmark('boolean (valid)', booleanValidator, testCases.boolean.valid, ITERATIONS);
    results.boolean_invalid = benchmark('boolean (invalid)', booleanValidator, testCases.boolean.invalid, ITERATIONS);

    // list_items_unique
    const listItemsUniqueValidator = rules.list_items_unique();
    results.list_items_unique_valid = benchmark('list_items_unique (valid)', listItemsUniqueValidator, testCases.list_items_unique.valid, ITERATIONS);
    results.list_items_unique_invalid = benchmark('list_items_unique (invalid)', listItemsUniqueValidator, testCases.list_items_unique.invalid, ITERATIONS);

    // list_length (min: 2, max: 6)
    const listLengthValidator = rules.list_length(2, 6);
    results.list_length_valid = benchmark('list_length (valid)', listLengthValidator, testCases.list_length.valid, ITERATIONS);
    results.list_length_invalid = benchmark('list_length (invalid)', listLengthValidator, testCases.list_length.invalid, ITERATIONS);

    // is
    const isValidator = rules.is('expected_value');
    results.is_valid = benchmark('is (valid)', isValidator, testCases.is.valid, ITERATIONS);
    results.is_invalid = benchmark('is (invalid)', isValidator, testCases.is.invalid, ITERATIONS);

    // Print results
    console.log('Results:');
    console.log('-'.repeat(60));
    console.log(String('Rule').padEnd(30) + String('Time (ms)').padStart(12) + String('ops/sec').padStart(15));
    console.log('-'.repeat(60));

    for (const [name, result] of Object.entries(results)) {
        console.log(
            name.padEnd(30) +
            result.durationMs.toFixed(2).padStart(12) +
            result.opsPerSec.toLocaleString().padStart(15)
        );
    }

    console.log('-'.repeat(60));

    // Calculate totals
    const totalTime = Object.values(results).reduce((sum, r) => sum + r.durationMs, 0);
    console.log(`Total time: ${totalTime.toFixed(2)} ms`);

    return results;
}

runBenchmarks();
