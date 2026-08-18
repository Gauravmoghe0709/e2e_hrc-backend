const mongoose = require('mongoose');
const Location = require('../../model/becomePartner/Location');

const DEFAULT_HEAD_OFFICE_STATS = [
  { value: '18+', label: 'Years Exp' },
  { value: '450+', label: 'Clients' },
  { value: '12k+', label: 'Placements' },
  { value: '4', label: 'Regional Hubs' },
];

const DEFAULT_REGIONAL_STATS = [
  { value: '', label: 'Candidates' },
  { value: '', label: 'Clients' },
  { value: '', label: 'Partners' },
  { value: '', label: 'Industries' },
];

const DEFAULT_HEAD_OFFICE = {
  officeName: 'UK Head Office',
  title: 'UK Head Office',
  address: [
    'Unit 2, 1204B Stratford Road, Hall Green,',
    'Birmingham, B28 8AS, UK',
  ],
  phone: '+44 (0) 121 778 2400',
  email: 'info@e2ehrc.co.uk',
  hours: 'Mon to Fri: 9AM to 6PM',
  aboutText: 'Our UK head office is located in Birmingham, easily accessible by road and public transport. Our team is available to assist you with all your recruitment needs.',
  directionsQuery: 'Unit 2, 1204B Stratford Road, Hall Green, Birmingham, B28 8AS, UK',
  stats: DEFAULT_HEAD_OFFICE_STATS,
  type: 'headOffice',
  displayOrder: null,
  isActive: true,
};

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return true;
};

const normalizeDisplayOrder = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 3) {
    return null;
  }
  return parsed;
};

const normalizeAddress = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split('\n').map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeStatsArray = (value, type = 'regional') => {
  const source = Array.isArray(value) ? value : [];
  const fallback = type === 'headOffice' ? DEFAULT_HEAD_OFFICE_STATS : DEFAULT_REGIONAL_STATS;

  const normalized = source.slice(0, 4).map((entry) => ({
    value: String(entry?.value ?? '').trim() || '—',
    label: String(entry?.label ?? '').trim() || '—',
  }));

  while (normalized.length < 4) {
    normalized.push({ value: '—', label: '—' });
  }

  return normalized.map((entry, index) => ({
    value: entry.value || fallback[index]?.value || '—',
    label: entry.label || fallback[index]?.label || '—',
  })).slice(0, 4);
};

const ensureStatsBackfill = async (record) => {
  const item = record && record.toObject ? record.toObject() : record || {};
  const type = item.type === 'headOffice' ? 'headOffice' : 'regional';
  const defaultStats = type === 'headOffice' ? DEFAULT_HEAD_OFFICE_STATS : DEFAULT_REGIONAL_STATS;
  const existingStats = Array.isArray(item.stats) ? item.stats : [];

  if (existingStats.length === 4 && existingStats.every((stat) => String(stat?.value ?? '').trim() && String(stat?.label ?? '').trim())) {
    return item;
  }

  const nextStats = normalizeStatsArray(existingStats.length ? existingStats : defaultStats, type);
  const updated = await Location.findByIdAndUpdate(
    item._id,
    { $set: { stats: nextStats } },
    { new: true, runValidators: true }
  );

  return updated ? (updated.toObject ? updated.toObject() : updated) : { ...item, stats: nextStats };
};

const normalizeLocationPayload = (record = {}) => {
  const isHeadOffice = record.type === 'headOffice' || (record.officeName || record.title) === 'UK Head Office';
  const type = isHeadOffice ? 'headOffice' : 'regional';
  const officeName = record.officeName || record.title || (isHeadOffice ? 'UK Head Office' : 'Regional Office');
  const normalizedAddress = normalizeAddress(record.address);
  const fallbackStats = type === 'headOffice' ? DEFAULT_HEAD_OFFICE_STATS : DEFAULT_REGIONAL_STATS;
  const statsArray = normalizeStatsArray(
    Array.isArray(record.stats) && record.stats.length
      ? record.stats
      : (record.statValue || record.statLabel
        ? [{ value: record.statValue || '—', label: record.statLabel || '—' }]
        : []),
    type
  );

  return {
    ...record,
    officeName,
    title: officeName,
    type,
    address: normalizedAddress.length ? normalizedAddress : normalizeAddress(record.address || []),
    phone: record.phone || '',
    email: record.email || '',
    hours: record.hours || record.openingHours || '',
    openingHours: record.hours || record.openingHours || '',
    aboutText: record.aboutText || record.aboutDescription || '',
    aboutDescription: record.aboutText || record.aboutDescription || '',
    directionsQuery: record.directionsQuery || (typeof record.address === 'string' ? record.address : officeName),
    stats: statsArray.length ? statsArray : fallbackStats,
    displayOrder: type === 'headOffice' ? null : normalizeDisplayOrder(record.displayOrder),
    isActive: record.isActive !== undefined ? normalizeBoolean(record.isActive) : true,
  };
};

