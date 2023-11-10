const Patient = require("../model/Patient");
const mongoose = require("mongoose");
const apiResponse = require("../helpers/ApiResponse");

// Get all test
module.exports.getRecords = async (req, res, next) => {
    let data = await Patient.findOne(
        {"_id": req.params.id}, {"tests": 1}
    )
    if (!data)
        apiResponse.validationErrorWithData(res, "", data)

    apiResponse.successResponseWithData(res, "", data.tests.reverse)
}


// Get  test id
module.exports.getRecord = async (req, res, next) => {
    let data = await Patient.findOne({
            "_id": req.params.id, // patient Id
        }, {
            tests: {"$elemMatch": {"_id": mongoose.Types.ObjectId(req.params.testId)}} // patient record id
        }
    )


    if (!data)
        apiResponse.validationErrorWithData(res, "", data)

    apiResponse.successResponseWithData(res, "", data.tests[0])


}


module.exports.addRecord = async (req, res, next) => {
    let patient = await Patient.findById(req.params.id)

    if (req.body.type === undefined) {
        apiResponse.ErrorResponse(res, 'type must be supplied')
        return
    }
    if (req.body.reading === undefined) {
        apiResponse.ErrorResponse(res, 'reading must be supplied')
        return
    }

    const date = new Date().toLocaleString()

    patient.tests.push({type: req.body.type, reading: req.body.reading,date:date})
    // Creating new Patient.


    //save
    patient.save(function (error, result) {
        if (error) return next(new Error(JSON.stringify(error.errors)))
        res.send(201, result)
    })

}


module.exports.updateRecord = async (req, res, next) => {

    if (req.body.type === undefined) {
        apiResponse.ErrorResponse(res, 'type must be supplied')
        return
    }
    if (req.body.reading === undefined) {
        apiResponse.ErrorResponse(res, 'reading must be supplied')
        return
    }


    let data = Patient.findOneAndUpdate({_id: req.params.id, 'tests._id': req.params.testId}, {
        '$set': {
            'tests.$.type': req.body.type,
            'tests.$.reading': req.body.reading,
            'tests.$.date': new Date().toLocaleString()
        }
    }, function (err) {
        if (err) return next(new Error(JSON.stringify(err.e)))

    })

    try {
        console.log("update_test " + data.toString())
        apiResponse.successResponseWithData(res, "Updated Successfully")

    } catch (err) {
        apiResponse.ErrorResponse(res, err.message)
    }


}
