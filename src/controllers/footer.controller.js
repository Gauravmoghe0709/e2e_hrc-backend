const FooterCompanyInfo = require('../model/Footer models/FooterCompanyInfo.model');
const FooterContact = require('../model/Footer models/FooterContact.model');
const FooterNavigation = require('../model/Footer models/FooterNavigation.model');
const FooterOfficeLocation = require('../model/Footer models/FooterOfficeLocation.model');
const uploadImage = require('../services/storage.services');

// Frontend GETs
const getFooterCompanyInfo = async (req, res) => {
  try {
    const activeCompanyInfo = await FooterCompanyInfo.findOne({ isActive: true });
    return res.status(200).json({ success: true, message: 'Footer company info fetched successfully', data: activeCompanyInfo });
  } catch (error) {
    console.error('Error in getFooterCompanyInfo:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getFooterContact = async (req, res) => {
  try {
    const activeContact = await FooterContact.findOne({ isActive: true });
    return res.status(200).json({ success: true, message: 'Footer contact fetched successfully', data: activeContact });
  } catch (error) {
    console.error('Error in getFooterContact:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getFooterNavigation = async (req, res) => {
  try {
    const activeNavigation = await FooterNavigation.findOne({ isActive: true });
    if (!activeNavigation) {
      return res.status(200).json({ success: true, message: 'Footer navigation fetched successfully', data: null });
    }

    const filteredMenuItems = (activeNavigation.menuItems || [])
      .filter((item) => item.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const navigationData = {
      ...activeNavigation.toObject(),
      menuItems: filteredMenuItems,
    };

    return res.status(200).json({ success: true, message: 'Footer navigation fetched successfully', data: navigationData });
  } catch (error) {
    console.error('Error in getFooterNavigation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getFooterOfficeLocation = async (req, res) => {
  try {
    const activeOfficeLocation = await FooterOfficeLocation.findOne({ isActive: true });
    return res.status(200).json({ success: true, message: 'Footer office location fetched successfully', data: activeOfficeLocation });
  } catch (error) {
    console.error('Error in getFooterOfficeLocation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin controllers
const createFooterCompanyInfo = async (req, res) => {
  try {
    const { description, isActive } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Logo image is required' });
    }
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-footer');
    const newCompanyInfo = await FooterCompanyInfo.create({
      logo: uploadResponse.url,
      description,
      isActive: isActive ?? true,
    });

    return res.status(201).json({ success: true, message: 'Footer company info created successfully', data: newCompanyInfo });
  } catch (error) {
    console.error('Error in createFooterCompanyInfo:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getFooterCompanyInfosAdmin = async (req, res) => {
  try {
    const companyInfos = await FooterCompanyInfo.find();
    return res.status(200).json({ success: true, message: 'Footer company info list fetched successfully', data: companyInfos });
  } catch (error) {
    console.error('Error in getFooterCompanyInfosAdmin:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateFooterCompanyInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, isActive } = req.body;
    const updateData = { description, isActive };

    if (req.file) {
      const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-footer');
      updateData.logo = uploadResponse.url;
    }

    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    const updatedCompanyInfo = await FooterCompanyInfo.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
    if (!updatedCompanyInfo) {
      return res.status(404).json({ success: false, message: 'Footer company info not found' });
    }

    return res.status(200).json({ success: true, message: 'Footer company info updated successfully', data: updatedCompanyInfo });
  } catch (error) {
    console.error('Error in updateFooterCompanyInfo:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteFooterCompanyInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCompanyInfo = await FooterCompanyInfo.findByIdAndDelete(id);
    if (!deletedCompanyInfo) {
      return res.status(404).json({ success: false, message: 'Footer company info not found' });
    }
    return res.status(200).json({ success: true, message: 'Footer company info deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFooterCompanyInfo:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createFooterContact = async (req, res) => {
  try {
    const { sectionTitle, address, phone, email, isActive } = req.body;
    if (!sectionTitle || !address || !phone || !email) {
      return res.status(400).json({ success: false, message: 'sectionTitle, address, phone, and email are required' });
    }

    const newContact = await FooterContact.create({
      sectionTitle,
      address,
      phone,
      email,
      isActive: isActive ?? true,
    });

    return res.status(201).json({ success: true, message: 'Footer contact created successfully', data: newContact });
  } catch (error) {
    console.error('Error in createFooterContact:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getFooterContactsAdmin = async (req, res) => {
  try {
    const contacts = await FooterContact.find();
    return res.status(200).json({ success: true, message: 'Footer contacts fetched successfully', data: contacts });
  } catch (error) {
    console.error('Error in getFooterContactsAdmin:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateFooterContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionTitle, address, phone, email, isActive } = req.body;
    const updateData = { sectionTitle, address, phone, email, isActive };

    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    const updatedContact = await FooterContact.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
    if (!updatedContact) {
      return res.status(404).json({ success: false, message: 'Footer contact not found' });
    }

    return res.status(200).json({ success: true, message: 'Footer contact updated successfully', data: updatedContact });
  } catch (error) {
    console.error('Error in updateFooterContact:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteFooterContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await FooterContact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ success: false, message: 'Footer contact not found' });
    }
    return res.status(200).json({ success: true, message: 'Footer contact deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFooterContact:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createFooterNavigation = async (req, res) => {
  try {
    const { title, menuItems, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    let parsedMenuItems = [];
    if (menuItems) {
      parsedMenuItems = typeof menuItems === 'string' ? JSON.parse(menuItems) : menuItems;
    }

    const newNavigation = await FooterNavigation.create({
      title,
      menuItems: parsedMenuItems,
      isActive: isActive ?? true,
    });

    return res.status(201).json({ success: true, message: 'Footer navigation created successfully', data: newNavigation });
  } catch (error) {
    console.error('Error in createFooterNavigation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getFooterNavigationsAdmin = async (req, res) => {
  try {
    const navigations = await FooterNavigation.find();
    return res.status(200).json({ success: true, message: 'Footer navigation list fetched successfully', data: navigations });
  } catch (error) {
    console.error('Error in getFooterNavigationsAdmin:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateFooterNavigation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, menuItems, isActive } = req.body;
    let parsedMenuItems = undefined;

    if (menuItems !== undefined) {
      parsedMenuItems = typeof menuItems === 'string' ? JSON.parse(menuItems) : menuItems;
    }

    const updateData = { title, isActive };
    if (parsedMenuItems !== undefined) updateData.menuItems = parsedMenuItems;
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    const updatedNavigation = await FooterNavigation.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
    if (!updatedNavigation) {
      return res.status(404).json({ success: false, message: 'Footer navigation not found' });
    }

    return res.status(200).json({ success: true, message: 'Footer navigation updated successfully', data: updatedNavigation });
  } catch (error) {
    console.error('Error in updateFooterNavigation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteFooterNavigation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNavigation = await FooterNavigation.findByIdAndDelete(id);
    if (!deletedNavigation) {
      return res.status(404).json({ success: false, message: 'Footer navigation not found' });
    }
    return res.status(200).json({ success: true, message: 'Footer navigation deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFooterNavigation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createFooterOfficeLocation = async (req, res) => {
  try {
    const { title, isActive } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-footer');
    const newOfficeLocation = await FooterOfficeLocation.create({
      title,
      image: uploadResponse.url,
      isActive: isActive ?? true,
    });

    return res.status(201).json({ success: true, message: 'Footer office location created successfully', data: newOfficeLocation });
  } catch (error) {
    console.error('Error in createFooterOfficeLocation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getFooterOfficeLocationsAdmin = async (req, res) => {
  try {
    const officeLocations = await FooterOfficeLocation.find();
    return res.status(200).json({ success: true, message: 'Footer office locations fetched successfully', data: officeLocations });
  } catch (error) {
    console.error('Error in getFooterOfficeLocationsAdmin:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateFooterOfficeLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isActive } = req.body;
    const updateData = { title, isActive };

    if (req.file) {
      const uploadResponse = await uploadImage(req.file.buffer, req.file.originalname, 'e2e-footer');
      updateData.image = uploadResponse.url;
    }

    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    const updatedOfficeLocation = await FooterOfficeLocation.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
    if (!updatedOfficeLocation) {
      return res.status(404).json({ success: false, message: 'Footer office location not found' });
    }

    return res.status(200).json({ success: true, message: 'Footer office location updated successfully', data: updatedOfficeLocation });
  } catch (error) {
    console.error('Error in updateFooterOfficeLocation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteFooterOfficeLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOfficeLocation = await FooterOfficeLocation.findByIdAndDelete(id);
    if (!deletedOfficeLocation) {
      return res.status(404).json({ success: false, message: 'Footer office location not found' });
    }
    return res.status(200).json({ success: true, message: 'Footer office location deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFooterOfficeLocation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getFooterCompanyInfo,
  getFooterContact,
  getFooterNavigation,
  getFooterOfficeLocation,
  createFooterCompanyInfo,
  getFooterCompanyInfosAdmin,
  updateFooterCompanyInfo,
  deleteFooterCompanyInfo,
  createFooterContact,
  getFooterContactsAdmin,
  updateFooterContact,
  deleteFooterContact,
  createFooterNavigation,
  getFooterNavigationsAdmin,
  updateFooterNavigation,
  deleteFooterNavigation,
  createFooterOfficeLocation,
  getFooterOfficeLocationsAdmin,
  updateFooterOfficeLocation,
  deleteFooterOfficeLocation,
};
