const HomeWhoWeAre = require("../../model/Home models/HomeWhoWeAre.model");
const HomeMissionVision = require("../../model/Home models/HomeMissionVision.model");
const HomeTestimonial = require("../../model/Home models/HomeTestimonial.model");
const HomeGlobalPresence = require("../../model/Home models/HomeGlobalPresence.model");
const uploadImage = require("../../services/storage.services");

// ─── HOME WHO WE ARE ─────────────────────────────────────────────────────────

async function getHomeWhoWeAre(req, res) {
    try {
        const data = await HomeWhoWeAre.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: data || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function createHomeWhoWeAre(req, res) {
    try {
        const { title, description1, description2, description3, experienceYears, experienceLabel, isActive } = req.body;

        if (!title || !title.toString().trim()) {
            return res.status(400).json({ success: false, message: "title is required" });
        }

        let imageurl = "";
        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-home");
            imageurl = uploadResponse.url;
        }

        if (isActive !== false) {
            await HomeWhoWeAre.updateMany({ isActive: true }, { $set: { isActive: false } });
        }

        const data = await HomeWhoWeAre.create({
            title,
            image: imageurl || "",
            description1: description1 || "",
            description2: description2 || "",
            description3: description3 || "",
            experienceYears: experienceYears || "",
            experienceLabel: experienceLabel || "",
            isActive: isActive ?? true
        });

        res.status(201).json({ success: true, message: "Home Who We Are created successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function updateHomeWhoWeAre(req, res) {
    try {
        const { title, description1, description2, description3, experienceYears, experienceLabel, isActive } = req.body;
        const updateData = { title, description1, description2, description3, experienceYears, experienceLabel, isActive };
        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        if (updateData.isActive !== false) {
            await HomeWhoWeAre.updateMany({ _id: { $ne: req.params.id }, isActive: true }, { $set: { isActive: false } });
        }

        const data = await HomeWhoWeAre.findByIdAndUpdate(req.params.id, updateData, { returnDocument: "after" });
        if (!data) return res.status(404).json({ success: false, message: "Home Who We Are not found" });

        res.status(200).json({ success: true, message: "Home Who We Are updated successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function uploadHomeWhoWeAreImage(req, res) {
    try {
        const data = await HomeWhoWeAre.findById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Home Who We Are not found" });

        if (!req.file) return res.status(400).json({ success: false, message: "Image file is required" });

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-home");
        data.image = uploadResponse.url;
        await data.save();

        res.status(200).json({ success: true, message: "Home Who We Are image uploaded successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function deleteHomeWhoWeAre(req, res) {
    try {
        const data = await HomeWhoWeAre.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Home Who We Are not found" });
        res.status(200).json({ success: true, message: "Home Who We Are deleted successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// ─── HOME MISSION & VISION ───────────────────────────────────────────────────

async function getHomeMissionVision(req, res) {
    try {
        const data = await HomeMissionVision.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: data || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function createHomeMissionVision(req, res) {
    try {
        const { missionTitle, missionDescription, visionTitle, visionDescription, isActive } = req.body;

        let visionImage = "";
        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-home");
            visionImage = uploadResponse.url;
        }

        if (isActive !== false) {
            await HomeMissionVision.updateMany({ isActive: true }, { $set: { isActive: false } });
        }

        const data = await HomeMissionVision.create({
            missionTitle: missionTitle || "Our Mission",
            missionDescription: missionDescription || "",
            visionTitle: visionTitle || "Our Vision",
            visionDescription: visionDescription || "",
            visionImage,
            isActive: isActive ?? true
        });

        res.status(201).json({ success: true, message: "Home Mission & Vision created successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function updateHomeMissionVision(req, res) {
    try {
        const { missionTitle, missionDescription, visionTitle, visionDescription, isActive } = req.body;
        const updateData = { missionTitle, missionDescription, visionTitle, visionDescription, isActive };
        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        if (updateData.isActive !== false) {
            await HomeMissionVision.updateMany({ _id: { $ne: req.params.id }, isActive: true }, { $set: { isActive: false } });
        }

        const data = await HomeMissionVision.findByIdAndUpdate(req.params.id, updateData, { returnDocument: "after" });
        if (!data) return res.status(404).json({ success: false, message: "Home Mission & Vision not found" });

        res.status(200).json({ success: true, message: "Home Mission & Vision updated successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function uploadHomeMissionVisionImage(req, res) {
    try {
        const data = await HomeMissionVision.findById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Home Mission & Vision not found" });

        if (!req.file) return res.status(400).json({ success: false, message: "Image file is required" });

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-home");
        data.visionImage = uploadResponse.url;
        await data.save();

        res.status(200).json({ success: true, message: "Home Mission & Vision image uploaded successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function deleteHomeMissionVision(req, res) {
    try {
        const data = await HomeMissionVision.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Home Mission & Vision not found" });
        res.status(200).json({ success: true, message: "Home Mission & Vision deleted successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// ─── HOME TESTIMONIALS ───────────────────────────────────────────────────────

async function getHomeTestimonials(req, res) {
    try {
        const data = await HomeTestimonial.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: data || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function getHomeTestimonialsAll(req, res) {
    try {
        const data = await HomeTestimonial.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function createHomeTestimonial(req, res) {
    try {
        const { sectionTitle, sectionHeading, sectionDescription, items, isActive } = req.body;

        if (isActive !== false) {
            await HomeTestimonial.updateMany({ isActive: true }, { $set: { isActive: false } });
        }

        const data = await HomeTestimonial.create({
            sectionTitle: sectionTitle || "Testimonials",
            sectionHeading: sectionHeading || "What They Are Saying",
            sectionDescription: sectionDescription || "",
            items: items || [],
            isActive: isActive ?? true
        });

        res.status(201).json({ success: true, message: "Home Testimonials created successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function updateHomeTestimonial(req, res) {
    try {
        const { sectionTitle, sectionHeading, sectionDescription, items, isActive } = req.body;
        const updateData = { sectionTitle, sectionHeading, sectionDescription, items, isActive };
        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        if (updateData.isActive !== false) {
            await HomeTestimonial.updateMany({ _id: { $ne: req.params.id }, isActive: true }, { $set: { isActive: false } });
        }

        const data = await HomeTestimonial.findByIdAndUpdate(req.params.id, updateData, { returnDocument: "after" });
        if (!data) return res.status(404).json({ success: false, message: "Home Testimonials not found" });

        res.status(200).json({ success: true, message: "Home Testimonials updated successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function deleteHomeTestimonial(req, res) {
    try {
        const data = await HomeTestimonial.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Home Testimonials not found" });
        res.status(200).json({ success: true, message: "Home Testimonials deleted successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// ─── HOME GLOBAL PRESENCE ────────────────────────────────────────────────────

async function getHomeGlobalPresence(req, res) {
    try {
        const data = await HomeGlobalPresence.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: data || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function createHomeGlobalPresence(req, res) {
    try {
        const { title, description, locations, isActive } = req.body;

        let mapImage = "";
        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-home");
            mapImage = uploadResponse.url;
        }

        if (isActive !== false) {
            await HomeGlobalPresence.updateMany({ isActive: true }, { $set: { isActive: false } });
        }

        const data = await HomeGlobalPresence.create({
            title: title || "Our Global Footprint",
            description: description || "",
            mapImage,
            locations: locations || [],
            isActive: isActive ?? true
        });

        res.status(201).json({ success: true, message: "Home Global Presence created successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function updateHomeGlobalPresence(req, res) {
    try {
        const { title, description, locations, isActive } = req.body;
        const updateData = { title, description, locations, isActive };
        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        if (updateData.isActive !== false) {
            await HomeGlobalPresence.updateMany({ _id: { $ne: req.params.id }, isActive: true }, { $set: { isActive: false } });
        }

        const data = await HomeGlobalPresence.findByIdAndUpdate(req.params.id, updateData, { returnDocument: "after" });
        if (!data) return res.status(404).json({ success: false, message: "Home Global Presence not found" });

        res.status(200).json({ success: true, message: "Home Global Presence updated successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function uploadHomeGlobalPresenceMap(req, res) {
    try {
        const data = await HomeGlobalPresence.findById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Home Global Presence not found" });

        if (!req.file) return res.status(400).json({ success: false, message: "Image file is required" });

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-home");
        data.mapImage = uploadResponse.url;
        await data.save();

        res.status(200).json({ success: true, message: "Home Global Presence map image uploaded successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function deleteHomeGlobalPresence(req, res) {
    try {
        const data = await HomeGlobalPresence.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Home Global Presence not found" });
        res.status(200).json({ success: true, message: "Home Global Presence deleted successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    getHomeWhoWeAre,
    createHomeWhoWeAre,
    updateHomeWhoWeAre,
    uploadHomeWhoWeAreImage,
    deleteHomeWhoWeAre,
    getHomeMissionVision,
    createHomeMissionVision,
    updateHomeMissionVision,
    uploadHomeMissionVisionImage,
    deleteHomeMissionVision,
    getHomeTestimonials,
    getHomeTestimonialsAll,
    createHomeTestimonial,
    updateHomeTestimonial,
    deleteHomeTestimonial,
    getHomeGlobalPresence,
    createHomeGlobalPresence,
    updateHomeGlobalPresence,
    uploadHomeGlobalPresenceMap,
    deleteHomeGlobalPresence,
};
