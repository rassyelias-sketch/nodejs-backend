const serviceRequestDAO = require('../dao/ServiceRequestDAO');
const matchDAO = require('../dao/MatchDAO');
const serviceDAO = require('../dao/ServiceDAO');

class ClientRequestService {
  // Create a service request (client posts a need)
  async createRequest(clientId, requestData) {
    const { serviceId, packageType, latitude, longitude, address, city, radiusKm, requestedDate, durationMinutes, notes } = requestData;

    if (!serviceId || !packageType || !latitude || !longitude || !address || !city || !requestedDate || !durationMinutes) {
      throw { status: 400, message: 'Missing required fields' };
    }

    // Validate service exists
    const service = await serviceDAO.findById(serviceId);
    if (!service) {
      throw { status: 404, message: 'Service not found' };
    }

    const request = await serviceRequestDAO.create({
      clientId,
      serviceId,
      packageType,
      latitude,
      longitude,
      address,
      city,
      radiusKm: radiusKm || 5,
      requestedDate,
      durationMinutes,
      notes: notes || null
    });

    return request;
  }

  // Get my requests
  async getMyRequests(clientId) {
    return await serviceRequestDAO.findByClientId(clientId);
  }

  // Get request details
  async getRequest(requestId) {
    return await serviceRequestDAO.findById(requestId);
  }

  // Update request
  async updateRequest(requestId, clientId, updateData) {
    const request = await serviceRequestDAO.findById(requestId);
    if (!request) {
      throw { status: 404, message: 'Request not found' };
    }
    if (request.clientId.toString() !== clientId) {
      throw { status: 403, message: 'Unauthorized' };
    }
    return await serviceRequestDAO.updateById(requestId, updateData);
  }

  // Cancel request
  async cancelRequest(requestId, clientId) {
    const request = await serviceRequestDAO.findById(requestId);
    if (!request) {
      throw { status: 404, message: 'Request not found' };
    }
    if (request.clientId.toString() !== clientId) {
      throw { status: 403, message: 'Unauthorized' };
    }
    return await serviceRequestDAO.updateById(requestId, { status: 'cancelled' });
  }

  // Get proposed providers for a request
  async getMatches(requestId) {
    return await matchDAO.findByRequestId(requestId);
  }
}

module.exports = new ClientRequestService();
