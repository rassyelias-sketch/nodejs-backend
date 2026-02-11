const Location = require('../models/Location');

class LocationDAO {
  async create(data) {
    const location = new Location(data);
    return await location.save();
  }

  async findById(id) {
    return await Location.findById(id);
  }

  async findByServiceProviderId(serviceProviderId) {
    return await Location.find({ serviceProviderId }).sort({ isPrimary: -1 });
  }

  async findPrimaryLocation(serviceProviderId) {
    return await Location.findOne({ serviceProviderId, isPrimary: true });
  }

  async updateById(id, data) {
    return await Location.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Location.findByIdAndDelete(id);
  }
}

module.exports = new LocationDAO();
