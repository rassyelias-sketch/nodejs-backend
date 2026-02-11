const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userService = require('../services/UserService');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth credentials not set. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable Google Sign-In.');
}

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await userService.findOrCreateFromGoogle(profile);
    // Return user object (plain JS object from service)
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
