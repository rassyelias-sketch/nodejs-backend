const ServiceProviderService = require('../models/ServiceProviderService');

class ServiceProviderServiceDAO {
  async create(data) {
    const sps = new ServiceProviderService(data);
    return await sps.save();
  }

  async findById(id) {
    return await ServiceProviderService.findById(id)
      .populate('serviceProviderId', 'firstName lastName averageRating')
      .populate('serviceId', 'name');
  }

  async findByServiceProviderId(serviceProviderId) {
    return await ServiceProviderService.find({ serviceProviderId, isAvailable: true })
      .populate('serviceId', 'name');
  }

  async findByServiceProviderAndService(serviceProviderId, serviceId) {
    return await ServiceProviderService.findOne({ serviceProviderId, serviceId });
  }

  async findByServiceProviderAndServiceAndPackage(serviceProviderId, serviceId, packageType) {
    return await ServiceProviderService.findOne({ serviceProviderId, serviceId, packageType });
  }

  async findByService(serviceId) {
    return await ServiceProviderService.find({ serviceId, isAvailable: true })
      .populate('serviceProviderId', 'firstName lastName averageRating');
  }

  async updateById(id, data) {
    return await ServiceProviderService.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await ServiceProviderService.findByIdAndDelete(id);
  }
}

module.exports = new ServiceProviderServiceDAO();