const sortLocations = (records = []) =>
  [...records].sort((a, b) => {
    const typeOrder = (a.type === 'headOffice' ? 0 : 1) - (b.type === 'headOffice' ? 0 : 1);
    if (typeOrder !== 0) return typeOrder;

    const orderA = Number(a.displayOrder ?? 999);
    const orderB = Number(b.displayOrder ?? 999);
    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  });

const ensureDefaultHeadOffice = async () => {
  const existingHeadOffice = await Location.findOne({ type: 'headOffice' }).lean();
  if (existingHeadOffice) return normalizeLocationPayload(existingHeadOffice);

  const created = await Location.create({
    ...DEFAULT_HEAD_OFFICE,
    officeName: 'UK Head Office',
    title: 'UK Head Office',
    type: 'headOffice',
    address: DEFAULT_HEAD_OFFICE.address,
    isActive: true,
  });

  return normalizeLocationPayload(created.toObject ? created.toObject() : created);
};

const reindexRegionalOrders = async (changedId = null, desiredOrder = null) => {
  const records = await Location.find({ type: 'regional', isActive: true }).sort({ displayOrder: 1, createdAt: 1 }).lean();

  if (!records.length) return;

  const targetRecord = changedId ? records.find((item) => item._id.toString() === changedId.toString()) : null;
  const remainingRecords = records.filter((item) => !changedId || item._id.toString() !== changedId.toString());

  const orderedOthers = [...remainingRecords].sort((a, b) => {
    const orderA = Number(a.displayOrder ?? 999);
    const orderB = Number(b.displayOrder ?? 999);
    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  });

  const reorderedList = [...orderedOthers];

  if (targetRecord && desiredOrder !== null && desiredOrder !== undefined) {
    const requestedOrder = Math.min(Math.max(1, Number(desiredOrder)), orderedOthers.length + 1);
    reorderedList.splice(requestedOrder - 1, 0, {
      ...targetRecord,
      displayOrder: requestedOrder,
    });
  }

  for (let index = 0; index < reorderedList.length; index += 1) {
    const record = reorderedList[index];
    await Location.findByIdAndUpdate(record._id, { displayOrder: index + 1 }, { new: true });
  }
};

