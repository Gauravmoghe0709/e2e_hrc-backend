const express = require('express');
const router = express.Router();
const {
  getPublicHeadOffice,
  getAdminHeadOffice,
  createHeadOffice,
  updateHeadOffice,
  deleteHeadOffice,
} = require('../../controllers/contactUs/headOfficeController');
const protectedRoute = require('../../middleware/auth.middleware');

// ─── Public API ────────────────────────────────────────────────────────────────

router.get('/v1/head-office', getPublicHeadOffice);

// ─── Admin APIs (Protected) ────────────────────────────────────────────────────

router.get('/v1/admin/head-office', protectedRoute, getAdminHeadOffice);
router.post('/v1/admin/head-office', protectedRoute, createHeadOffice);
router.put('/v1/admin/head-office/:id', protectedRoute, updateHeadOffice);
router.delete('/v1/admin/head-office/:id', protectedRoute, deleteHeadOffice);

module.exports = router;
