const ServiceProvider = require('../models/ServiceProvider');

class ServiceProviderDAO {
  async create(data) {
    const provider = new ServiceProvider(data);
    return await provider.save();
  }

  async findById(id) {
    return await ServiceProvider.findById(id)
      .populate('userId', 'username email phoneNumber')
      .populate('agencyId', 'name');
  }

  async findByUserId(userId) {
    return await ServiceProvider.findOne({ userId });
  }

  async findByLicenseNumber(licenseNumber) {
    return await ServiceProvider.findOne({ licenseNumber });
  }

  async findAll() {
    return await ServiceProvider.find({ isActive: true, isVerified: true });
  }

  async findAllUnverified() {
    return await ServiceProvider.find({ isVerified: false });
  }

  async findByAgency(agencyId) {
    return await ServiceProvider.find({ agencyId, isActive: true });
  }

  async updateById(id, data) {
    return await ServiceProvider.findByIdAndUpdate(id, { ...data, updatedAt: Date.now() }, { new: true });
  }

  async deleteById(id) {
    return await ServiceProvider.findByIdAndDelete(id);
  }
}

module.exports = new ServiceProviderDAO();
