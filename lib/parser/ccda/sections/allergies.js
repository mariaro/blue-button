"use strict";

// NOTE: allergies section not present in ccda-r1.0, so just kept
// templateIds hard-coded with ccda-r1.1 values
var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var Processor = require('../processor');

var exportAllergiesSection = function (version) {

    var allergySeverityObservation = component.define("allergySeverityObservation")
        .fields([
            ["code", "0..1", "h:value", shared.ConceptDescriptor],
            //["name", "0..1", "@code", shared.SimpleCode("2.16.840.1.113883.3.88.12.3221.6.8")]
            ["free_text_severity", "0..1", "h:text", shared.TextWithReference],
            ["interpretation", "0..1", "h:interpretationCode", shared.ConceptDescriptor]
        ]);

    var allergyReaction = component.define("allergyReaction");
    allergyReaction.templateRoot(["2.16.840.1.113883.10.20.22.4.9",
        '2.16.840.1.113883.10.20.1.54' //C32
    ]);
    allergyReaction.fields([
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["reaction", "1..1", "h:value", shared.ConceptDescriptor],
        ["free_text_reaction", "0..1", "h:text", shared.TextWithReference],
        ["severity", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.22.4.8' or h:templateId/@root='2.16.840.1.113883.10.20.1.55']", allergySeverityObservation]
    ]);

    var allergenDescriptor = shared.ConceptDescriptor.define('allergenDescriptor');
    allergenDescriptor.fields([
        ["name", "0..1", "h:originalText", shared.TextWithReference, 'epic']
    ]);

    /*
    var allergyStatusObservation = component.define("allergyStatusObservation");
    allergyStatusObservation.fields([
        ["code", "0..1", "@code"],
        ["status", "0..1", "@code", shared.SimpleCode("2.16.840.1.113883.3.88.12.80.68")],
    ]);
    */

    var allergyObservation = component.define("allergyObservation"); // this is status observation
    allergyObservation.templateRoot(["2.16.840.1.113883.10.20.22.4.7",
        '2.16.840.1.113883.10.20.1.18' //C32
    ]);
    allergyObservation.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        //NOTE: Negation Id (per PragueExpat)
        ["negation_indicator", "0..1", "./@negationInd", Processor.asBoolean],
        //NOTE allergen must be optional in case of negationInd = true (per PragueExpat)
        ["allergen", "0..1", "h:participant/h:participantRole/h:playingEntity/h:code", allergenDescriptor], // (see above) - was 1..1 //Require (optional in spec)
        ["allergenName", "0..1", "h:participant/h:participantRole/h:playingEntity/h:name", shared.TextWithReference],

        ["intolerance", "0..1", "h:value", shared.ConceptDescriptor],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],

        ["status", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.22.4.28']/h:value", shared.ConceptDescriptor],
        ["reactions", "0..*", allergyReaction.xpath(), allergyReaction],
        ["severity", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.22.4.8' or h:templateId/@root='2.16.840.1.113883.10.20.1.55']", allergySeverityObservation]
        // ["severity", "0..1", allergySeverityObservation.xpath(), allergySeverityObservation]
    ]);

    var problemAct = component.define('problemAct');
    problemAct.templateRoot(['2.16.840.1.113883.10.20.22.4.30',
        '2.16.840.1.113883.10.20.1.27' // Problem Act - C32
    ]);
    problemAct.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["problemStatus", "1..1", "h:statusCode/@code"],
        ["observation", "1..1", allergyObservation.xpath(), allergyObservation], // Ignore observation cardinality (in spec can be more than 1)
        ["source_section_code", "0..1", "ancestor::h:section/h:code", shared.SectionCode]
    ]);
    //problemAct.cleanupStep(cleanup.extractAllFields(['observation']));
    problemAct.cleanupStep(function(){
        if(Object.keys(this.js).length === 1 && this.js.source_section_code)
            delete this.js.source_section_code;
    });

    var allergiesSection = component.define('allergiesSection');
    allergiesSection.templateRoot([
        '2.16.840.1.113883.10.20.22.2.6',
        '2.16.840.1.113883.10.20.22.2.6.1',
        '2.16.840.1.113883.3.88.11.83.102' //C32 - Allergies section
    ]);
    allergiesSection.fields([
        ["problemAct", "1..*", problemAct.xpath(), problemAct]
    ]);
    allergiesSection.cleanupStep(cleanup.replaceWithField(["problemAct"]));

    return [allergiesSection, problemAct];
}
exports.allergiesSection = exportAllergiesSection;
exports.allergiesEntry = exportAllergiesSection;
