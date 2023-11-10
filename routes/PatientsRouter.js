const errors = require('restify-errors');
const patientController = require("../controllers/PatientController");
const recordController = require("../controllers/RecordController");
const patient = require('../model/Patient')

module.exports = server => {

    // Get all patients
    server.get('/patients', patientController.getPatients)

// // Get a patient by  id
    server.get('/patients/:id', patientController.getPatient)

    // update a patient by  id
    server.put('/patients/:id', patientController.updatePatient)

    // Create a new patient
    server.post('/patients', patientController.addPatient)

    // Delete patient with the given id
    server.del('/patients/:id', patientController.deletePatient)

    // Get all tests by one patient
    server.get('/patients/:id/tests', recordController.getRecords)

    // Get details test for patient
    server.get('/patients/:id/tests/:testId', recordController.getRecord)

    // add test for patient
    server.post('/patients/:id/tests', recordController.addRecord)

// Get update test for patient
    server.put('/patients/:id/tests/:testId', recordController.updateRecord)


};
