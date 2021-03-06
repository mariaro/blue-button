"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");
var Processor = require('../processor');

var exportProblemsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    //These three elements aren't used right now, but can be refactored to use in standardized way.
    var AgeObservation = component.define("AgeObservation")
        .templateRoot("2.16.840.1.113883.10.20.22.4.31");

    var ProblemStatus = component.define("ProblemStatus")
        .templateRoot(["2.16.840.1.113883.10.20.22.4.6", clinicalStatementsIDs.ProblemStatusObservation])
        .fields([
            ["value", "0..1", "h:value", shared.ConceptDescriptor],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ])
        .cleanupStep(cleanup.extractAllFields(['value']));

    var HealthStatus = component.define("HealthStatus")
        .templateRoot("2.16.840.1.113883.10.20.22.4.5");

    var ProblemObservationValue = component.define("ProblemObservation2")
        .fields([
            //["name", "0..1", "@displayName"],
            //["code", "1..1", "@code"],
            //["system", "1..1", "@codeSystem"],
            //["code_system_name", "0..1", "@codeSystemName"],
            //["nullFlavor", "0..1", "@nullFlavor"],
            ["code", "0..1", "../h:value", shared.ConceptDescriptor],
            ["date_time", "0..1", "../h:effectiveTime", shared.EffectiveTime],
        ]);
    //.cleanupStep(cleanup.augmentConcept).cleanupStep(cleanup.removeField('system'));

    //TODO:  Cleanup/investigate negation status.
    var ProblemObservation = component.define("ProblemObservation")
        .templateRoot([clinicalStatementsIDs.ProblemObservation])
        .fields([
            ["negation_indicator", "0..1", "./@negationInd", Processor.asBoolean],
            ["date_time", "0..1", "../../h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:id", shared.Identifier],
            // ["negation_indicator", "0..1", "./", shared.NegationIndicator],
            ["problem", "1:1", "h:value", ProblemObservationValue],
            ["onset_age", "0..1", "h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value/@value", Processor.asFloat],
            ["onset_age_unit", "0..1", "h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value", shared.AgeDescriptor],
            ["status", "0..1", ProblemStatus.xpath(), ProblemStatus],
            ["patient_status", "0..1", "h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.5']/../h:value/@displayName"],
            ["text", "0..1", "h:text", shared.TextWithReference],
            ["source_list_identifiers", "0..*", "h:id", shared.Identifier],
            ["source_section_code", "0..1", "ancestor::h:section/h:code", shared.ConceptDescriptor],
        ]).withNegationStatus(true);
    //ProblemObservation.cleanupStep(cleanup.extractAllFields(['value']));

    //delete source_section_code if this is the only information
    ProblemObservation.cleanupStep(function(){
        if(Object.keys(this.js).length === 1 && this.js.source_section_code)
            delete this.js.source_section_code;
    });


    var problemsSection = component.define("problemsSection");
    problemsSection.templateRoot([
        "2.16.840.1.113883.10.20.22.2.5.1", //Problem Section with Coded Entries Required
        "2.16.840.1.113883.10.20.22.2.5", //Problem Section with Coded Entries Optional
        "2.16.840.1.113883.10.20.22.2.43", //Hospital Admission Diagnosis Section
        "2.16.840.1.113883.10.20.22.2.24", //Hospital Discharge Diagnosis Section
        "2.16.840.1.113883.10.20.22.2.28", //Procedure Findings Section
        "2.16.840.1.113883.10.20.22.2.36", //Postprocedure Diagnosis Section
        "2.16.840.1.113883.10.20.22.2.20", //History of Past Illness Section
        "2.16.840.1.113883.10.20.22.2.37", //Complications Section
        "2.16.840.1.113883.10.20.22.2.37", //Complications Section
        "2.16.840.1.113883.10.20.22.2.34", //Preoperative Diagnosis Section
        "2.16.840.1.113883.10.20.22.2.22.1", //Encounters Section with Coded Entries Required
        "2.16.840.1.113883.10.20.22.2.22", //Encounters Section with Coded Entries Optional
        "2.16.840.1.113883.10.20.1.11", //previous template id - CCD/C32
    ]); // coded entries required
    problemsSection.fields([
        ["problems", "0..*", ProblemObservation.xpath(), ProblemObservation],
    ]);

    problemsSection.cleanupStep(cleanup.replaceWithField("problems"));
    return [problemsSection, ProblemObservation];
}

exports.problemsSection = exportProblemsSection;
exports.problemsEntry = exportProblemsSection;
