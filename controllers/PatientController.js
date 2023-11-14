const Patient = require("../model/Patient");
const apiResponse = require("../helpers/ApiResponse");
var mongoose = require("mongoose");


// Get all patients
module.exports.getPatients = async (req, res) => {
    try {
        let patients = await Patient.find({});
        patients = patients.map(patient => {
            if (patient.tests.length > 0) {
                const lastBloodPressureTest = patient.tests.slice().reverse().find(test => test.type === "blood_pressure");
                if (lastBloodPressureTest) {
                    const readings = lastBloodPressureTest.reading.split("/").map(Number);
                    patient.condition = isCritical(readings) ? "critical" : "normal";
                }
            }
            patient.tests.reverse();
            return patient;
        });
        patients.reverse();
        apiResponse.successResponseWithData(res, "", patients);
    } catch (error) {
        console.error("Error details:", error);
        apiResponse.ErrorResponse(res, "Internal Server Error");
    }
};


function isCritical(readings) {
    return (readings[0] < 50 || readings[0] > 60) || (readings[1] < 90 || readings[1] > 150);
}

// get patient
module.exports.getPatient = async (req, res) => {
    try {
        let patient = await Patient.findById(req.params.id);
        if (patient) {
            updatePatientCondition(patient);
            patient.tests.reverse();
            apiResponse.successResponseWithData(res, "", patient);
        } else {
            apiResponse.notFoundResponse(res, "Patient not found");
        }
    } catch (error) {
        console.error("Error details:", error);
        apiResponse.ErrorResponse(res, "Internal Server Error");
    }
};


// get patient
module.exports.updatePatient = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
    }

    try {
        let patient = await Patient.findById(req.params.id);
        if (!patient) {
            return apiResponse.notFoundResponse(res, "Patient not exists with this id");
        }

        // Update fields if they exist in the request
        ['name', 'address', 'mobile', 'email', 'birthdate', 'gender', 'photo'].forEach(field => {
            if (req.body[field]) {
                patient[field] = req.body[field];
            }
        });

        if (req.body.photo === "random") {
            patient.photo = "https://source.unsplash.com/random/75×75/?person,face" + new Date().getTime();
        }

        await patient.save();
        apiResponse.successResponseWithData(res, "Patient update Success.", patient);
    } catch (error) {
        console.error("Error details:", error);
        apiResponse.ErrorResponse(res, "Internal Server Error");
    }
};



module.exports.addPatient = async (req, res) => {
    console.log('POST request: patient params = >' + JSON.stringify(req.params));
    console.log('POST request: patient body = >' + JSON.stringify(req.body));

    // Check for required fields
    const requiredFields = ['name', 'address', 'email', 'birthdate', 'gender', 'mobile'];
    for (let field of requiredFields) {
        if (req.body[field] === undefined) {
            return res.status(400).send({ error: `${field} must be supplied` });
        }
    }

    if (req.body.photo === undefined || req.body.photo === "random") {
        req.body.photo = "https://source.unsplash.com/random/75×75/?person,face" + new Date().getTime();
    }

    // Creating new Patient
    var newPatient = new Patient({
        // ... your patient fields ...
        name: req.body.name,
        address: req.body.address,
        mobile: req.body.mobile,
        email: req.body.email,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        photo: req.body.photo,
        // add other fields as necessary
    });

    // Save patient using async/await
    try {
        const result = await newPatient.save();
        res.send(201, result);
    } catch (error) {
        console.error("Error details:", error);
        res.send(500, error.message);
    }
};


module.exports.deletePatient = async (req, res) => {
    try {
        await Patient.deleteOne({ _id: req.params.id });
        apiResponse.successResponse(res, "Patient Deleted");
    } catch (error) {
        console.error("Error details:", error);
        apiResponse.ErrorResponse(res, "Internal Server Error");
    }
};
