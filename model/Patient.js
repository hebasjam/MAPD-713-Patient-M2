let mongoose = require('mongoose');
let patientModel = mongoose.Schema({
    name: {type: String},
    address: {type: String},
    mobile: {type: String},
    email: {type: String, required: true},
    birthdate: {type: String},
    gender: {type: String},
    photo: {type: String},
    condition: {type: String, enum: ['normal', 'critical'], default: 'normal'},
    tests: [
        {
            date: {type: Date},
            type: {type: String, enum: ['blood_pressure', 'respiratory_rate', 'blood_oxygen_level', 'heartbeat_rate']},
            reading:{ type: String},

        }, {timestamps: true}
    ]
}, {timestamps: true}, {
    collection: "patientApp"
});

module.exports = mongoose.model('Patient', patientModel);