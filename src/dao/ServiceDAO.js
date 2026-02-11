const Service = require('../models/Service');

class ServiceDAO {
  async create(data) {
    const service = new Service(data);
    return await service.save();
  }

  async findById(id) {
    return await Service.findById(id);
  }

  async findByName(name) {
    return await Service.findOne({ name });
  }

  async findAll() {
    return await Service.find({ isActive: true });
  }

  async findAllIncludingInactive() {
    return await Service.find();
  }

  async updateById(id, data) {
    return await Service.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Service.findByIdAndDelete(id);
  }
}

module.exports = new ServiceDAO();
