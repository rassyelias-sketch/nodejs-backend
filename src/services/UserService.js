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

  // Find or create user from Google profile
  async findOrCreateFromGoogle(profile) {
    const googleId = profile.id;
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    const avatar = profile.photos && profile.photos[0] && profile.photos[0].value;

    // Check existing by googleId
    let user = await userDAO.findByGoogleId(googleId);
    if (user) return user.toJSON();

    // If user exists by email, link googleId
    if (email) {
      const existing = await userDAO.findByEmail(email);
      if (existing) {
        const updated = await userDAO.updateById(existing._id, { googleId, avatar });
        return updated.toJSON();
      }
    }

    // Create unique username base from displayName or email
    let baseUsername = (profile.username || (profile.displayName || '').replace(/\s+/g, '_') || (email ? email.split('@')[0] : 'user')).toLowerCase();
    baseUsername = baseUsername.replace(/[^a-z0-9_\-\.]/g, '');

    let username = baseUsername;
    let counter = 1;
    while (await userDAO.findByUsername(username)) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Create user without password
    const newUser = await userDAO.create({
      username,
      email: email || undefined,
      googleId,
      avatar
    });

    return newUser.toJSON();
  }
}

module.exports = new UserService();
