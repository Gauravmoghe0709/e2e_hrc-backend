const AboutHero = require("../../model/About models/AboutHero.model");
const WhoWeAre = require("../../model/About models/WhoWeAre.model");
const BridgingTheGap = require("../../model/About models/BridgingTheGap.model");
const TeamMember = require("../../model/About models/TeamMember.model");
const AboutTestimonial = require("../../model/About models/AboutTestimonial.model");
const uploadImage = require("../../services/storage.services");

// Helper for image uploads
const handleImageUpload = async (req, res, Model, id, fieldName, folderName) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }
        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, folderName);
        let doc;
        if (id) {
            doc = await Model.findById(id);
        } else {
            doc = await Model.findOne().sort({ createdAt: -1 });
            if (!doc) doc = new Model();
        }
        if (!doc) return res.status(404).json({ success: false, message: "Document not found" });
        
        doc[fieldName] = uploadResponse.url;
        await doc.save();
        res.status(200).json({ success: true, message: "Image uploaded successfully", data: doc });
    } catch (error) {
        console.error(`Error in handleImageUpload for ${Model.modelName}:`, error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ─── ABOUT HERO ───────────────────────────────────────────────────────────────

const getAboutHero = async (req, res) => {
    try {
        const data = await AboutHero.findOne().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: data || {} });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const upsertAboutHero = async (req, res) => {
    try {
        const updateData = { ...req.body };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        
        let data = await AboutHero.findOne().sort({ createdAt: -1 });
        if (data) {
            Object.assign(data, updateData);
            await data.save();
        } else {
            data = new AboutHero(updateData);
            await data.save();
        }
        res.status(200).json({ success: true, message: "Hero saved successfully", data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const uploadAboutHeroImage = (req, res) => handleImageUpload(req, res, AboutHero, null, "heroImage", "e2e-about");

// ─── WHO WE ARE ───────────────────────────────────────────────────────────────

const getWhoWeAre = async (req, res) => {
    try {
        const data = await WhoWeAre.findOne().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: data || {} });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const upsertWhoWeAre = async (req, res) => {
    try {
        const updateData = { ...req.body };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        
        let data = await WhoWeAre.findOne().sort({ createdAt: -1 });
        if (data) {
            Object.assign(data, updateData);
            await data.save();
        } else {
            data = new WhoWeAre(updateData);
            await data.save();
        }
        res.status(200).json({ success: true, message: "Who We Are saved successfully", data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const uploadWhoWeAreImage = (req, res) => handleImageUpload(req, res, WhoWeAre, null, "image", "e2e-about");

// ─── BRIDGING THE GAP ─────────────────────────────────────────────────────────

const getBridgingTheGap = async (req, res) => {
    try {
        const data = await BridgingTheGap.findOne().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: data || {} });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const upsertBridgingTheGap = async (req, res) => {
    try {
        const updateData = { ...req.body };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        
        let data = await BridgingTheGap.findOne().sort({ createdAt: -1 });
        if (data) {
            Object.assign(data, updateData);
            await data.save();
        } else {
            data = new BridgingTheGap(updateData);
            await data.save();
        }
        res.status(200).json({ success: true, message: "Bridging The Gap saved successfully", data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const uploadBridgingTheGapImage = (req, res) => handleImageUpload(req, res, BridgingTheGap, null, "image", "e2e-about");

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────

const getTeamMembers = async (req, res) => {
    try {
        // Admin gets all, active or not
        const data = await TeamMember.find().sort({ order: 1, createdAt: 1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const createTeamMember = async (req, res) => {
    try {
        const member = new TeamMember(req.body);
        await member.save();
        res.status(201).json({ success: true, message: "Team member created", data: member });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) return res.status(404).json({ success: false, message: "Member not found" });
        res.status(200).json({ success: true, message: "Team member updated", data: member });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: "Member not found" });
        res.status(200).json({ success: true, message: "Team member deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const uploadTeamMemberImage = (req, res) => handleImageUpload(req, res, TeamMember, req.params.id, "profileImage", "e2e-about");

// ─── ABOUT TESTIMONIALS ───────────────────────────────────────────────────────

const getAboutTestimonials = async (req, res) => {
    try {
        const data = await AboutTestimonial.find().sort({ order: 1, createdAt: 1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const createAboutTestimonial = async (req, res) => {
    try {
        const testimonial = new AboutTestimonial(req.body);
        await testimonial.save();
        res.status(201).json({ success: true, message: "Testimonial created", data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateAboutTestimonial = async (req, res) => {
    try {
        const testimonial = await AboutTestimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });
        res.status(200).json({ success: true, message: "Testimonial updated", data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteAboutTestimonial = async (req, res) => {
    try {
        const testimonial = await AboutTestimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });
        res.status(200).json({ success: true, message: "Testimonial deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const uploadAboutTestimonialImage = (req, res) => handleImageUpload(req, res, AboutTestimonial, req.params.id, "profileImage", "e2e-about");

module.exports = {
    getAboutHero, upsertAboutHero, uploadAboutHeroImage,
    getWhoWeAre, upsertWhoWeAre, uploadWhoWeAreImage,
    getBridgingTheGap, upsertBridgingTheGap, uploadBridgingTheGapImage,
    getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, uploadTeamMemberImage,
    getAboutTestimonials, createAboutTestimonial, updateAboutTestimonial, deleteAboutTestimonial, uploadAboutTestimonialImage
};
