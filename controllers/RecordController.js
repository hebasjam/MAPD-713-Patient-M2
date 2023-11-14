const Patient = require("../model/Patient");
const mongoose = require("mongoose");
const apiResponse = require("../helpers/ApiResponse");

// Get all test
module.exports.getRecords = async (req, res) => {
    try {
        let data = await Patient.findOne({"_id": req.params.id}, {"tests": 1});
        if (!data) {
            return apiResponse.validationErrorWithData(res, "No data found", {});
        }
        apiResponse.successResponseWithData(res, "", data.tests.reverse());
    } catch (error) {
        apiResponse.ErrorResponse(res, error.message);
    }
};



// Get  test id
module.exports.getRecord = async (req, res) => {
    try {
        let data = await Patient.findOne(
            {"_id": req.params.id},
            {tests: {"$elemMatch": {"_id": mongoose.Types.ObjectId(req.params.testId)}}}
        );
        if (!data) {
            return apiResponse.validationErrorWithData(res, "No record found", {});
        }
        apiResponse.successResponseWithData(res, "", data.tests[0]);
    } catch (error) {
        apiResponse.ErrorResponse(res, error.message);
    }
};



module.exports.addRecord = async (req, res) => {
    try {
        let patient = await Patient.findById(req.params.id);
        if (!patient) {
            return apiResponse.validationErrorWithData(res, "Patient not found", {});
        }

        if (!req.body.type || !req.body.reading) {
            return apiResponse.ErrorResponse(res, 'Type and reading must be supplied');
        }

        const date = new Date().toLocaleString();
        patient.tests.push({type: req.body.type, reading: req.body.reading, date: date});

        await patient.save();
        apiResponse.successResponseWithData(res, "Record added successfully", patient);
    } catch (error) {
        apiResponse.ErrorResponse(res, error.message);
    }
};



module.exports.updateRecord = async (req, res) => {
    try {
        if (!req.body.type || !req.body.reading) {
            return apiResponse.ErrorResponse(res, 'Type and reading must be supplied');
        }

        await Patient.findOneAndUpdate(
            {_id: req.params.id, 'tests._id': req.params.testId},
            {
                '$set': {
                    'tests.$.type': req.body.type,
                    'tests.$.reading': req.body.reading,
                    'tests.$.date': new Date().toLocaleString()
                }
            }
        );

        apiResponse.successResponseWithData(res, "Record updated successfully");
    } catch (error) {
        apiResponse.ErrorResponse(res, error.message);
    }
};
