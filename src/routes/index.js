const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// OAuth routes (Google)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/?auth=fail');

    // Issue JWT and set HttpOnly cookie
    try {
      const secret = process.env.JWT_SECRET || 'dev-secret';
      const payload = { id: user._id || user.id, username: user.username };
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });

      // Set cookie (HttpOnly)
      const secure = process.env.NODE_ENV === 'production';
      res.cookie('token', token, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect to UI root (client can check cookie or call /api/users)
      return res.redirect('/');
    } catch (e) {
      return next(e);
    }
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

// ==================== MARKETPLACE ROUTES ====================

const nurseService = require('../services/NurseService');
const clientRequestService = require('../services/ClientRequestService');
const matchingService = require('../services/MatchingService');
const serviceProviderDAO = require('../dao/ServiceProviderDAO');
const serviceDAO = require('../dao/ServiceDAO');

// ===== SERVICES (predefined list) =====
router.get('/services', async (req, res) => {
  try {
    const services = await serviceDAO.findAll();
    return res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== NURSE / SERVICE PROVIDER ENDPOINTS =====
router.post('/nurses', async (req, res) => {
  try {
    const userId = req.body.userId; // In production, extract from auth token
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    const nurse = await nurseService.registerNurse(userId, req.body);
    return res.status(201).json({ success: true,message: 'Nurse registered successfully', nurse });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

router.get('/nurses/:id', async (req, res) => {
  try {
    const nurse = await nurseService.getNurseProfile(req.params.id);
    return res.json({ success: true, nurse });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

router.put('/nurses/:id', async (req, res) => {
  try {
    const userId = req.body.userId; // In production, from auth
    const nurse = await nurseService.updateNurseProfile(userId, req.body);
    return res.json({ success: true, nurse });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Add service offering (nurse registers which services they offer)
router.post('/nurses/:nurseId/services', async (req, res) => {
  try {
    const { serviceId, packageType } = req.body;
    const offering = await nurseService.addServiceOffering(req.params.nurseId, serviceId, packageType);
    return res.status(201).json({ success: true, offering });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Get nurse's services
router.get('/nurses/:nurseId/services', async (req, res) => {
  try {
    const services = await nurseService.getNurseServices(req.params.nurseId);
    return res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add availability
router.post('/nurses/:nurseId/availability', async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;
    const avail = await nurseService.addAvailability(req.params.nurseId, dayOfWeek, startTime, endTime);
    return res.status(201).json({ success: true, availability: avail });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Get availability
router.get('/nurses/:nurseId/availability', async (req, res) => {
  try {
    const availability = await nurseService.getAvailability(req.params.nurseId);
    return res.json({ success: true, availability });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add location
router.post('/nurses/:nurseId/location', async (req, res) => {
  try {
    const location = await nurseService.addLocation(req.params.nurseId, req.body);
    return res.status(201).json({ success: true, location });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Get location
router.get('/nurses/:nurseId/location', async (req, res) => {
  try {
    const locations = await nurseService.getLocation(req.params.nurseId);
    return res.json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CLIENT SERVICE REQUESTS =====
router.post('/requests', async (req, res) => {
  try {
    const clientId = req.body.clientId; // In production, from auth token
    if (!clientId) return res.status(400).json({ error: 'clientId required' });
    
    const request = await clientRequestService.createRequest(clientId, req.body);
    return res.status(201).json({ success: true, message: 'Request created, matching providers...', request });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

router.get('/requests/:clientId', async (req, res) => {
  try {
    const requests = await clientRequestService.getMyRequests(req.params.clientId);
    return res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/requests/:requestId/matches', async (req, res) => {
  try {
    const matches = await matchingService.findMatches(req.params.requestId);
    return res.json({ success: true, count: matches.length, matches });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// ===== SEARCH / BROWSE =====
router.get('/search', async (req, res) => {
  try {
    const { serviceId, packageType, latitude, longitude, radiusKm } = req.query;
    const results = await matchingService.searchProviders({
      serviceId,
      packageType,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      radiusKm: radiusKm ? parseInt(radiusKm) : 10
    });
    return res.json({ success: true, count: results.length, results });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// ===== MATCHING =====
router.post('/matches/:matchId/accept', async (req, res) => {
  try {
    const clientId = req.body.clientId; // In production, from auth
    const match = await matchingService.acceptMatch(req.params.matchId, clientId);
    return res.json({ success: true, message: 'Match accepted! Provider will contact you soon.', match });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

router.post('/matches/:matchId/reject', async (req, res) => {
  try {
    const clientId = req.body.clientId; // In production, from auth
    const match = await matchingService.rejectMatch(req.params.matchId, clientId);
    return res.json({ success: true, message: 'Match rejected', match });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

module.exports = router;
