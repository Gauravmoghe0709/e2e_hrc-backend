const EmployeeJourneyCard = require("../../model/Employee models/EmployeeJourneyCard.model");
const mongoose = require("mongoose");

// POST /admin/employee-journey-cards
exports.createEmployeeJourneyCard = async (req, res) => {
  try {
    let { title, order, isActive } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    
    title = title.trim();

    let orderNum = 0;
    if (order !== undefined && order !== "") {
      orderNum = Number(order);
      if (isNaN(orderNum) || orderNum < 0) {
        return res.status(400).json({ success: false, message: "Invalid order value" });
      }
    }

    let activeStatus = true;
    if (isActive !== undefined) {
      activeStatus = isActive === "true" || isActive === true;
    }

    const newCard = await EmployeeJourneyCard.create({
      title,
      order: orderNum,
      isActive: activeStatus,
    });

    res.status(201).json({ success: true, message: "Card created successfully", data: newCard });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// GET /admin/employee-journey-cards
exports.getAdminEmployeeJourneyCards = async (req, res) => {
  try {
    const cards = await EmployeeJourneyCard.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// PUT /admin/employee-journey-cards/:id
exports.updateEmployeeJourneyCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Card ID" });
    }

    let { title, order, isActive } = req.body;
    let updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
         return res.status(400).json({ success: false, message: "Title cannot be empty" });
      }
      updateData.title = title.trim();
    }
    
    if (order !== undefined && order !== "") {
      const orderNum = Number(order);
      if (isNaN(orderNum) || orderNum < 0) {
        return res.status(400).json({ success: false, message: "Invalid order value" });
      }
      updateData.order = orderNum;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive === "true" || isActive === true;
    }

    const updatedCard = await EmployeeJourneyCard.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: "after" }
    );

    if (!updatedCard) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    res.status(200).json({ success: true, message: "Card updated successfully", data: updatedCard });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// DELETE /admin/employee-journey-cards/:id
exports.deleteEmployeeJourneyCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Card ID" });
    }

    const deletedCard = await EmployeeJourneyCard.findByIdAndDelete(id);
    if (!deletedCard) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    res.status(200).json({ success: true, message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
