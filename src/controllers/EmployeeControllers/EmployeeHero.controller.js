const EmployeeHero = require("../../model/Employee models/EmployeeHero");
const uploadImage = require("../../services/storage.services");

const createEmployeeHero = async (req, res) => {
    try {
        const { badgeText, titleLine1, description, isActive } = req.body;
        
        let leftTopImage = "";
        let leftBottomImage = "";
        let rightImage = "";

        if (req.files) {
            if (req.files.leftTopImage && req.files.leftTopImage[0]) {
                const resLT = await uploadImage(req.files.leftTopImage[0].buffer, req.files.leftTopImage[0].originalname, "e2e-employee-hero");
                leftTopImage = resLT.url;
            }
            if (req.files.leftBottomImage && req.files.leftBottomImage[0]) {
                const resLB = await uploadImage(req.files.leftBottomImage[0].buffer, req.files.leftBottomImage[0].originalname, "e2e-employee-hero");
                leftBottomImage = resLB.url;
            }
            if (req.files.rightImage && req.files.rightImage[0]) {
                const resR = await uploadImage(req.files.rightImage[0].buffer, req.files.rightImage[0].originalname, "e2e-employee-hero");
                rightImage = resR.url;
            }
        }

        const isHeroActive = isActive === "true" || isActive === true;

        if (isHeroActive) {
            await EmployeeHero.updateMany({ isActive: true }, { isActive: false });
        }

        const newHero = new EmployeeHero({
            badgeText,
            titleLine1,
            description,
            leftTopImage,
            leftBottomImage,
            rightImage,
            isActive: isHeroActive
        });

        await newHero.save();

        res.status(201).json({
            success: true,
            message: "Employee Hero created successfully",
            data: newHero
        });

    } catch (error) {
        console.error("Error in createEmployeeHero:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getPublicEmployeeHero = async (req, res) => {
    try {
        const hero = await EmployeeHero.findOne({ isActive: true }).sort({ createdAt: -1 });
        if (!hero) {
            return res.status(404).json({ success: false, message: "Active Employee Hero not found" });
        }
        res.status(200).json({ success: true, message: "Employee Hero fetched successfully", data: hero });
    } catch (error) {
        console.error("Error in getPublicEmployeeHero:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAdminEmployeeHeroes = async (req, res) => {
    try {
        const heroes = await EmployeeHero.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Employee Heroes fetched successfully", data: heroes });
    } catch (error) {
        console.error("Error in getAdminEmployeeHeroes:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateEmployeeHero = async (req, res) => {
    try {
        const { id } = req.params;
        const { badgeText, titleLine1, description, isActive } = req.body;

        const isHeroActive = isActive === "true" || isActive === true;

        if (isHeroActive) {
            await EmployeeHero.updateMany({ _id: { $ne: id }, isActive: true }, { isActive: false });
        }

        const updatedHero = await EmployeeHero.findByIdAndUpdate(
            id,
            { badgeText, titleLine1, description, isActive: isHeroActive },
            { new: true, runValidators: true }
        );

        if (!updatedHero) {
            return res.status(404).json({ success: false, message: "Employee Hero not found" });
        }

        res.status(200).json({ success: true, message: "Employee Hero updated successfully", data: updatedHero });
    } catch (error) {
        console.error("Error in updateEmployeeHero:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteEmployeeHero = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHero = await EmployeeHero.findByIdAndDelete(id);

        if (!deletedHero) {
            return res.status(404).json({ success: false, message: "Employee Hero not found" });
        }

        res.status(200).json({ success: true, message: "Employee Hero deleted successfully", data: deletedHero });
    } catch (error) {
        console.error("Error in deleteEmployeeHero:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateLeftTopImage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-employee-hero");

        const updatedHero = await EmployeeHero.findByIdAndUpdate(
            id,
            { leftTopImage: uploadResponse.url },
            { new: true }
        );

        if (!updatedHero) {
            return res.status(404).json({ success: false, message: "Employee Hero not found" });
        }

        res.status(200).json({ success: true, message: "Left Top Image updated successfully", data: updatedHero });
    } catch (error) {
        console.error("Error in updateLeftTopImage:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateLeftBottomImage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-employee-hero");

        const updatedHero = await EmployeeHero.findByIdAndUpdate(
            id,
            { leftBottomImage: uploadResponse.url },
            { new: true }
        );

        if (!updatedHero) {
            return res.status(404).json({ success: false, message: "Employee Hero not found" });
        }

        res.status(200).json({ success: true, message: "Left Bottom Image updated successfully", data: updatedHero });
    } catch (error) {
        console.error("Error in updateLeftBottomImage:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateRightImage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-employee-hero");

        const updatedHero = await EmployeeHero.findByIdAndUpdate(
            id,
            { rightImage: uploadResponse.url },
            { new: true }
        );

        if (!updatedHero) {
            return res.status(404).json({ success: false, message: "Employee Hero not found" });
        }

        res.status(200).json({ success: true, message: "Right Image updated successfully", data: updatedHero });
    } catch (error) {
        console.error("Error in updateRightImage:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    createEmployeeHero,
    getPublicEmployeeHero,
    getAdminEmployeeHeroes,
    updateEmployeeHero,
    deleteEmployeeHero,
    updateLeftTopImage,
    updateLeftBottomImage,
    updateRightImage
};
