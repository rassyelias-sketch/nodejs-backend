const Match = require('../models/Match');

class MatchDAO {
  async create(data) {
    const match = new Match(data);
    return await match.save();
  }

  async findById(id) {
    return await Match.findById(id)
      .populate('requestId')
      .populate('serviceProviderId', 'firstName lastName averageRating');
  }

  async findByRequestId(requestId) {
    return await Match.find({ requestId })
      .populate('serviceProviderId', 'firstName lastName averageRating avatar')
      .sort({ matchedAt: -1 });
  }

  async findByServiceProviderId(serviceProviderId) {
    return await Match.find({ serviceProviderId })
      .populate('requestId')
      .sort({ matchedAt: -1 });
  }

  async findByStatus(status) {
    return await Match.find({ status }).sort({ matchedAt: -1 });
  }

  async updateById(id, data) {
    return await Match.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Match.findByIdAndDelete(id);
  }
}

module.exports = new MatchDAO();
