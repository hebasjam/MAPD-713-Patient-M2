const Patient = require("../model/Patient");
const apiResponse = require("../helpers/ApiResponse");
var mongoose = require("mongoose");


// Get all patients
module.exports.getPatients = (req, res, next) => {
    console.log('GET request: patients');
    Patient.find({}).exec(function (error, result) {
        if (error) return next(new Error(JSON.stringify(error.errors)))

// ●	REST API Service shall allow health care providers to find out any patients in critical condition
// (e.g. patients with Blood Pressure less than 50/90 or greater than 60/150).


        var positionPatient = 0;
        result.forEach(function (item) {
            if (item.tests.length >= 1) {
                var positionTest = 0;
                var positionLastBloodPressure = -1
                item.tests.forEach(function (test) {

                    if (test.type == "blood_pressure") {
                        positionLastBloodPressure = positionTest
                    }
                    positionTest++;
                });
                if (positionLastBloodPressure >= 0) {
                    const readings = result[positionPatient].tests[positionLastBloodPressure].reading.split("/").map(Number)
                    if (isCritical(readings)) {
                        result[positionPatient].condition = "critical"
                    } else {
                        result[positionPatient].condition = "normal"
                    }
                }
            }

            // change item in patient here
            result[positionPatient].tests = result[positionPatient].tests.reverse


            positionPatient++;

        });


        const resultReversed = result;
        result.forEach(item => item.tests.reverse());
        resultReversed.reverse();

        apiResponse.successResponseWithData(res, "", resultReversed)

    });
}

function isCritical(readings) {
    return (readings[0] < 50 || readings[0] > 60) || (readings[1] < 90 || readings[1] > 150);
}

// get patient
module.exports.getPatient = async (req, res, next) => {


    let result = await Patient.findOne({_id: req.params.id})


    if (result.tests.length >= 1) {
        var positionTest = 0;
        var positionLastBloodPressure = -1
        result.tests.forEach(function (test) {
            if (test.type == "blood_pressure") {
                positionLastBloodPressure = positionTest
            }
            positionTest++;
        });
        if (positionLastBloodPressure >= 0) {
            const readings = result.tests[positionLastBloodPressure].reading.split("/").map(Number)
            if (isCritical(readings)) {
                result.condition = "critical"
            } else {
                result.condition = "normal"
            }
        }
    }

    result.tests.reverse()
    if (result) {
        apiResponse.successResponseWithData(res, "", result)
    } else {
        apiResponse.validationErrorWithData(res, "", result)
    }


}

// get patient
module.exports.updatePatient = async (req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        apiResponse.validationErrorWithData(
            res,
            "Invalid Error.",
            "Invalid ID"
        );
    } else {
        Patient.findById(req.params.id, function (err, foundPatient) {
            if (foundPatient === null) {
                apiResponse.notFoundResponse(res, "Patient not exists with this id");
            } else {

                if (req.body.name) {
                    foundPatient.name = req.body.name;
                }
                if (req.body.address) {
                    foundPatient.address = req.body.address;
                }

                if (req.body.mobile) {
                    foundPatient.mobile = req.body.mobile;
                }

                if (req.body.email) {
                    foundPatient.email = req.body.email;
                }

                if (req.body.birthdate) {
                    foundPatient.birthdate = req.body.birthdate;
                }
                if (req.body.gender) {
                    foundPatient.gender = req.body.gender;
                }

                if (req.body.photo) {
                    foundPatient.photo = req.body.photo;
                }

                if (req.body.photo === "random") {
                    foundPatient.photo = "https://source.unsplash.com/random/75×75/?person,face" + new Date().getTime()
                }


                //update patient.
                Patient.findByIdAndUpdate(
                    req.params.id,
                    foundPatient,
                    {},
                    function (err) {
                        if (err) {
                            apiResponse.ErrorResponse(res, err);
                        } else {
                            apiResponse.successResponseWithData(res, "Patient update Success.", foundPatient);
                        }
                    }
                );
            }
        });

    }


}


module.exports.addPatient = (req, res, next) => {
    console.log('POST request: patient params = >' + JSON.stringify(req.params));
    console.log('POST request: patient body = >' + JSON.stringify(req.body));

    if (req.body === undefined) {
        apiResponse.ErrorResponse(res, 'Body must be supplied')
        return;
    }

    if (req.body.name === undefined) {
        apiResponse.ErrorResponse(res, 'Name must be supplied')
        return

    }
    if (req.body.address === undefined) {
        apiResponse.ErrorResponse(res, 'Address must be supplied')
        return

    }
    if (req.body.email === undefined) {
        apiResponse.ErrorResponse(res, 'email must be supplied')
        return

    }
    if (req.body.birthdate === undefined) {
        apiResponse.ErrorResponse(res, 'birthdate must be supplied')
        return

    }

    if (req.body.gender === undefined) {
        apiResponse.ErrorResponse(res, "gender must be supplied")
        return

    }

    if (req.body.mobile === undefined) {
        apiResponse.ErrorResponse(res, "mobile must be supplied")

    }



    if (req.body.photo === undefined || req.body.photo === "random") {

        req.body.photo = "https://source.unsplash.com/random/75×75/?person,face" + new Date().getTime()

    }


    // Creating new Patient.
    var newPatients = new Patient({
        name: req.body.name,
        address: req.body.address,
        mobile: req.body.mobile,
        email: req.body.email,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        photo: req.body.photo,
        tests: []
    });

    //save
    newPatients.save(function (error, result) {
        if (error) return next(new Error(JSON.stringify(error.errors)))
        res.send(201, result)
    })

}

module.exports.deletePatient = (req, res, next) => {
    console.log('DEL request: patients/' + req.params.id);
    Patient.remove({_id: req.params.id}, function (error, result) {
        if (error) return next(new Error(JSON.stringify(error.errors)))
        apiResponse.successResponse(res, "Patient Deleted")
    });
}