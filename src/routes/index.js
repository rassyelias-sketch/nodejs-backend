const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');

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
