const express = require('express');
const router = express.Router();
const {
  createContactUsEnquiry,
  getAllContactUsEnquiries,
  getContactUsEnquiryById,
  updateContactUsEnquiryStatus,
  deleteContactUsEnquiry,
} = require('../../controllers/contactUs/contactUsEnquiryController');
const upload = require('../../middleware/upload.middleware');
const protectedRoute = require('../../middleware/auth.middleware');

// ─── Public API ────────────────────────────────────────────────────────────────

router.post('/enquiries', upload.single('attachment'), createContactUsEnquiry);

// ─── Admin APIs (Protected) ────────────────────────────────────────────────────

router.get('/enquiries', protectedRoute, getAllContactUsEnquiries);
router.get('/enquiries/:id', protectedRoute, getContactUsEnquiryById);
router.put('/enquiries/:id/status', protectedRoute, updateContactUsEnquiryStatus);
router.delete('/enquiries/:id', protectedRoute, deleteContactUsEnquiry);

module.exports = router;
