const mongoose = require("mongoose");

const contactEnquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    contactNumber: {
        type: String
    },
    message: {
        type: String
    },
    attachment: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model("ContactEnquiry", contactEnquirySchema);
