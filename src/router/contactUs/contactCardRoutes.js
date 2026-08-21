const express = require('express');
const router = express.Router();
const {
  getPublicContactCard,
  getAdminContactCard,
  createContactCard,
  updateContactCard,
  deleteContactCard,
} = require('../../controllers/contactUs/contactCardController');
const protectedRoute = require('../../middleware/auth.middleware');

// ─── Public API ────────────────────────────────────────────────────────────────

router.get('/v1/contact-card', getPublicContactCard);

// ─── Admin APIs (Protected) ────────────────────────────────────────────────────

router.get('/v1/admin/contact-card', protectedRoute, getAdminContactCard);
router.post('/v1/admin/contact-card', protectedRoute, createContactCard);
router.put('/v1/admin/contact-card/:id', protectedRoute, updateContactCard);
router.delete('/v1/admin/contact-card/:id', protectedRoute, deleteContactCard);

module.exports = router;
