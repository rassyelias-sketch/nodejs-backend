const Booking = require('../models/Booking');

class BookingDAO {
  async create(data) {
    const booking = new Booking(data);
    return await booking.save();
  }

  async findById(id) {
    return await Booking.findById(id)
      .populate('clientId', 'username email phoneNumber')
      .populate('serviceProviderId', 'firstName lastName')
      .populate('serviceId', 'name');
  }

  async findByClientId(clientId) {
    return await Booking.find({ clientId })
      .populate('serviceProviderId', 'firstName lastName')
      .populate('serviceId', 'name')
      .sort({ scheduledDate: -1 });
  }

  async findByServiceProviderId(serviceProviderId) {
    return await Booking.find({ serviceProviderId })
      .populate('clientId', 'username email phoneNumber')
      .populate('serviceId', 'name')
      .sort({ scheduledDate: -1 });
  }

  async findByStatus(status) {
    return await Booking.find({ status }).sort({ scheduledDate: -1 });
  }

  async updateById(id, data) {
    return await Booking.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Booking.findByIdAndDelete(id);
  }
}

module.exports = new BookingDAO();
