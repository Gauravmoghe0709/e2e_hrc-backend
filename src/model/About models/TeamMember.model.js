const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        designation: { type: String, required: true },
        profileImage: { type: String, default: "" },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
