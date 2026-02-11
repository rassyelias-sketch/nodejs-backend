const serviceRequestDAO = require('../dao/ServiceRequestDAO');
const serviceProviderServiceDAO = require('../dao/ServiceProviderServiceDAO');
const locationDAO = require('../dao/LocationDAO');
const matchDAO = require('../dao/MatchDAO');

class MatchingService {
  // Calculate distance between two lat/lon points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Find matching service providers for a request
  async findMatches(requestId) {
    const request = await serviceRequestDAO.findById(requestId);
    if (!request) {
      throw { status: 404, message: 'Request not found' };
    }

    // Get all providers offering this service + package
    const offerings = await serviceProviderServiceDAO.findByService(request.serviceId);

    const matches = [];
    for (const offering of offerings) {
      // Check if provider offers this package type
      if (offering.packageType !== request.packageType) {
        continue;
      }

      // Get provider's location
      const location = await locationDAO.findPrimaryLocation(offering.serviceProviderId._id);
      if (!location) continue;

      // Calculate distance
      const distance = this.calculateDistance(
        request.latitude,
        request.longitude,
        location.latitude,
        location.longitude
      );

      // Check if within radius
      if (distance > request.radiusKm) {
        continue;
      }

      // TODO: Check availability (for now, skip time validation)

      // Create match
      const match = await matchDAO.create({
        requestId,
        serviceProviderId: offering.serviceProviderId._id,
        distanceKm: distance,
        status: 'proposed'
      });

      matches.push(match);
    }

    // Update request status if matches found
    if (matches.length > 0) {
      await serviceRequestDAO.updateById(requestId, { status: 'matched' });
    }

    return matches;
  }

  // Accept a match (client chooses this provider)
  async acceptMatch(matchId, clientId) {
    const match = await matchDAO.findById(matchId);
    if (!match) {
      throw { status: 404, message: 'Match not found' };
    }

    // Verify client owns the request
    if (match.requestId.clientId.toString() !== clientId) {
      throw { status: 403, message: 'Unauthorized' };
    }

    // Update match
    await matchDAO.updateById(matchId, { status: 'accepted', respondedAt: Date.now() });

    // Update request
    await serviceRequestDAO.updateById(match.requestId._id, { status: 'accepted' });

    return match;
  }

  // Reject a match
  async rejectMatch(matchId, clientId) {
    const match = await matchDAO.findById(matchId);
    if (!match) {
      throw { status: 404, message: 'Match not found' };
    }

    // Verify client owns the request
    if (match.requestId.clientId.toString() !== clientId) {
      throw { status: 403, message: 'Unauthorized' };
    }

    await matchDAO.updateById(matchId, { status: 'rejected', respondedAt: Date.now() });
    return match;
  }

  // Search providers (public endpoint for clients to browse)
  async searchProviders(filters) {
    const { serviceId, packageType, latitude, longitude, radiusKm } = filters;

    if (!serviceId) {
      throw { status: 400, message: 'serviceId is required' };
    }

    // Get providers offering this service
    const offerings = await serviceProviderServiceDAO.findByService(serviceId);
    const results = [];

    for (const offering of offerings) {
      if (packageType && offering.packageType !== packageType) {
        continue;
      }

      // If lat/lon provided, filter by distance
      if (latitude && longitude) {
        const location = await locationDAO.findPrimaryLocation(offering.serviceProviderId._id);
        if (!location) continue;

        const distance = this.calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );

        if (distance > (radiusKm || 10)) {
          continue;
        }

        results.push({
          ...offering.toObject(),
          distanceKm: distance,
          location
        });
      } else {
        results.push({
          ...offering.toObject(),
          location: await locationDAO.findPrimaryLocation(offering.serviceProviderId._id)
        });
      }
    }

    return results;
  }
}

module.exports = new MatchingService();
