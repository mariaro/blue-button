var expect = require('chai').expect;
var assert = require('chai').assert;
var lib = require('./test-lib.js');
var fs = require("fs");
var bb = require('../index.js');
var bbm = require('blue-button-meta');

var test = new lib.testXML();
test.verbose = true; // log setting

// testing options/cases
var TEST_CCDA_SAMPLES = false;
var TEST_CCD = false;
var TEST_SECTIONS = false;
var TEST_PARSE_GENERATE = true;

var supportedComponents = {
    payers: 'payers',
    allergies: 'allergies',
    procedures: 'procedures',
    immunizations: 'immunizations',
    medications: 'medications',
    encounters: 'encounters',
    vitals: 'vitals',
    results: 'results',
    social_history: 'social_history',
    demographics: 'demographics',
    plan_of_care: 'plan_of_care',
    problems: 'problems'
};

// test all ccda samples from ccda_samples (json generated by ccda-explorer)
if (TEST_CCDA_SAMPLES) {
    describe('ccda_samples', function () {
        describe('generating CCDA for all ccda_samples samples', function () {
            it('should produce some xml, at the very least', function () {
                var stats = JSON.parse(fs.readFileSync('ccda-explorer/dump/stats.json')),
                    i = 0,
                    sum = 0;
                for (var sample in stats) {
                    i = stats[sample]["index"];
                    if (true) { // add (i < n) to shorten
                        for (var j = 0; j < stats[sample]["files"].length; j++) {
                            fileNameXML = i + "-" + j + ".xml";
                            if (true) { // replace with j < n to shorten
                                if (true) { // replace with fileNameXML == "[filename]" to narrow down
                                    var XMLDOMs = test.generateXMLDOMForEntireCCD_v2('ccda-explorer/dump/' + i + "-" + j + ".xml", "ccda_explorer");
                                    sum++;
                                    assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
                                    test.logMsg("TOTAL ERRORS: " + test.errors["total"]);
                                }
                            }
                        }
                    }
                }
            });
        });
    });
}

// test whole CCD document (version: ccda-r1.1 (ccda))
if (TEST_CCD) {
    describe('ccda', function () {
        describe('generating CCDA for entire CCD', function () {
            it('should match entire CCD', function () {
                var XMLDOMs = test.generateXMLDOMForEntireCCD_v2('test/fixtures/files/CCD_1.xml', 'sample_ccda', '');

                assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
                test.logMsg("TOTAL ERRORS: " + test.errors["total"]);
            });
        });
    });
}

// test whole CCD document (version: ccda-r1)
if (TEST_CCD) {
    describe('ccda', function () {
        describe('generating CCDA for entire CCD', function () {
            it('should match entire CCD', function () {
                var XMLDOMs = test.generateXMLDOMForEntireCCD_v2('test/fixtures/files/CCD_1_r1.xml', 'sample_ccda', '_r1');

                assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
                test.logMsg("TOTAL ERRORS: " + test.errors["total"]);
            });
        });
    });
}

// test each section individually
if (TEST_SECTIONS) {
    describe('sections', function () {
        it('should match respective sections', function () {
            Object.keys(supportedComponents).forEach(function (section) {
                if (true) { // add section === "[section]" for specific section
                    var XMLDOMs = test.generateXMLDOM(section);

                    assert.ok(test.isIdentical(XMLDOMs[0].documentElement, XMLDOMs[1].documentElement));
                    test.logMsg("ERRORS: " + test.errors["sections"][test.curr_section]);
                }
            });
        });
    });
}

// test parse->generate->parse->generate
if (TEST_PARSE_GENERATE) {
    describe('parse generate parse generate', function () {
        it('should still be same', function () {
            var data = fs.readFileSync("test/fixtures/files/CCD_1.xml").toString();

            //convert string into JSON 
            var result = bb.parseString(data);
            // console.log(JSON.stringify(result, null, 4));

            for (var section in result.meta.sections) {
                // console.log(result.meta.sections[section], " ", result.data[result.meta.sections[section]].length);
            }

            // write generated json
            fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated.json", JSON.stringify(result, null, 4));

            // check validation
            var val = bb.validator.validateDocumentModel(result);
            // console.log("validation result: ", val);
            // console.log(JSON.stringify(bb.validator.getLastError(), null, 4));

            // generate ccda
            var xml = bb.generateCCDA(result).toString();
            // write ccda
            fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated.xml", xml);

            // parse generated ccda
            var result2 = bb.parseString(xml);
            // write the parsed json from the generated ccda
            fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated_2.json", JSON.stringify(result2, null, 4));

            // re-generate
            var xml2 = bb.generateCCDA(result2).toString();
            fs.writeFileSync("test/fixtures/files/parse_gen_parse/generated/CCD_1_generated_2.xml", xml2);

            assert.deepEqual(result2, result);
        });
    });
}

// show the error summary
describe('show errors', function () {
    it('should show error summary', function () {
        test.logMsg("\nERROR SUMMARY: " + JSON.stringify(test.errors, null, 4) + "\n" + JSON.stringify(test.error_settings, null, 4));
    });
});
