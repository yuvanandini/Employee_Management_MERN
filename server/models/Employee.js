const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    courses: { type: [String], required: true }, // Mark as required if needed
    gender: { type: String, required: true },
    image: { type: String }, // Image is optional
});

module.exports = mongoose.model('Employee', EmployeeSchema);
