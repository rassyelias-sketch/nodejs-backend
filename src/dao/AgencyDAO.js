const Agency = require('../models/Agency');

class AgencyDAO {
  async create(data) {
    const agency = new Agency(data);
    return await agency.save();
  }

  async findById(id) {
    return await Agency.findById(id).populate('registeredBy', 'username email');
  }

  async findByLicenseNumber(licenseNumber) {
    return await Agency.findOne({ licenseNumber });
  }

  async findAll() {
    return await Agency.find({ isActive: true });
  }

  async findAllVerified() {
    return await Agency.find({ isActive: true, isVerified: true });
  }

  async updateById(id, data) {
    return await Agency.findByIdAndUpdate(id, { ...data, updatedAt: Date.now() }, { new: true });
  }

  async deleteById(id) {
    return await Agency.findByIdAndDelete(id);
  }

  async findByRegisteredBy(userId) {
    return await Agency.find({ registeredBy: userId });
  }
}

module.exports = new AgencyDAO();
