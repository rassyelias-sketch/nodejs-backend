const serviceProviderDAO = require('../dao/ServiceProviderDAO');
const serviceProviderServiceDAO = require('../dao/ServiceProviderServiceDAO');
const availabilityDAO = require('../dao/AvailabilityDAO');
const locationDAO = require('../dao/LocationDAO');
const userDAO = require('../dao/UserDAO');

class NurseService {
  // Register as a service provider
  async registerNurse(userId, nurseData) {
    const { firstName, lastName, licenseNumber, yearsOfExperience, agencyId, bio, phoneNumber } = nurseData;

    // Validate required fields
    if (!firstName || !lastName || !licenseNumber) {
      throw { status: 400, message: 'firstName, lastName, and licenseNumber are required' };
    }

    // Check if already registered
    const existing = await serviceProviderDAO.findByUserId(userId);
    if (existing) {
      throw { status: 409, message: 'You are already registered as a service provider' };
    }

    // Check if license already used
    const licenseExists = await serviceProviderDAO.findByLicenseNumber(licenseNumber);
    if (licenseExists) {
      throw { status: 409, message: 'License number already registered' };
    }

    // Update user role
    await userDAO.updateById(userId, { role: 'nurse', phoneNumber: phoneNumber || undefined });

    // Create service provider profile
    const nurse = await serviceProviderDAO.create({
      userId,
      firstName,
      lastName,
      licenseNumber,
      yearsOfExperience: yearsOfExperience || 0,
      agencyId: agencyId || null,
      bio: bio || null
    });

    return nurse.toJSON ? nurse.toJSON() : nurse;
  }

  // Get nurse profile
  async getNurseProfile(nurseId) {
    const nurse = await serviceProviderDAO.findById(nurseId);
    if (!nurse) {
      throw { status: 404, message: 'Nurse profile not found' };
    }
    return nurse.toJSON ? nurse.toJSON() : nurse;
  }

  // Update nurse profile
  async updateNurseProfile(userId, updateData) {
    const nurse = await serviceProviderDAO.findByUserId(userId);
    if (!nurse) {
      throw { status: 404, message: 'Nurse profile not found' };
    }

    const updated = await serviceProviderDAO.updateById(nurse._id, updateData);
    return updated.toJSON ? updated.toJSON() : updated;
  }

  // Add service offerings
  async addServiceOffering(nurseId, serviceId, packageType) {
    const offering = await serviceProviderServiceDAO.create({
      serviceProviderId: nurseId,
      serviceId,
      packageType
    });
    return offering;
  }

  // Get nurse services
  async getNurseServices(nurseId) {
    return await serviceProviderServiceDAO.findByServiceProviderId(nurseId);
  }

  // Add availability
  async addAvailability(nurseId, dayOfWeek, startTime, endTime) {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw { status: 400, message: 'dayOfWeek must be 0-6' };
    }
    return await availabilityDAO.create({
      serviceProviderId: nurseId,
      dayOfWeek,
      startTime,
      endTime
    });
  }

  // Get availability
  async getAvailability(nurseId) {
    return await availabilityDAO.findByServiceProviderId(nurseId);
  }

  // Add location
  async addLocation(nurseId, locationData) {
    const { latitude, longitude, address, city, isHomeService } = locationData;
    if (!latitude || !longitude || !address || !city) {
      throw { status: 400, message: 'latitude, longitude, address, city are required' };
    }
    return await locationDAO.create({
      serviceProviderId: nurseId,
      latitude,
      longitude,
      address,
      city,
      isHomeService: isHomeService !== false
    });
  }

  // Get location
  async getLocation(nurseId) {
    return await locationDAO.findByServiceProviderId(nurseId);
  }
}

module.exports = new NurseService();