const getAllLocations = async (req, res) => {
  try {
    await ensureDefaultHeadOffice();
    const records = await Location.find().lean();
    const normalizedRecords = await Promise.all(
      records.map(async (record) => {
        const backfilled = await ensureStatsBackfill(record);
        return normalizeLocationPayload(backfilled);
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Locations fetched successfully.',
      data: sortLocations(normalizedRecords),
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID.',
      });
    }

    const record = await Location.findById(id).lean();

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Location fetched successfully.',
      data: normalizeLocationPayload(record),
    });
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const getActiveLocations = async (req, res) => {
  try {
    await ensureDefaultHeadOffice();
    const records = await Location.find({ isActive: true }).lean();
    const normalizedRecords = await Promise.all(
      records.map(async (record) => {
        const backfilled = await ensureStatsBackfill(record);
        return normalizeLocationPayload(backfilled);
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Locations fetched successfully.',
      data: sortLocations(normalizedRecords),
    });
  } catch (error) {
    console.error('Error fetching active locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const createLocation = async (req, res) => {
  try {
    await ensureDefaultHeadOffice();
    const payload = normalizeLocationPayload(req.body);
    const {
      officeName,
      address,
      phone,
      email,
      hours,
      aboutText,
      directionsQuery,
      stats,
      type,
      displayOrder,
      isActive,
    } = payload;

    if (!officeName || !officeName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Office name is required.',
      });
    }

    if (!address || !address.length) {
      return res.status(400).json({
        success: false,
        message: 'Address is required.',
      });
    }

    if (type === 'headOffice') {
      const existingHeadOffice = await Location.findOne({ type: 'headOffice' });
      if (existingHeadOffice) {
        return res.status(400).json({
          success: false,
          message: 'Only one head office is allowed.',
        });
      }
    }

    if (type === 'regional') {
      const activeRegionalCount = await Location.countDocuments({ type: 'regional', isActive: true });
      if (activeRegionalCount >= 3) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 3 regional offices allowed.',
        });
      }

      const validDisplayOrder = normalizeDisplayOrder(displayOrder ?? 1);
      if (validDisplayOrder === null) {
        return res.status(400).json({
          success: false,
          message: 'Display order is required and must be a number between 1 and 3.',
        });
      }

      payload.displayOrder = validDisplayOrder;
    }

    const normalizedStats = normalizeStatsArray(stats, type);
    if (!Array.isArray(stats) || stats.length !== 4 || normalizedStats.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Exactly 4 statistics are required.',
      });
    }

    for (const stat of normalizedStats) {
      if (!String(stat.value ?? '').trim() || !String(stat.label ?? '').trim()) {
        return res.status(400).json({
          success: false,
          message: 'Exactly 4 statistics are required.',
        });
      }
    }

    payload.stats = normalizedStats;

    const created = await Location.create({
      officeName: officeName.trim(),
      title: officeName.trim(),
      address,
      phone: phone ? phone.trim() : '',
      email: email ? email.trim() : '',
      hours: hours ? hours.trim() : '',
      openingHours: hours ? hours.trim() : '',
      aboutText: aboutText ? aboutText.trim() : '',
      aboutTitle: aboutText ? aboutText.trim() : '',
      aboutDescription: aboutText ? aboutText.trim() : '',
      directionsQuery: directionsQuery ? directionsQuery.trim() : officeName.trim(),
      stats: payload.stats,
      type,
      displayOrder: type === 'headOffice' ? null : payload.displayOrder,
      isActive: isActive !== undefined ? normalizeBoolean(isActive) : true,
    });

    if (type === 'regional') {
      await reindexRegionalOrders(created._id.toString(), payload.displayOrder);
    }

    return res.status(201).json({
      success: true,
      message: 'Location created successfully.',
      data: normalizeLocationPayload(created.toObject ? created.toObject() : created),
    });
  } catch (error) {
    console.error('Error creating location:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID.',
      });
    }

    const existingRecord = await Location.findById(id);
    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    const payload = normalizeLocationPayload({
      ...existingRecord.toObject(),
      ...req.body,
    });

    const updateData = {};
    const officeName = payload.officeName || payload.title;
    const address = payload.address;
    const type = existingRecord.type === 'headOffice' || payload.type === 'headOffice' ? 'headOffice' : 'regional';

    if (officeName !== undefined) {
      if (!officeName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Office name is required.',
        });
      }
      updateData.officeName = officeName.trim();
      updateData.title = officeName.trim();
    }

    if (address !== undefined) {
      if (!Array.isArray(address) || address.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Address is required.',
        });
      }
      updateData.address = address;
    }

    if (payload.phone !== undefined) updateData.phone = payload.phone ? payload.phone.trim() : '';
    if (payload.email !== undefined) updateData.email = payload.email ? payload.email.trim() : '';
    if (payload.hours !== undefined) {
      updateData.hours = payload.hours ? payload.hours.trim() : '';
      updateData.openingHours = payload.hours ? payload.hours.trim() : '';
    }
    if (payload.aboutText !== undefined) {
      updateData.aboutText = payload.aboutText ? payload.aboutText.trim() : '';
      updateData.aboutTitle = payload.aboutText ? payload.aboutText.trim() : '';
      updateData.aboutDescription = payload.aboutText ? payload.aboutText.trim() : '';
    }
    if (payload.directionsQuery !== undefined) updateData.directionsQuery = payload.directionsQuery ? payload.directionsQuery.trim() : '';

    if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'stats')) {
      const incomingStats = normalizeStatsArray(req.body.stats, type);
      if (!Array.isArray(req.body.stats) || req.body.stats.length !== 4 || incomingStats.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'Exactly 4 statistics are required.',
        });
      }
      for (const stat of incomingStats) {
        if (!String(stat.value ?? '').trim() || !String(stat.label ?? '').trim()) {
          return res.status(400).json({
            success: false,
            message: 'Exactly 4 statistics are required.',
          });
        }
      }
      updateData.stats = incomingStats;
    }

    if (type === 'headOffice') {
      updateData.type = 'headOffice';
      updateData.displayOrder = null;
    } else {
      updateData.type = 'regional';
      const validDisplayOrder = normalizeDisplayOrder(payload.displayOrder ?? existingRecord.displayOrder ?? 1);
      if (validDisplayOrder === null) {
        return res.status(400).json({
          success: false,
          message: 'Display order is required and must be a number between 1 and 3.',
        });
      }
      updateData.displayOrder = validDisplayOrder;
    }

    if (payload.isActive !== undefined) updateData.isActive = normalizeBoolean(payload.isActive);

    const updated = await Location.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    if (type === 'regional') {
      await reindexRegionalOrders(id.toString(), updateData.displayOrder);
    }

    return res.status(200).json({
      success: true,
      message: 'Location updated successfully.',
      data: normalizeLocationPayload(updated.toObject ? updated.toObject() : updated),
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID.',
      });
    }

    const deleted = await Location.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Location deleted successfully.',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  getActiveLocations,
};
