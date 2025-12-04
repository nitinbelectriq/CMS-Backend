const Tariff = require('../models/tariff.model.js');

// ✅ Create
exports.create = async (req, res) => {
  try {
    await Tariff.create(req.body);
    res.status(200).json({ status: true, message: 'Tariff created successfully' });
  } catch (error) {
    console.error('❌ Error creating tariff:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Get All (role-based)
exports.getAll = async (req, res) => {
  try {
    const user_id = req.params.login_id;
    const data = await Tariff.getAll(user_id);
    res.status(200).json({ status: true, data });
  } catch (error) {
    console.error('❌ Error fetching tariffs:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Get By ID
exports.getById = async (req, res) => {
  try {
    const data = await Tariff.getById(req.params.id);
    if (!data || data.length === 0) {
      return res.status(404).json({ status: false, message: 'Tariff not found' });
    }
    res.status(200).json({ status: true, data });
  } catch (error) {
    console.error('❌ Error fetching tariff by ID:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Update
exports.update = async (req, res) => {
  try {
    await Tariff.update(req.params.id, req.body);
    res.status(200).json({ status: true, message: 'Tariff updated successfully' });
  } catch (error) {
    console.error('❌ Error updating tariff:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Delete (soft)
exports.delete = async (req, res) => {
  try {
    await Tariff.delete(req.params.id);
    res.status(200).json({ status: true, message: 'Tariff deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting tariff:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};  // ✅ <--- Properly close this function!

// ✅ Create Mapping
exports.createMapping = async (req, res) => {
  try {
    await Tariff.createMapping(req.body);
    res.status(200).json({ status: true, message: 'Tariff mapped to station successfully' });
  } catch (error) {
    console.error('❌ Error creating mapping:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Get Mapping List
exports.getMappingList = async (req, res) => {
  try {
    const login_id = req.query.login_id;
    const data = await Tariff.getMappingList(login_id);
    res.status(200).json({ status: true, data });
  } catch (error) {
    console.error('❌ Error fetching mapping list:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Get Mapping By ID
exports.getMappingById = async (req, res) => {
  try {
    const data = await Tariff.getMappingById(req.params.id);
    res.status(200).json({ status: true, data });
  } catch (error) {
    console.error('❌ Error fetching mapping by ID:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};exports.updateMapping = async (req, res) => {
  try {
    await Tariff.updateMapping(req.params.id, req.body);
    res.status(200).json({ status: true, message: "Mapping updated successfully" });
  } catch (error) {
    console.error("❌ Error updating mapping:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


// ✅ Delete Mapping
exports.deleteMapping = async (req, res) => {
  try {
    await Tariff.deleteMapping(req.params.id);
    res.status(200).json({ status: true, message: 'Mapping deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting mapping:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Get Stations For Tariff Mapping
exports.getStationsForTariffMapping = async (req, res) => {
  try {
    const login_id = req.params.login_id;
    const result = await Tariff.getStationsForTariffMapping(login_id);
    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching stations:', error);
    res.status(500).json({ status: false, message: 'SERVER_ERROR', data: [] });
  }
};
