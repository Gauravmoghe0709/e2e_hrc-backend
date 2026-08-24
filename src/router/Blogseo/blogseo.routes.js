const express = require('express');
const router = express.Router();
const seoController = require('../../controllers/blogseo/blogseo.controller');
const upload = require('../../middleware/upload.middleware');
const protectedRoute = require ("../../middleware/auth.middleware")
// Public API
router.get('/seo/:pageName', seoController.getActiveSEO);

// Admin APIs
router.post('/admin/seo',protectedRoute, upload.single('ogImage'), seoController.createSEO);
router.get('/admin/seo',protectedRoute,seoController.getAllSEO);
router.put('/admin/seo/:id',protectedRoute, seoController.updateSEO);
router.post('/admin/seo/:id/image', protectedRoute,upload.single('ogImage'), seoController.updateSEOImage);
router.delete('/admin/seo/:id',protectedRoute, seoController.deleteSEO);

module.exports = router;
