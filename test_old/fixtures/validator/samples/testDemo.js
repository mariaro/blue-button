var testDemo = {
    "regular": {
        "name": {
            "middle": [
                "Isa"
            ],
            "last": "Jones",
            "first": "Isabella"
        },
        "dob": {
            "point": {
                "date": "1975-05-01T00:00:00Z",
                "precision": "day"
            }
        },
        "gender": "Female",
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19.5.99999.2",
            "extension": "998991"
        }, {
            "identifier": "2.16.840.1.113883.4.1",
            "extension": "111-00-2330"
        }],
        "marital_status": "Married",
        "addresses": [{
            "street_lines": [
                "1357 Amber Drive"
            ],
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US",
            "use": "primary home"
        }],
        "phone": [{
            "number": "(816)276-6909",
            "type": "primary home"
        }],
        "race_ethnicity": "White",
        "languages": [{
            "language": "en",
            "preferred": true,
            "mode": "Expressed spoken",
            "proficiency": "Good"
        }],
        "religion": "Christian (non-Catholic, non-specific)",
        "birthplace": {
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US"
        },
        "guardians": [{
            "relation": "Parent",
            "addresses": [{
                "street_lines": [
                    "1357 Amber Drive"
                ],
                "city": "Beaverton",
                "state": "OR",
                "zip": "97867",
                "country": "US",
                "use": "primary home"
            }],
            "names": [{
                "last": "Jones",
                "first": "Ralph"
            }],
            "phone": [{
                "number": "(816)276-6909",
                "type": "primary home"
            }]
        }]
    },
    "empty": {},
    "badNum": {
        "name": {
            "middle": [
                "Isa"
            ],
            "last": "Jones",
            "first": "Isabella"
        },
        "dob": [{
            "date": "1975-05-01T00:00:00Z",
            "precision": "day"
        }],
        "gender": "Female",
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19.5.99999.2",
            "extension": "998991"
        }, {
            "identifier": "2.16.840.1.113883.4.1",
            "extension": "111-00-2330"
        }],
        "marital_status": "Married",
        "addresses": [{
            "street_lines": [
                "1357 Amber Drive"
            ],
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US",
            "use": "primary home"
        }],
        "phone": [{
            "type": "primary home"
        }],
        "race_ethnicity": "White",
        "languages": [{
            "language": "en",
            "preferred": true,
            "mode": "Expressed spoken",
            "proficiency": "Good"
        }],
        "religion": "Christian (non-Catholic, non-specific)",
        "birthplace": {
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US"
        },
        "guardians": [{
            "relation": "Parent",
            "addresses": [{
                "street_lines": [
                    "1357 Amber Drive"
                ],
                "city": "Beaverton",
                "state": "OR",
                "zip": "97867",
                "country": "US",
                "use": "primary home"
            }],
            "names": [{
                "last": "Jones",
                "first": "Ralph"
            }],
            "phone": [{
                "number": "(816)276-6909",
                "type": "primary home"
            }]
        }]
    },
    "badAddr": {
        "name": {
            "middle": [
                "Isa"
            ],
            "last": "Jones"
        },
        "dob": [{
            "date": "1975-05-01T00:00:00Z",
            "precision": "day"
        }],
        "gender": "Female",
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19.5.99999.2",
            "extension": "998991"
        }, {
            "identifier": "2.16.840.1.113883.4.1",
            "extension": "111-00-2330"
        }],
        "marital_status": "Married",
        "addresses": [{
            "street_lines": [
                "1357 Amber Drive"
            ],
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US",
            "use": "primary home"
        }],
        "phone": [{
            "type": "primary home"
        }],
        "race_ethnicity": "White",
        "languages": [{
            "language": "en",
            "preferred": true,
            "mode": "Expressed spoken",
            "proficiency": "Good"
        }],
        "religion": "Christian (non-Catholic, non-specific)",
        "birthplace": {
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US"
        },
        "guardians": [{
            "relation": "Parent",
            "addresses": [{
                "city": "Beaverton",
                "state": "OR",
                "zip": "97867",
                "country": "US",
                "use": "primary home"
            }],
            "names": [{
                "last": "Jones",
                "first": "Ralph"
            }],
            "phone": [{
                "number": "(816)276-6909",
                "type": "primary home"
            }]
        }]
    }
};
module.exports = testDemo;
