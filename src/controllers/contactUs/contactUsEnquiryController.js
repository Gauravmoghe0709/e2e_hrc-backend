const mongoose = require('mongoose');
const ContactUsEnquiry = require('../../model/contactUs/contactUsEnquiryModel');
const uploadImage = require('../../services/storage.services');

// ─── Helper Function: Validate Email ───────────────────────────────────────────
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// ─── Helper Function: Validate I AM Enum ──────────────────────────────────────
const isValidIamValue = (value) => {
  const validValues = ['employer', 'job_seeker', 'recruitment_partner', 'other'];
  return validValues.includes(value.toLowerCase());
};

// ─── CREATE Contact Us Enquiry (Public) ────────────────────────────────────────
const createContactUsEnquiry = async (req, res) => {
  try {
    const { firstName, lastName, company, email, iam, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'firstName is required.',
      });
    }

    if (!lastName || !lastName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'lastName is required.',
      });
    }

    if (!company || !company.trim()) {
      return res.status(400).json({
        success: false,
        message: 'company is required.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'email is required.',
      });
    }

    // Validate email format
    if (!isValidEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!iam || !iam.trim()) {
      return res.status(400).json({
        success: false,
        message: 'iam is required.',
      });
    }

    // Validate iam enum value
    if (!isValidIamValue(iam.trim())) {
      return res.status(400).json({
        success: false,
        message: 'iam must be one of: employer, job_seeker, recruitment_partner, other.',
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: 'subject is required.',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'message is required.',
      });
    }

    // Handle optional attachment
    let attachmentData = undefined;

    if (req.file) {
      try {
        const uploadedFile = await uploadImage(
          req.file.buffer,
          req.file.originalname,
          'e2e-contact-enquiry'
        );

        attachmentData = {
          filename: req.file.originalname,
          url: uploadedFile.url,
          mimeType: req.file.mimetype,
          size: req.file.size,
        };
      } catch (uploadError) {
        console.error('Error uploading attachment:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload attachment. Please try again.',
        });
      }
    }

    // Create Contact Us enquiry document
    const newEnquiry = await ContactUsEnquiry.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company.trim(),
      email: email.trim().toLowerCase(),
      iam: iam.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      attachment: attachmentData,
      status: 'new',
    });

    return res.status(201).json({
      success: true,
      message: 'Contact enquiry submitted successfully.',
      data: newEnquiry,
    });
  } catch (error) {
    console.error('Error creating Contact Us enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET All Contact Us Enquiries (Admin) ──────────────────────────────────────
const getAllContactUsEnquiries = async (req, res) => {
  try {
    const enquiries = await ContactUsEnquiry.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      message: 'Contact enquiries fetched successfully.',
      data: enquiries,
      count: enquiries.length,
    });
  } catch (error) {
    console.error('Error fetching Contact Us enquiries:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── GET Contact Us Enquiry by ID (Admin) ──────────────────────────────────────
const getContactUsEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID.',
      });
    }

    const enquiry = await ContactUsEnquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact enquiry fetched successfully.',
      data: enquiry,
    });
  } catch (error) {
    console.error('Error fetching Contact Us enquiry by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── UPDATE Contact Us Enquiry Status (Admin) ──────────────────────────────────
const updateContactUsEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID.',
      });
    }

    if (!status || !status.trim()) {
      return res.status(400).json({
        success: false,
        message: 'status is required.',
      });
    }

    const validStatuses = ['new', 'read', 'replied'];
    const statusValue = status.trim().toLowerCase();

    if (!validStatuses.includes(statusValue)) {
      return res.status(400).json({
        success: false,
        message: 'status must be one of: new, read, replied.',
      });
    }

    const updatedEnquiry = await ContactUsEnquiry.findByIdAndUpdate(
      id,
      { status: statusValue },
      { new: true, runValidators: true }
    );

    if (!updatedEnquiry) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact enquiry status updated successfully.',
      data: updatedEnquiry,
    });
  } catch (error) {
    console.error('Error updating Contact Us enquiry status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// ─── DELETE Contact Us Enquiry (Admin) ─────────────────────────────────────────
const deleteContactUsEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID.',
      });
    }

    const deletedEnquiry = await ContactUsEnquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact enquiry deleted successfully.',
      data: deletedEnquiry,
    });
  } catch (error) {
    console.error('Error deleting Contact Us enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  createContactUsEnquiry,
  getAllContactUsEnquiries,
  getContactUsEnquiryById,
  updateContactUsEnquiryStatus,
  deleteContactUsEnquiry,
};
