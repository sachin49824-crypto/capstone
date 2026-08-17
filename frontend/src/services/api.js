const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}: Request failed`);
  }

  // Handle empty responses (like 204 No Content or void DELETE responses)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  // Dashboard
  getSummary: () => request('/dashboard/summary'),

  // Vehicles
  getVehicles: (params = {}) => {
    const query = new URLSearchParams();
    if (params.driverId) query.set('driverId', params.driverId);
    if (params.status) query.set('status', params.status);
    const queryString = query.toString();
    return request(`/vehicles${queryString ? `?${queryString}` : ''}`);
  },

  getVehicle: (id) => request(`/vehicles/${id}`),

  createVehicle: (data) => request('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateVehicle: (id, data) => request(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteVehicle: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),

  // Drivers
  getDrivers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    const queryString = query.toString();
    return request(`/drivers${queryString ? `?${queryString}` : ''}`);
  },

  getDriver: (id) => request(`/drivers/${id}`),

  createDriver: (data) => request('/drivers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateDriver: (id, data) => request(`/drivers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteDriver: (id) => request(`/drivers/${id}`, { method: 'DELETE' }),

  // Trips
  getTrips: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    const queryString = query.toString();
    return request(`/trips${queryString ? `?${queryString}` : ''}`);
  },

  createTrip: (data) => request('/trips', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  endTrip: (id, endLocation) => request(`/trips/${id}/end`, {
    method: 'PUT',
    body: JSON.stringify({ end_location: endLocation })
  }),

  // Telemetry & Locations
  getLocations: (params = {}) => {
    const query = new URLSearchParams();
    if (params.vehicleId) query.set('vehicleId', params.vehicleId);
    if (params.tripId) query.set('tripId', params.tripId);
    const queryString = query.toString();
    return request(`/locations${queryString ? `?${queryString}` : ''}`);
  },

  createLocation: (data) => request('/locations', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Maintenance
  getMaintenance: (params = {}) => {
    const query = new URLSearchParams();
    if (params.vehicleId) query.set('vehicleId', params.vehicleId);
    const queryString = query.toString();
    return request(`/maintenance${queryString ? `?${queryString}` : ''}`);
  },

  createMaintenance: (data) => request('/maintenance', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Fuel Logs
  getFuel: (params = {}) => {
    const query = new URLSearchParams();
    if (params.vehicleId) query.set('vehicleId', params.vehicleId);
    const queryString = query.toString();
    return request(`/fuel${queryString ? `?${queryString}` : ''}`);
  },

  createFuel: (data) => request('/fuel', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};
