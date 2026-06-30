const express = require('express');
const router = express.Router();
const contactEnquiryController = require('../../controllers/HomeControllers/contactEnquiry.controller');
const protectedRoute = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

// Public route to submit enquiry
router.post('/contact-enquiries', upload.single('attachment'), contactEnquiryController.createEnquiry);

// Admin routes
router.get('/admin/contact-enquiries', protectedRoute, contactEnquiryController.getAllEnquiries);
router.get('/admin/contact-enquiries/:id', protectedRoute, contactEnquiryController.getEnquiryById);
router.put('/admin/contact-enquiries/:id/status', protectedRoute, contactEnquiryController.updateEnquiryStatus);
router.delete('/admin/contact-enquiries/:id', protectedRoute, contactEnquiryController.deleteEnquiry);

module.exports = router;
