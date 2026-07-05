const express = require('express');
const router = express.Router();
const approachCardController = require('../../controllers/HomeControllers/approachCard.controller');
const protectedRoute = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

// Public routes
router.get('/approach-cards', approachCardController.getActiveApproachCards);

// Admin routes
router.get('/admin/approach-cards', protectedRoute, approachCardController.getAdminApproachCards);
router.post('/admin/approach-cards', protectedRoute, upload.single("image"), approachCardController.createApproachCard);
router.put('/admin/approach-cards/:id', protectedRoute, upload.single("image"), approachCardController.updateApproachCard);
router.delete('/admin/approach-cards/:id', protectedRoute, approachCardController.deleteApproachCard);
router.post('/admin/approach-cards/:id/image', protectedRoute, upload.single('image'), approachCardController.uploadApproachCardImage);

module.exports = router;
