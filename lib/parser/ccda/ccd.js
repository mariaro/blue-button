"use strict";

var component = require("./component");
var shared = require("./shared");
var cleanup = require("./cleanup");

var exportCCD = function (version) {
    var patient = require("./demographics").patient;
    var encounter = require('./encounter').encounter;
    var resultsSection = require("./sections/results").resultsSection(version)[0];
    var vitalSignsSection = require("./sections/vitals").vitalSignsSection(version)[0];
    var problemsSection = require("./sections/problems").problemsSection(version)[0];
    var immunizationsSection = require("./sections/immunizations").immunizationsSection(version)[0];
    var socialHistorySection = require("./sections/social_history").socialHistorySection(version)[0];
    var medicationsSection = require("./sections/medications").medicationsSection(version)[0];
    var allergiesSection = require("./sections/allergies").allergiesSection(version)[0];
    var encountersSection = require("./sections/encounters").encountersSection(version)[0];
    var proceduresSection = require("./sections/procedures").proceduresSection(version)[0];
    var plan_of_care_section = require("./sections/plan_of_care").plan_of_care_section(version)[0];
    var payers_section = require("./sections/payers").payers_section(version)[0];

    return component.define("CCD")
        .fields([
            ["doc_identifiers", "0..*", "h:id", shared.Identifier],
            ["demographics", "1..1", "(/ | //h:recordTarget/h:patientRole)[last()]", patient],
            ["masterEncounter", "1..1", "(/ | //h:documentationOf/h:serviceEvent)[last()]", encounter],
            ["vitals", "0..1", vitalSignsSection.xpath(), vitalSignsSection],
            ["results", "0..1", resultsSection.xpath(), resultsSection],
            ["medications", "0..*", medicationsSection.xpath(), medicationsSection],
            ["encounters", "0..1", encountersSection.xpath(), encountersSection],
            ["allergies", "0..1", allergiesSection.xpath(), allergiesSection],
            ["immunizations", "0..1", immunizationsSection.xpath(), immunizationsSection],
            ["social_history", "0..1", socialHistorySection.xpath(), socialHistorySection],
            ["problems", "0..*", problemsSection.xpath(), problemsSection],
            ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
            ["plan_of_care", "0..1", plan_of_care_section.xpath(), plan_of_care_section],
            ["payers", "0..1", payers_section.xpath(), payers_section],
        ])
        .cleanupStep(cleanup.flattenCollection("medications"))
        .cleanupStep(cleanup.flattenCollection("problems"));
}

exports.CCD = exportCCD;
