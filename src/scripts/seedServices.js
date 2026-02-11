// This script seeds initial data (services) into the database
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db/connection');
const Service = require('./models/Service');

const seedServices = async () => {
  try {
    await connectDB();
    
    // Check if "Home Care" already exists
    const existing = await Service.findOne({ name: 'Home Care' });
    if (existing) {
      console.log('✓ Home Care service already exists');
      process.exit(0);
    }

    // Create Home Care service
    const homeCare = await Service.create({
      name: 'Home Care',
      description: 'Professional in-home nursing care including daily passages, multiple daily visits, half-day stays, and full-day stays with patients.',
      icon: '🏥'
    });

    console.log('✓ Home Care service created:', homeCare);
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding services:', error);
    process.exit(1);
  }
};

seedServices();
