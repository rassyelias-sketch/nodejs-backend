const ServiceRequest = require('../models/ServiceRequest');

class ServiceRequestDAO {
  async create(data) {
    const request = new ServiceRequest(data);
    return await request.save();
  }

  async findById(id) {
    return await ServiceRequest.findById(id)
      .populate('clientId', 'username email phoneNumber')
      .populate('serviceId', 'name');
  }

  async findByClientId(clientId) {
    return await ServiceRequest.find({ clientId })
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 });
  }

  async findByStatus(status) {
    return await ServiceRequest.find({ status }).sort({ createdAt: -1 });
  }

  async findAllOpen() {
    return await ServiceRequest.find({ status: 'open' }).populate('serviceId', 'name');
  }

  async updateById(id, data) {
    return await ServiceRequest.findByIdAndUpdate(id, { ...data, updatedAt: Date.now() }, { new: true });
  }

  async deleteById(id) {
    return await ServiceRequest.findByIdAndDelete(id);
  }
}

module.exports = new ServiceRequestDAO();
