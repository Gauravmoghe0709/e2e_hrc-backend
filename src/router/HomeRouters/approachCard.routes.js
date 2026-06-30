const express = require('express');
const router = express.Router();
const approachCardController = require('../../controllers/HomeControllers/approachCard.controller');
//const protectedRoute = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

// Public routes
router.get('/approach-cards', approachCardController.getActiveApproachCards);

// Admin routes
router.get('/admin/approach-cards', approachCardController.getAdminApproachCards);
router.post('/admin/approach-cards', upload.single("image"), approachCardController.createApproachCard);
router.put('/admin/approach-cards/:id', upload.single("image"), approachCardController.updateApproachCard);
router.delete('/admin/approach-cards/:id', approachCardController.deleteApproachCard);
router.post('/admin/approach-cards/:id/image', upload.single('image'), approachCardController.uploadApproachCardImage);

module.exports = router;
