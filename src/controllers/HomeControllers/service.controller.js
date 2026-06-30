const Service = require("../../model/Home models/Service.model");
const uploadImage = require("../../services/storage.services");


// GET /api/services
const getActiveServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({ success: true, message: "Services fetched successfully", data: services });
    } catch (error) {
        console.error("Error in getActiveServices:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/admin/services — returns ALL services (including inactive) for admin
const getAllServicesAdmin = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.status(200).json({ success: true, message: "All services fetched successfully", data: services });
    } catch (error) {
        console.error("Error in getAllServicesAdmin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/admin/services
const createService = async (req, res) => {
  try {
    const { title, shortDescription, order, isActive } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    let imageUrl = "";

    if (req.file) {
      const uploadResponse = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        "e2e-services"
      );

      imageUrl = uploadResponse.url;
    }

    const newService = await Service.create({
      title,
      shortDescription,
      image: imageUrl,
      order: order || 0,
      isActive: isActive ?? true
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// PUT /api/admin/services/:id
const updateService = async (req, res) => {
    try {
        const { title, shortDescription,image, order, isActive } = req.body;

        const updateData = { title, shortDescription, image, order, isActive };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);


        const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!updatedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.status(200).json({ success: true, message: "Service updated successfully", data: updatedService });
    } catch (error) {
        console.error("Error in updateService:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/admin/services/:id
const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);

        if (!deletedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.status(200).json({ success: true, message: "Service deleted successfully", data: null });
    } catch (error) {
        console.error("Error in deleteService:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/admin/services/:id/image
const uploadServiceImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, "e2e-services");

        if (!uploadResponse || !uploadResponse.url) {
            return res.status(500).json({ success: false, message: "Failed to upload image to ImageKit" });
        }

        service.image = uploadResponse.url;
        await service.save();

        res.status(200).json({ success: true, message: "Service image uploaded successfully", data: service });
    } catch (error) {
        console.error("Error in uploadServiceImage:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getActiveServices,
    getAllServicesAdmin,
    createService,
    updateService,
    deleteService,
    uploadServiceImage
};
