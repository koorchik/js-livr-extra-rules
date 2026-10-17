const fs = require('fs');
const LIVR = require('livr');
const util = require('util');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const extraRules = require('../src');

LIVR.Validator.registerDefaultRules(extraRules);

iterateTestData('test_suite/positive', function(data) {
    test(`LIVR positive tests: ${data.name}`, () => {
        const validator = new LIVR.Validator(data.rules);
        const output = validator.validate(data.input);

        const errors = validator.getErrors();

        assert.ok(
            !errors,
            'Validator should contain no errors. The error was ' + util.inspect(errors)
        );

        assert.deepEqual(output, data.output, 'Output should contain correct data');
    });
});

iterateTestData('test_suite/negative', function(data) {
    test(`LIVR negative tests: ${data.name}`, () => {
        const validator = new LIVR.Validator(data.rules);
        const output = validator.validate(data.input);

        assert.ok(!output, 'Output should be false');
        assert.deepEqual(validator.getErrors(), data.errors, 'Validator should contain errors');
    });
});

function iterateTestData(path, cb) {
    const rootPath = __dirname + '/' + path;
    console.log(`ITERATE: ${rootPath}`);
    const casesDirs = fs.readdirSync(rootPath);

    for (const caseDir of casesDirs) {
        const caseFiles = fs.readdirSync(rootPath + '/' + caseDir);
        const caseData = { name: caseDir };

        for (const file of caseFiles) {
            const fullName = rootPath + '/' + caseDir + '/' + file;
            let data = {};
            if ( fullName.match(/\.json$/) ) {
                const json = fs.readFileSync(fullName);
                data = JSON.parse(json);
            } else if ( fullName.match(/\.js$/) ) {
                data = require(fullName);
            }

            caseData[file.replace(/\.js(on)?$/, '')] = data;
        }

        cb(caseData);
    }
}
