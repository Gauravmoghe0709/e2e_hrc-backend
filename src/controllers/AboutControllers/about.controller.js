const AboutHero = require("../../model/About models/AboutHero.model");
const WhoWeAre = require("../../model/About models/WhoWeAre.model");
const BridgingTheGap = require("../../model/About models/BridgingTheGap.model");
const AboutInfo = require("../../model/About models/AboutInfo.model");
const TeamMember = require("../../model/About models/TeamMember.model");
const AboutTestimonial = require("../../model/About models/AboutTestimonial.model");
const WhyChooseE2E = require("../../model/About models/WhyChooseE2E.model");
const WhyChooseE2ESection = require("../../model/About models/WhyChooseE2ESection.model");
const WhyChooseE2ECard = require("../../model/About models/WhyChooseE2ECard.model");
const uploadImage = require("../../services/storage.services");



// ─── ABOUT HERO ───────────────────────────────────────────────────────────────

async function getAboutHero(req, res) {
    try {
        const hero = await AboutHero.findOne().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: hero || {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function createAboutHero(req, res) {
    const { subtitle, mainTitle, description, button1Text, button1Link, button2Text, button2Link, isActive } = req.body;

    if (!mainTitle) {
        return res.status(400).json({
            success: false,
            message: "mainTitle is required"
        });
    }

    let imageUrl = "";

    if (req.file) {
        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-about");
        imageUrl = uploadResponse.url;
    }

    try {
       const newhero = await AboutHero.create({
            subTitle: subtitle,
            mainTitle,
            description,
            button1Text,
            button1Link,
            button2Text,
            button2Link,
            heroImage: imageUrl,
            isActive: isActive === 'false' || isActive === false ? false : true
        });
        
        res.status(201).json({ success: true, message: "About Hero created successfully", data: newhero });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
        
    }

}

async function updateAboutHero(req, res) {
    const { subtitle, mainTitle, description, button1Text, button1Link, button2Text, button2Link, isActive } = req.body;
    const updateData = { subTitle: subtitle, mainTitle, description, button1Text, button1Link, button2Text, button2Link, isActive };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    try {
        const hero = await AboutHero.findByIdAndUpdate(req.params.id, updateData, { returnDocument: "after" });
        if (!hero) return res.status(404).json({ success: false, message: "About Hero not found" });
        res.status(200).json({ success: true, message: "About Hero updated successfully", data: hero });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
async function deleteAboutHero (req,res){
    try {
        const hero = await AboutHero.findByIdAndDelete(req.params.id);
        if (!hero) return res.status(404).json({ success: false, message: "About Hero not found" });
        res.status(200).json({ success: true, message: "About Hero deleted successfully", data: hero });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
async function uploadAboutHeroImage(req, res) {
    try {
        const hero = await AboutHero.findById(req.params.id);
        if (!hero) return res.status(404).json({ success: false, message: "About Hero not found" });
        
        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-about");
            hero.heroImage = uploadResponse.url;
            await hero.save();
        }
        
        res.status(200).json({ success: true, message: "About Hero image uploaded successfully", data: hero });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// ─── WHO WE ARE ───────────────────────────────────────────────────────────────

async function createWhoWeAre(req, res) {
    try {
        const { title, image, description1, description2, description3, experienceYears, experienceLabel, isActive } = req.body;

        // validate required fields
        if (!title || !title.toString().trim()) {
            return res.status(400).json({ success: false, message: "title is required" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        let imageurl = "";
        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-about");
        imageurl = uploadResponse.url;

        if (isActive !== false) {
            await WhoWeAre.updateMany({ isActive: true }, { $set: { isActive: false } });
        }

        const whoWeAre = await WhoWeAre.create({
            title,
            image: imageurl || "",
            description1: description1 || "",
            description2: description2 || "",
            description3: description3 || "",
            experienceYears: experienceYears || "",
            experienceLabel: experienceLabel || "",
            isActive: isActive ?? true
        });

        res.status(201).json({ success: true, message: "Who We Are section created successfully", data: whoWeAre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function getWhoWeAre(req, res) {
    try {
        const whoWeAre = await WhoWeAre.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: whoWeAre || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function updateWhoWeAre(req, res) {
    try {
        const { title, description1, description2, description3, experienceYears, experienceLabel, isActive } = req.body;
        const updateData = { title, description1, description2, description3, experienceYears, experienceLabel, isActive };

        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        if (updateData.isActive !== false) {
            await WhoWeAre.updateMany({ _id: { $ne: req.params.id }, isActive: true }, { $set: { isActive: false } });
        }

        const whoWeAre = await WhoWeAre.findByIdAndUpdate(req.params.id, updateData, { returnDocument: "after" });

        if (!whoWeAre) return res.status(404).json({ success: false, message: "Who We Are section not found" });

        res.status(200).json({ success: true, message: "Who We Are section updated successfully", data: whoWeAre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function uploadWhoWeAreImage(req, res) {
    try {
        const whoWeAre = await WhoWeAre.findById(req.params.id);
        if (!whoWeAre) return res.status(404).json({ success: false, message: "Who We Are section not found" });

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-about");
        whoWeAre.image = uploadResponse.url;
        await whoWeAre.save();

        res.status(200).json({ success: true, message: "Who We Are image uploaded successfully", data: whoWeAre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function deleteWhoWeAre(req, res) {
    try {
        const whoWeAre = await WhoWeAre.findByIdAndDelete(req.params.id);
        if (!whoWeAre) return res.status(404).json({ success: false, message: "Who We Are section not found" });

        res.status(200).json({ success: true, message: "Who We Are section deleted successfully", data: whoWeAre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// ─── ABOUT INFO ───────────────────────────────────────────────────────────────

async function createAboutInfo(req, res) {
    try {
        const { badgeText, title, description, bulletPoints, isActive } = req.body;

        if (!badgeText?.toString().trim() || !title?.toString().trim() || !description?.toString().trim()) {
            return res.status(400).json({ success: false, message: "badgeText, title, and description are required" });
        }

        const normalizedBulletPoints = (Array.isArray(bulletPoints) ? bulletPoints : [])
            .filter((point) => point && (point.text || point.order !== undefined))
            .map((point, index) => ({
                text: point.text?.toString().trim() || "",
                order: Number.isFinite(Number(point.order)) ? Number(point.order) : index + 1,
            }))
            .sort((a, b) => a.order - b.order);

        if (isActive !== false) {
            await AboutInfo.updateMany({ isActive: true }, { $set: { isActive: false } });
        }

        const aboutInfo = await AboutInfo.create({
            badgeText: badgeText.toString().trim(),
            title: title.toString().trim(),
            description: description.toString().trim(),
            bulletPoints: normalizedBulletPoints,
            isActive: isActive ?? true,
        });

        res.status(201).json({ success: true, message: "About info created successfully", data: aboutInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function getAboutInfo(req, res) {
    try {
        const aboutInfo = await AboutInfo.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: aboutInfo || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function getAllAboutInfo(req, res) {
    try {
        const aboutInfos = await AboutInfo.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: aboutInfos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function updateAboutInfo(req, res) {
    try {
        const { badgeText, title, description, bulletPoints, isActive } = req.body;

        if (badgeText !== undefined && !badgeText?.toString().trim()) {
            return res.status(400).json({ success: false, message: "badgeText is required" });
        }
        if (title !== undefined && !title?.toString().trim()) {
            return res.status(400).json({ success: false, message: "title is required" });
        }
        if (description !== undefined && !description?.toString().trim()) {
            return res.status(400).json({ success: false, message: "description is required" });
        }

        const normalizedBulletPoints = Array.isArray(bulletPoints)
            ? bulletPoints
                .filter((point) => point && (point.text || point.order !== undefined))
                .map((point, index) => ({
                    text: point.text?.toString().trim() || "",
                    order: Number.isFinite(Number(point.order)) ? Number(point.order) : index + 1,
                }))
                .sort((a, b) => a.order - b.order)
            : undefined;

        const updateData = {
            badgeText: badgeText?.toString().trim(),
            title: title?.toString().trim(),
            description: description?.toString().trim(),
            bulletPoints: normalizedBulletPoints,
            isActive,
        };

        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        if (updateData.isActive !== false) {
            await AboutInfo.updateMany({ _id: { $ne: req.params.id }, isActive: true }, { $set: { isActive: false } });
        }

        const aboutInfo = await AboutInfo.findByIdAndUpdate(req.params.id, updateData, { returnDocument: "after" });

        if (!aboutInfo) {
            return res.status(404).json({ success: false, message: "About info section not found" });
        }

        res.status(200).json({ success: true, message: "About info updated successfully", data: aboutInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function uploadAboutInfoImage(req, res) {
    try {
        const aboutInfo = await AboutInfo.findById(req.params.id);
        if (!aboutInfo) return res.status(404).json({ success: false, message: "About info section not found" });

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-about");
        aboutInfo.image = uploadResponse.url;
        await aboutInfo.save();

        res.status(200).json({ success: true, message: "About info image uploaded successfully", data: aboutInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function deleteAboutInfo(req, res) {
    try {
        const aboutInfo = await AboutInfo.findByIdAndDelete(req.params.id);
        if (!aboutInfo) return res.status(404).json({ success: false, message: "About info section not found" });

        res.status(200).json({ success: true, message: "About info deleted successfully", data: aboutInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// ─── BRIDGING THE GAP ───────────────────────────────────────────────────────

async function createBridgingTheGap(req, res) {
  try {
    const { heading, description, feature1, feature2, feature3, isActive } = req.body;

    if (!heading || !heading.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "heading is required"
      });
    }

    let imageUrl = "";

    if (req.file) {
      const uploadResponse = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        "e2e-about"
      );
      imageUrl = uploadResponse.url;
    }

    const activeValue =
      isActive === "false" || isActive === false ? false : true;

    if (activeValue === true) {
      await BridgingTheGap.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );
    }

    const doc = await BridgingTheGap.create({
      heading: heading.trim(),
      description: description || "",
      feature1: feature1 || "",
      feature2: feature2 || "",
      feature3: feature3 || "",
      image: imageUrl,
      isActive: activeValue
    });

    res.status(201).json({
      success: true,
      message: "Bridging the Gap created",
      data: doc
    });
  } catch (error) {
    console.error("Create BridgingTheGap Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}

async function getBridgingTheGap(req, res) {
    try {
        const doc = await BridgingTheGap.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: doc || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function updateBridgingTheGap(req, res) {
    try {
        const { heading, description, feature1, feature2, feature3, isActive } = req.body;
        const updateData = { heading, description, feature1, feature2, feature3, isActive };
        Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);

        if (updateData.isActive !== false) {
            await BridgingTheGap.updateMany({ _id: { $ne: req.params.id }, isActive: true }, { $set: { isActive: false } });
        }

        const doc = await BridgingTheGap.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
        if (!doc) return res.status(404).json({ success: false, message: 'Bridging section not found' });
        res.status(200).json({ success: true, message: 'Bridging section updated', data: doc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function uploadBridgingTheGapImage(req, res) {
    try {
        const doc = await BridgingTheGap.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Bridging section not found' });
        if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required' });
        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-about');
        doc.image = uploadResponse.url;
        await doc.save();
        res.status(200).json({ success: true, message: 'Image uploaded', data: doc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteBridgingTheGap(req, res) {
    try {
        const doc = await BridgingTheGap.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Bridging section not found' });
        res.status(200).json({ success: true, message: 'Bridging section deleted', data: doc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}




/*async function createWhyChoose(req, res) {
    try {
        const { sectionTitle, sectionDescription, title, description, displayOrder, isActive } = req.body;

        if (!sectionTitle || !sectionTitle.toString().trim()) {
            return res.status(400).json({ success: false, message: 'sectionTitle is required' });
        }

        if (!title || !title.toString().trim()) {
            return res.status(400).json({ success: false, message: 'title is required' });
        }

        let imageUrl = '';

        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-about');
            imageUrl = uploadResponse?.url || '';
        }

        const item = await WhyChooseE2E.create({
            sectionTitle: sectionTitle.toString().trim(),
            sectionDescription: sectionDescription?.toString().trim() || '',
            title: title.toString().trim(),
            description: description?.toString().trim() || '',
            image: imageUrl,
            displayOrder: Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : 0,
            isActive: isActive === 'false' || isActive === false ? false : true,
        });

        res.status(201).json({ success: true, message: 'Why Choose E2E card created successfully', data: item });
    } catch (error) {
        console.error('Create WhyChoose Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getWhyChoose(req, res) {
    try {
        const items = await WhyChooseE2E.find({ isActive: true }).sort({ displayOrder: 1 });
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        console.error('Get WhyChoose Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getAdminWhyChoose(req, res) {
    try {
        const items = await WhyChooseE2E.find().sort({ displayOrder: 1 });
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        console.error('Get Admin WhyChoose Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getWhyChooseById(req, res) {
    try {
        const item = await WhyChooseE2E.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Why Choose E2E card not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error('Get WhyChoose ById Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function updateWhyChoose(req, res) {
    try {
        const { sectionTitle, sectionDescription, title, description, displayOrder, isActive } = req.body;

        if (sectionTitle !== undefined && !sectionTitle?.toString().trim()) {
            return res.status(400).json({ success: false, message: 'sectionTitle is required' });
        }

        if (title !== undefined && !title?.toString().trim()) {
            return res.status(400).json({ success: false, message: 'title is required' });
        }

        const updateData = {
            sectionTitle: sectionTitle?.toString().trim(),
            sectionDescription: sectionDescription?.toString().trim(),
            title: title?.toString().trim(),
            description: description?.toString().trim(),
            displayOrder: Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : displayOrder,
            isActive,
        };

        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        const item = await WhyChooseE2E.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Why Choose E2E card not found' });
        }

        res.status(200).json({ success: true, message: 'Why Choose E2E card updated successfully', data: item });
    } catch (error) {
        console.error('Update WhyChoose Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteWhyChoose(req, res) {
    try {
        const item = await WhyChooseE2E.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Why Choose E2E card not found' });
        }
        res.status(200).json({ success: true, message: 'Why Choose E2E card deleted successfully', data: item });
    } catch (error) {
        console.error('Delete WhyChoose Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function uploadWhyChooseImage(req, res) {
    try {
        const item = await WhyChooseE2E.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Why Choose E2E card not found' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-about');
        item.image = uploadResponse?.url || item.image;
        await item.save();

        res.status(200).json({ success: true, message: 'Why Choose E2E image uploaded successfully', data: item });
    } catch (error) {
        console.error('Upload WhyChoose Image Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}*/

// ─── WHY CHOOSE E2E SECTION ───────────────────────────────────────────────────

async function createWhyChooseE2ESection(req, res) {
    try {
        const { sectionTitle, sectionDescription, isActive } = req.body;

        if (!sectionTitle || !sectionTitle.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: 'sectionTitle is required',
            });
        }

        const section = await WhyChooseE2ESection.create({
            sectionTitle: sectionTitle.toString().trim(),
            sectionDescription: sectionDescription?.toString().trim() || '',
            isActive: isActive === 'false' || isActive === false ? false : true,
        });

        res.status(201).json({
            success: true,
            message: 'Why Choose E2E section created successfully',
            data: section,
        });
    } catch (error) {
        console.error('Create WhyChooseE2ESection Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getAdminWhyChooseE2ESection(req, res) {
    try {
        const section = await WhyChooseE2ESection.findOne().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: section || null,
        });
    } catch (error) {
        console.error('Get WhyChooseE2ESection Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function updateWhyChooseE2ESection(req, res) {
    try {
        const { sectionTitle, sectionDescription, isActive } = req.body;

        if (sectionTitle !== undefined && !sectionTitle?.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: 'sectionTitle is required',
            });
        }

        const updateData = {
            sectionTitle: sectionTitle?.toString().trim(),
            sectionDescription: sectionDescription?.toString().trim(),
            isActive,
        };

        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        if (updateData.isActive !== false) {
            await WhyChooseE2ESection.updateMany(
                { _id: { $ne: req.params.id }, isActive: true },
                { $set: { isActive: false } }
            );
        }

        const section = await WhyChooseE2ESection.findByIdAndUpdate(req.params.id, updateData, {
            returnDocument: 'after',
        });

        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose E2E section not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Why Choose E2E section updated successfully',
            data: section,
        });
    } catch (error) {
        console.error('Update WhyChooseE2ESection Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteWhyChooseE2ESection(req, res) {
    try {
        const section = await WhyChooseE2ESection.findByIdAndDelete(req.params.id);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose E2E section not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Why Choose E2E section deleted successfully',
            data: section,
        });
    } catch (error) {
        console.error('Delete WhyChooseE2ESection Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// ─── WHY CHOOSE E2E CARDS ─────────────────────────────────────────────────────

async function createWhyChooseE2ECard(req, res) {
    try {
        const { title, description, displayOrder, isActive } = req.body;

        if (!title || !title.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: 'title is required',
            });
        }

        let imageUrl = '';

        if (req.file) {
            const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-about');
            imageUrl = uploadResponse?.url || '';
        }

        const card = await WhyChooseE2ECard.create({
            title: title.toString().trim(),
            description: description?.toString().trim() || '',
            image: imageUrl,
            displayOrder: Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : 0,
            isActive: isActive === 'false' || isActive === false ? false : true,
        });

        res.status(201).json({
            success: true,
            message: 'Why Choose E2E card created successfully',
            data: card,
        });
    } catch (error) {
        console.error('Create WhyChooseE2ECard Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getAdminWhyChooseE2ECards(req, res) {
    try {
        const cards = await WhyChooseE2ECard.find().sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: cards.length,
            data: cards,
        });
    } catch (error) {
        console.error('Get WhyChooseE2ECards Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function updateWhyChooseE2ECard(req, res) {
    try {
        const { title, description, displayOrder, isActive } = req.body;

        if (title !== undefined && !title?.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: 'title is required',
            });
        }

        const updateData = {
            title: title?.toString().trim(),
            description: description?.toString().trim(),
            displayOrder: Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : displayOrder,
            isActive,
        };

        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

        const card = await WhyChooseE2ECard.findByIdAndUpdate(req.params.id, updateData, {
            returnDocument: 'after',
        });

        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose E2E card not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Why Choose E2E card updated successfully',
            data: card,
        });
    } catch (error) {
        console.error('Update WhyChooseE2ECard Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function uploadWhyChooseE2ECardImage(req, res) {
    try {
        const card = await WhyChooseE2ECard.findById(req.params.id);

        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose E2E card not found',
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required',
            });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-about');
        card.image = uploadResponse?.url || card.image;
        await card.save();

        res.status(200).json({
            success: true,
            message: 'Why Choose E2E card image uploaded successfully',
            data: card,
        });
    } catch (error) {
        console.error('Upload WhyChooseE2ECard Image Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteWhyChooseE2ECard(req, res) {
    try {
        const card = await WhyChooseE2ECard.findByIdAndDelete(req.params.id);

        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose E2E card not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Why Choose E2E card deleted successfully',
            data: card,
        });
    } catch (error) {
        console.error('Delete WhyChooseE2ECard Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// ─── WHY CHOOSE E2E PUBLIC API ────────────────────────────────────────────────

async function getWhyChoosePublic(req, res) {
    try {
        const section = await WhyChooseE2ESection.findOne({ isActive: true }).sort({ createdAt: -1 });
        const cards = await WhyChooseE2ECard.find({ isActive: true }).sort({ displayOrder: 1 });

        res.status(200).json({
            success: true,
            data: {
                section: section || null,
                cards: cards || [],
            },
        });
    } catch (error) {
        console.error('Get WhyChoosePublic Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {
    // hero
    createAboutHero,
    updateAboutHero,
    deleteAboutHero,
    uploadAboutHeroImage,
    getAboutHero,
    // who we are
    createWhoWeAre,
    getWhoWeAre,
    updateWhoWeAre,
    uploadWhoWeAreImage,
    deleteWhoWeAre,
    // about info
    createAboutInfo,
    getAboutInfo,
    getAllAboutInfo,
    updateAboutInfo,
    uploadAboutInfoImage,
    deleteAboutInfo,
    // bridging
    createBridgingTheGap,
    getBridgingTheGap,
    updateBridgingTheGap,
    uploadBridgingTheGapImage,
    deleteBridgingTheGap,
    // why choose e2e (old combined)
   /* createWhyChoose,
    getWhyChoose,
    getAdminWhyChoose,
    getWhyChooseById,
    updateWhyChoose,
    deleteWhyChoose,
    uploadWhyChooseImage,*/

    // why choose e2e section (new separated)
    createWhyChooseE2ESection,
    getAdminWhyChooseE2ESection,
    updateWhyChooseE2ESection,
    deleteWhyChooseE2ESection,
    // why choose e2e cards (new separated)
    createWhyChooseE2ECard,
    getAdminWhyChooseE2ECards,
    updateWhyChooseE2ECard,
    uploadWhyChooseE2ECardImage,
    deleteWhyChooseE2ECard,
    // why choose e2e public (new combined for public API)
    getWhyChoosePublic,
};

