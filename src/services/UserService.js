const userDAO = require('../dao/UserDAO');

class UserService {
  // Signup user
  async signup(signupData) {
    const { username, email, password, confirmPassword } = signupData;

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      throw { status: 400, message: 'All fields are required' };
    }

    // Check if username already exists
    const existingUser = await userDAO.findByUsername(username);
    if (existingUser) {
      throw { status: 409, message: 'Username already exists' };
    }

    // Check if email already exists
    const existingEmail = await userDAO.findByEmail(email);
    if (existingEmail) {
      throw { status: 409, message: 'Email already registered' };
    }

    // Validate password match
    if (password !== confirmPassword) {
      throw { status: 400, message: 'Passwords do not match' };
    }

    // Validate password strength
    if (password.length < 6) {
      throw { status: 400, message: 'Password must be at least 6 characters long' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { status: 400, message: 'Invalid email format' };
    }

    // Create new user
    const newUser = await userDAO.create({
      username,
      email,
      password
    });

    return newUser.toJSON();
  }

  // Login user
  async login(loginData) {
    const { username, password } = loginData;

    // Validate input
    if (!username || !password) {
      throw { status: 400, message: 'Username and password are required' };
    }

    // Find user by username
    const user = await userDAO.findByUsername(username);

    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      throw { status: 401, message: 'Invalid username or password' };
    }

    return {
      success: true,
      message: 'Login successful',
      token: 'fake-jwt-token-' + Date.now(),
      user: user.toJSON()
    };
  }

  // Get user by ID
  async getUserById(id) {
    const user = await userDAO.findById(id);

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user.toJSON();
  }

  // Get all users
  async getAllUsers() {
    const users = await userDAO.findAll();
    return users.map(user => user.toJSON());
  }

  // Search users by name
  async searchUsers(name) {
    if (!name) {
      throw { status: 400, message: 'Search name parameter is required' };
    }

    return await userDAO.search(name).then(users => 
      users.map(user => user.toJSON())
    );
  }

  // Delete user by ID
  async deleteUserById(id) {
    const user = await userDAO.deleteById(id);

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user.toJSON();
  }
}

module.exports = new UserService();
