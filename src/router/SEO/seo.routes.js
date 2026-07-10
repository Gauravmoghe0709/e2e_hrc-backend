const express = require('express');
const router = express.Router();
const seoController = require('../../controllers/SEO/seo.controller');
const upload = require('../../middleware/upload.middleware');

// Public API
router.get('/seo/:pageName', seoController.getActiveSEO);

// Admin APIs
router.post('/admin/seo', upload.single('ogImage'), seoController.createSEO);
router.get('/admin/seo', seoController.getAllSEO);
router.put('/admin/seo/:id', seoController.updateSEO);
router.post('/admin/seo/:id/image', upload.single('ogImage'), seoController.updateSEOImage);
router.delete('/admin/seo/:id', seoController.deleteSEO);

module.exports = router;
