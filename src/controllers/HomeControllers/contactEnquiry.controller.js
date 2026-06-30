const ContactEnquiry = require("../../model/Home models/ContactEnquiry.model");
const uploadFile = require("../../services/storage.services");

// POST /api/contact-enquiries
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, contactNumber, message } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, message: "Name and email are required" });
        }

        let attachmentUrl = "";
        if (req.file) {
            const uploadResponse = await uploadFile(req.file.buffer, req.file.originalname, "e2e-enquiries");
            if (uploadResponse && uploadResponse.url) {
                attachmentUrl = uploadResponse.url;
            }
        }

        const newEnquiry = new ContactEnquiry({
            name,
            email,
            phone: phone || "",
            contactNumber: contactNumber || "",
            message: message || "",
            attachment: attachmentUrl
        });

        await newEnquiry.save();
        res.status(201).json({ success: true, message: "Enquiry submitted successfully", data: newEnquiry });
    } catch (error) {
        console.error("Error in createEnquiry:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/contact-enquiries
const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Enquiries fetched successfully", data: enquiries });
    } catch (error) {
        console.error("Error in getAllEnquiries:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/contact-enquiries/:id
const getEnquiryById = async (req, res) => {
    try {
        const enquiry = await ContactEnquiry.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }
        res.status(200).json({ success: true, message: "Enquiry fetched successfully", data: enquiry });
    } catch (error) {
        console.error("Error in getEnquiryById:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PUT /api/admin/contact-enquiries/:id/status
const updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        const validStatuses = ['Pending', 'In Progress', 'Resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const updatedEnquiry = await ContactEnquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedEnquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }

        res.status(200).json({ success: true, message: "Enquiry status updated successfully", data: updatedEnquiry });
    } catch (error) {
        console.error("Error in updateEnquiryStatus:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/admin/contact-enquiries/:id
const deleteEnquiry = async (req, res) => {
    try {
        const deletedEnquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);
        if (!deletedEnquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }
        res.status(200).json({ success: true, message: "Enquiry deleted successfully", data: null });
    } catch (error) {
        console.error("Error in deleteEnquiry:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    createEnquiry,
    getAllEnquiries,
    getEnquiryById,
    updateEnquiryStatus,
    deleteEnquiry
};
