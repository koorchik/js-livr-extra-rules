const fs = require('fs');
const LIVR = require('livr');
const util = require('util');
const test = require('ava');

const extraRules = require('../src');

LIVR.Validator.registerDefaultRules(extraRules);

iterateTestData('test_suite/positive', function(data) {
    test(`LIVR positive tests: ${data.name}`, t => {
        const validator = new LIVR.Validator(data.rules);
        const output = validator.validate(data.input);

        const errors = validator.getErrors();

        t.true(
            !errors,
            'Validator should contain no errors. The error was ' + util.inspect(errors)
        );

        t.deepEqual(output, data.output, 'Output should contain correct data');
    });
});

iterateTestData('test_suite/negative', function(data) {
    test(`LIVR negative tests: ${data.name}`, t => {
        const validator = new LIVR.Validator(data.rules);
        const output = validator.validate(data.input);

        t.true(!output, 'Output should be false');
        t.deepEqual(validator.getErrors(), data.errors, 'Validator should contain errors');
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
            const json = fs.readFileSync(rootPath + '/' + caseDir + '/' + file);

            caseData[file.replace(/\.json$/, '')] = JSON.parse(json);
        }

        cb(caseData);
    }
}
