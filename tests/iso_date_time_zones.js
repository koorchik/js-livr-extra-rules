const { default: test } = require('ava');
const path = require('path');
const { execFileSync } = require('child_process');
const extraRules = require('../src');

// Cases the JSON test suite cannot express

const DATES = ['1850-06-15', '1900-12-05', '2011-12-30', '2018-11-04', '2024-02-29'];

// The time zone is set for a new process: changing process.env.TZ does not work in AVA workers
function validateInTimeZone(tz) {
    const script = `
        const isoDate = require(${JSON.stringify(path.join(__dirname, '../src'))}).iso_date({});
        const results = ${JSON.stringify(DATES)}.map(value => {
            const output = [];
            return [isoDate(value, {}, output), output];
        });
        console.log(JSON.stringify(results));
    `;

    const stdout = execFileSync(process.execPath, ['-e', script], {
        env: { ...process.env, TZ: tz },
        encoding: 'utf8',
    });

    return JSON.parse(stdout);
}

test('iso_date does not depend on the time zone of the server', t => {
    const expected = DATES.map(value => [null, [value]]);

    for (const tz of ['UTC', 'Pacific/Apia', 'America/Los_Angeles', 'America/Sao_Paulo']) {
        t.deepEqual(validateInTimeZone(tz), expected, tz);
    }
});

test('iso_date with min and max does not create global variables', t => {
    extraRules.iso_date({ min: '2000-01-01', max: 'tomorrow' }, {});
    t.false('date' in globalThis);
});
