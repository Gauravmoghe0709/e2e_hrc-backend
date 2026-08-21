const express = require('express');
const router = express.Router();
const {
  getAllContactUsSections,
  getContactUsSectionById,
  createContactUsSection,
  updateContactUsSection,
  deleteContactUsSection,
  updateContactUsSectionStatus,
  getActiveContactUsSection,
} = require('../../controllers/contactUs/contactUsController');


const upload = require('../../middleware/upload.middleware');
const protectedRoute = require('../../middleware/auth.middleware');

// ─── Admin APIs (Protected) ────────────────────────────────────────────────────

router.get('/admin/connect-section', protectedRoute, getAllContactUsSections);
router.get('/admin/connect-section/:id', protectedRoute, getContactUsSectionById);
router.post('/admin/connect-section', protectedRoute, upload.single('backgroundImage'), createContactUsSection);
router.put('/admin/connect-section/:id', protectedRoute, upload.single('backgroundImage'), updateContactUsSection)
router.delete('/admin/connect-section/:id', protectedRoute, deleteContactUsSection);
router.patch('/admin/connect-section/:id/status', protectedRoute, updateContactUsSectionStatus);

// ─── Public API ────────────────────────────────────────────────────────────────

router.get('/connect-section', getActiveContactUsSection);


module.exports = router;
