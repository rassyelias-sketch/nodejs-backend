const User = require('../models/User');

class UserDAO {
  // Create a new user
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  // Find user by ID
  async findById(id) {
    return await User.findById(id);
  }

  // Find user by username
  async findByUsername(username) {
    return await User.findOne({ username });
  }

  // Find user by email
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  // Find user by Google ID
  async findByGoogleId(googleId) {
    return await User.findOne({ googleId });
  }

  // Find all users
  async findAll() {
    return await User.find();
  }

  // Search users by username or email
  async search(name) {
    return await User.find({
      $or: [
        { username: { $regex: name, $options: 'i' } },
        { email: { $regex: name, $options: 'i' } }
      ]
    });
  }

  // Delete user by ID
  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  // Update user by ID
  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new UserDAO();
