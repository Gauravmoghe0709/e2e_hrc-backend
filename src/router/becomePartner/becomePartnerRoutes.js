const express = require('express');
const router = express.Router();
const becomePartnerController = require('../../controllers/becomePartner/becomePartnerController');
const recruitmentPartnersController = require('../../controllers/becomePartner/recruitmentPartnersController');
const partnerTrustController = require('../../controllers/becomePartner/partnerTrustcontroller');
const {
    createPartnershipEnquiry,
    getAllPartnershipEnquiries,
    getPartnershipEnquiryById,
    updatePartnershipEnquiry,
    deletePartnershipEnquiry,
} = require('../../controllers/becomePartner/partnershipEnquiryController');
const {
  getAllLocations,
  getLocationById,
  getActiveLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../../controllers/becomePartner/locationcontroller');

const upload = require('../../middleware/upload.middleware');
const protectedRoute = require('../../middleware/auth.middleware');

// ─── Hero Section Public API ────────────────────────────────────────────────────────────────
router.get('/recruitment-partner/active', becomePartnerController.getActiveRecruitmentPartner);

// ─── Hero Section Admin APIs ────────────────────────────────────────────────────────────────
router.get('/admin/recruitment-partner', protectedRoute, becomePartnerController.getRecruitmentPartners);
router.post('/admin/recruitment-partner', protectedRoute, upload.single('image'), becomePartnerController.createRecruitmentPartner);
router.put('/admin/recruitment-partner/:id', protectedRoute, upload.single('image'), becomePartnerController.updateRecruitmentPartner);
router.delete('/admin/recruitment-partner/:id', protectedRoute, becomePartnerController.deleteRecruitmentPartner);

// ─── Recruitment Partners  API ────────────────────────────────────────────────────────────────
router.get('/recruitment-partners/active', recruitmentPartnersController.getActiveRecruitmentPartner);

// ─── Recruitment Partners  Admin APIs ────────────────────────────────────────────────────────────────
router.get('/admin/recruitment-partners', protectedRoute, recruitmentPartnersController.getRecruitmentPartners);
router.post('/admin/recruitment-partners', protectedRoute, upload.single('image'), recruitmentPartnersController.createRecruitmentPartner);
router.put('/admin/recruitment-partners/:id', protectedRoute, upload.single('image'), recruitmentPartnersController.updateRecruitmentPartner);
router.delete('/admin/recruitment-partners/:id', protectedRoute, recruitmentPartnersController.deleteRecruitmentPartner);

// ─── Trust & Transparency Public API ───────────────────────────────────────────────────────
router.get('/partner-trust/active', partnerTrustController.getActivePartnerTrust);

// ─── Trust & Transparency Admin APIs ───────────────────────────────────────────────────────
router.get('/admin/partner-trust', protectedRoute, partnerTrustController.getAllPartnerTrust);
router.post('/admin/partner-trust', protectedRoute, upload.single('image'), partnerTrustController.createPartnerTrust);
router.put('/admin/partner-trust/:id', protectedRoute, upload.single('image'), partnerTrustController.updatePartnerTrust);
router.delete('/admin/partner-trust/:id', protectedRoute, partnerTrustController.deletePartnerTrust);

// ─── Public API ────────────────────────────────────────────────────────────────
// Submit a new partnership enquiry (public — no auth required)
router.post('/partnership-enquiries', createPartnershipEnquiry);

// ─── Admin APIs (protected) ────────────────────────────────────────────────────
router.get('/admin/partnership-enquiries', protectedRoute, getAllPartnershipEnquiries);
router.get('/admin/partnership-enquiries/:id', protectedRoute, getPartnershipEnquiryById);
router.put('/admin/partnership-enquiries/:id', protectedRoute, updatePartnershipEnquiry);
router.delete('/admin/partnership-enquiries/:id', protectedRoute, deletePartnershipEnquiry);

// ─── Admin Location APIs ────────────────────────────────────────────────────────────────
router.get('/admin/locations', protectedRoute, getAllLocations);
router.get('/admin/locations/:id', protectedRoute, getLocationById);
router.post('/admin/locations', protectedRoute, createLocation);
router.put('/admin/locations/:id', protectedRoute, updateLocation);
router.delete('/admin/locations/:id', protectedRoute, deleteLocation);

 // Public API to get active locations
router.get('/locations/active', getActiveLocations);

module.exports = router;
