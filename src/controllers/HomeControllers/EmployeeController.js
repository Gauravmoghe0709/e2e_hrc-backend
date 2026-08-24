const mongoose = require('mongoose');
const Employee = require('../../model/Home models/EmployeeModel');
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
  const response = await uploadFile(req.file.buffer, req.file.originalname, 'e2e-employee-attachments');
  return response.url;
};

const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      organizationName: req.body.organizationName,
      message: req.body.message,
      attachment: await getAttachmentUrl(req),
    });

    return res.status(201).json({ success: true, message: 'Employee enquiry submitted successfully', data: employee });
  } catch (error) {
    return sendError(res, error, 'Employee');
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'Employees fetched successfully', data: employees });
  } catch (error) {
    return sendError(res, error, 'Employee');
  }
};

const getEmployeeById = async (req, res) => {
  try {
    if (isInvalidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.status(200).json({ success: true, message: 'Employee fetched successfully', data: employee });
  } catch (error) {
    return sendError(res, error, 'employee');
  }
};

const updateEmployeeStatus = async (req, res) => {
  try {
    if (isInvalidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Status must be new, contacted, or closed' });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.status(200).json({ success: true, message: 'Employee status updated successfully', data: employee });
  } catch (error) {
    return sendError(res, error, 'employee');
  }
};

const deleteEmployee = async (req, res) => {
  try {
    if (isInvalidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.status(200).json({ success: true, message: 'Employee deleted successfully', data: null });
  } catch (error) {
    return sendError(res, error, 'employee');
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeStatus,
  deleteEmployee,
};
