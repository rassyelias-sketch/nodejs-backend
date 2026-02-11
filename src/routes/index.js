const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');
const passport = require('passport');

// OAuth routes (Google)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/?auth=fail');

    // Successful auth - here we can redirect to the UI with a token or return JSON
    // For simplicity, redirect to the UI root with a simple token param
    const token = 'google-oauth-token-' + Date.now();
    return res.redirect(`/?token=${token}`);
  })(req, res, next);
});

// Example route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the API',
    version: '1.0.0'
  });
});

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// IMPORTANT: Specific routes MUST come BEFORE generic /:id routes

// Search users by name endpoint (MUST be before /:id route)
router.get('/users/search', async (req, res) => {
  try {
    const { name } = req.query;
    const users = await userService.searchUsers(name);

    return res.json({ 
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || error });
  }
});

// List all users endpoint
router.get('/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    return res.json({ 
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID endpoint
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    return res.json({ 
      success: true,
      user
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Delete user by ID endpoint
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUserById(id);

    return res.json({ 
      success: true,
      message: 'User deleted successfully',
      user
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const result = await userService.login(req.body);

    return res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const user = await userService.signup(req.body);

    return res.status(201).json({ 
      success: true,
      message: 'User created successfully',
      user
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

module.exports = router;
