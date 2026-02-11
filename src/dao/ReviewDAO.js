const Review = require('../models/Review');

class ReviewDAO {
  async create(data) {
    const review = new Review(data);
    return await review.save();
  }

  async findById(id) {
    return await Review.findById(id)
      .populate('bookingId')
      .populate('clientId', 'username')
      .populate('serviceProviderId', 'firstName lastName');
  }

  async findByBookingId(bookingId) {
    return await Review.findOne({ bookingId });
  }

  async findByServiceProviderId(serviceProviderId) {
    return await Review.find({ serviceProviderId })
      .populate('clientId', 'username')
      .sort({ createdAt: -1 });
  }

  async findByClientId(clientId) {
    return await Review.find({ clientId }).sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    return await Review.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Review.findByIdAndDelete(id);
  }
}

module.exports = new ReviewDAO();
