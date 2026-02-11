const Availability = require('../models/Availability');

class AvailabilityDAO {
  async create(data) {
    const avail = new Availability(data);
    return await avail.save();
  }

  async findById(id) {
    return await Availability.findById(id);
  }

  async findByServiceProviderId(serviceProviderId) {
    return await Availability.find({ serviceProviderId, isAvailable: true }).sort({ dayOfWeek: 1 });
  }

  async findByServiceProviderAndDay(serviceProviderId, dayOfWeek) {
    return await Availability.find({ serviceProviderId, dayOfWeek, isAvailable: true });
  }

  async updateById(id, data) {
    return await Availability.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Availability.findByIdAndDelete(id);
  }
}

module.exports = new AvailabilityDAO();
