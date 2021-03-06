"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");
var Processor = require('../processor');

var exportResultsSection = function (version) {
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];
    var sectionIDs = bbm.CCDA["sections" + version];

    var referenceRange = component.define('referenceRange')
        .fields([
            ["low", "0..1", "h:value/h:low/@value", Processor.asFloat],
            ["high", "0..1", "h:value/h:high/@value", Processor.asFloat],
            ["unit", "0..1", "h:value/h:low/@unit"],
            ["range", "0..1", "h:text/text()"]
        ]);

    var ResultObservation = component.define("ResultObservation")
        .templateRoot([clinicalStatementsIDs["ResultObservation"],
		'2.16.840.1.113883.3.88.11.83.15.1' //C32
	])
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["result", "1..1", "h:code", shared.ConceptDescriptor],
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
            ["textResult", "1..1", "h:value[@xsi:type='ST']", shared.TextWithReference],
            ["status", "1..1", "h:statusCode/@code"],
            ["reference_range", "0..1", "h:referenceRange/h:observationRange", referenceRange],
            ["codedValue", "0..1", "h:value[@xsi:type='CD'] | h:value[@xsi:type='CE']", shared.ConceptDescriptor],
            //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
            ["interpretations", "0..*", "h:interpretationCode", shared.ConceptDescriptor]
        ]);
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['resultName']));

    // TODO: Accomodating both PQ and CD values needed
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['codedValue']));

    var ResultsOrganizer = component.define("ResultsOrganizer")
        .templateRoot([clinicalStatementsIDs["ResultOrganizer"],
            '2.16.840.1.113883.10.20.1.32' //C32
        ])
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["result_set", "0..1", "h:code", shared.ConceptDescriptor],
            ["results", "1..*", ResultObservation.xpath(), ResultObservation],
            ["source_section_code", "0..1", "ancestor::h:section/h:code", shared.ConceptDescriptor]
        ]);
    //ResultsOrganizer.cleanupStep(cleanup.extractAllFields(['panelName']));
    ResultsOrganizer.cleanupStep(function(){
        if(Object.keys(this.js).length === 1 && this.js.source_section_code)
            delete this.js.source_section_code;
    });

    var resultsSection = component.define("resultsSection");
    resultsSection.templateRoot([sectionIDs.ResultsSection, sectionIDs.ResultsSectionEntriesOptional,
        '2.16.840.1.113883.3.88.11.83.122' //C32
    ]); // .1 for "entries required"
    resultsSection.fields([
        ["panels", "0..*", ResultsOrganizer.xpath(), ResultsOrganizer]
    ]);
    resultsSection.cleanupStep(cleanup.replaceWithField('panels'));

    return [resultsSection, ResultsOrganizer];
}

exports.resultsSection = exportResultsSection;
exports.resultsEntry = exportResultsSection;
