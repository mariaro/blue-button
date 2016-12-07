"use strict";

var shared = require('./shared');
var processor = require('./processor');
var component = require('./component');

var HealthCareFacility = component.define("HealthCareFacility")
    .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["code", "1..1", "h:code", shared.ConceptDescriptor],
    ]);

var Location = component.define("Location")
    .fields([
        ["healthCareFacility", "0..1", "h:healthCareFacility", HealthCareFacility]
    ]);

var ComponentOf = component.define("ComponentOf")
    .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["code", "1..1", "h:code", shared.ConceptDescriptor],
        ["date", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["location", "0..1", "h:location", Location],
        ["dischargeDispositionCode", "0..1", "h:dischargeDispositionCode", shared.ConceptDescriptor],
        ["encounterParticipant", "0..1", "h:encounterParticipant/h:assignedEntity", shared.assignedEntity]
    ]);

module.exports.encounter = component.define("Encounter")
    .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["code", "1..1", "h:code", shared.ConceptDescriptor],
        ["date", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["performer", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["componentOf", "0..1", "../../h:componentOf/h:encompassingEncounter", ComponentOf]
    ]);
