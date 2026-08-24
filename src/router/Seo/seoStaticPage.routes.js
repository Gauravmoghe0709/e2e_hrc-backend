const express = require('express');
const router = express.Router();
const {
  getAdminSEO,
  getAdminSEOById,
  createSEO,
  updateSEO,
  deleteSEO,
  getSEOByPageKey,
} = require('../../controllers/SEO/seoPage.controller');
const protectedRoute = require('../../middleware/auth.middleware');

router.get('/v1/admin/seo', protectedRoute, getAdminSEO);
router.get('/v1/admin/seo/:id', protectedRoute, getAdminSEOById);
router.post('/v1/admin/seo', protectedRoute, createSEO);
router.put('/v1/admin/seo/:id', protectedRoute, updateSEO);
router.delete('/v1/admin/seo/:id', protectedRoute, deleteSEO);

router.get('/v1/seo/:pageKey', getSEOByPageKey);

module.exports = router;
