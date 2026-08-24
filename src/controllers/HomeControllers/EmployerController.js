const mongoose = require('mongoose');
const Employer = require('../../model/Home models/EmployerModel');
const uploadFile = require('../../services/storage.services');

const validStatuses = ['new', 'contacted', 'closed'];

const isInvalidId = (id) => !mongoose.Types.ObjectId.isValid(id);

const sendError = (res, error, resource) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors).map((item) => item.message).join(', '),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid ${resource} ID` });
  }

  console.error(`${resource} API error:`, error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const getAttachmentUrl = async (req) => {
  if (!req.file) return null;
  const response = await uploadFile(req.file.buffer, req.file.originalname, 'e2e-employer-attachments');
  return response.url;
};

const createEmployer = async (req, res) => {
  try {
    const employer = await Employer.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      organizationName: req.body.organizationName,
      vacancy: req.body.vacancy,
      location: req.body.location,
      message: req.body.message,
      attachment: await getAttachmentUrl(req),
    });

    return res.status(201).json({ success: true, message: 'Employer enquiry submitted successfully', data: employer });
  } catch (error) {
    return sendError(res, error, 'Employer');
  }
};

const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'Employers fetched successfully', data: employers });
  } catch (error) {
    return sendError(res, error, 'Employer');
  }
};

const getEmployerById = async (req, res) => {
  try {
    if (isInvalidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employer ID' });
    }

    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    return res.status(200).json({ success: true, message: 'Employer fetched successfully', data: employer });
  } catch (error) {
    return sendError(res, error, 'employer');
  }
};

const updateEmployerStatus = async (req, res) => {
  try {
    if (isInvalidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employer ID' });
    }
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Status must be new, contacted, or closed' });
    }

    const employer = await Employer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    return res.status(200).json({ success: true, message: 'Employer status updated successfully', data: employer });
  } catch (error) {
    return sendError(res, error, 'employer');
  }
};

const deleteEmployer = async (req, res) => {
  try {
    if (isInvalidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employer ID' });
    }

    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    return res.status(200).json({ success: true, message: 'Employer deleted successfully', data: null });
  } catch (error) {
    return sendError(res, error, 'employer');
  }
};

module.exports = {
  createEmployer,
  getAllEmployers,
  getEmployerById,
  updateEmployerStatus,
  deleteEmployer,
};
