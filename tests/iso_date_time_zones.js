const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { execFileSync } = require('child_process');
const extraRules = require('../src');

// Cases the JSON test suite cannot express

const DATES = ['1850-06-15', '1900-12-05', '2011-12-30', '2018-11-04', '2024-02-29'];

// Days when the clocks change, so the local day has 23 or 25 hours:
// [max, the last valid value, the first invalid value]
const MAX_DATES = [
    ['2023-03-12', '2023-03-12T23:59:59.999Z', '2023-03-13T00:00:00Z'], // America/New_York
    ['2023-11-05', '2023-11-05T23:59:59.999Z', '2023-11-06T00:00:00Z'], // America/New_York
    ['2023-03-26', '2023-03-26T23:59:59.999Z', '2023-03-27T00:00:00Z'], // Europe/Kyiv
    ['2023-10-29', '2023-10-29T23:59:59.999Z', '2023-10-30T00:00:00Z'], // Europe/Kyiv
];

// Each time zone runs in a new process, so the test does not change the time zone of the runner.
// "code" is an expression with "extraRules", its value is returned as JSON
function runInTimeZone(tz, code) {
    const script = `
        const extraRules = require(${JSON.stringify(path.join(__dirname, '../src'))});
        console.log(JSON.stringify(${code}));
    `;

    const stdout = execFileSync(process.execPath, ['-e', script], {
        env: { ...process.env, TZ: tz },
        encoding: 'utf8',
    });

    return JSON.parse(stdout);
}

test('iso_date does not depend on the time zone of the server', () => {
    const expected = DATES.map(value => [null, [value]]);
    const code = `${JSON.stringify(DATES)}.map(value => {
        const output = [];
        return [extraRules.iso_date({})(value, {}, output), output];
    })`;

    for (const tz of ['UTC', 'Pacific/Apia', 'America/Los_Angeles', 'America/Sao_Paulo']) {
        assert.deepEqual(runInTimeZone(tz, code), expected, tz);
    }
});

test('iso_date max without time ends at the end of the UTC day in any time zone', () => {
    const expected = MAX_DATES.map(() => [null, 'DATE_TOO_HIGH']);
    const code = `${JSON.stringify(MAX_DATES)}.map(([max, lastValid, firstInvalid]) => {
        const isoDate = extraRules.iso_date({ max }, {});
        return [isoDate(lastValid, {}, []), isoDate(firstInvalid, {}, [])];
    })`;

    for (const tz of ['UTC', 'America/New_York', 'Europe/Kyiv', 'Pacific/Apia']) {
        assert.deepEqual(runInTimeZone(tz, code), expected, tz);
    }
});

test('iso_date with min and max does not create global variables', () => {
    extraRules.iso_date({ min: '2000-01-01', max: 'tomorrow' }, {});
    assert.equal('date' in globalThis, false);
});
