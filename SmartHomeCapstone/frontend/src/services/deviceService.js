import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/devices`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      let message = 'An error occurred';

      switch (status) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 404:
          message = 'Device not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = `Server error (${status}). Please try again.`;
      }

      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
);

// Device API service
export const deviceService = {
  // GET requests

  // Get all devices
  getAllDevices: async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching all devices:', error);
      throw error;
    }
  },

  // Get devices by room ID
  getDevicesByRoom: async (roomId) => {
    try {
      const response = await apiClient.get(`/?roomId=${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching devices by room:', error);
      throw error;
    }
  },

  // Get devices by home ID
  getDevicesByHome: async (homeId) => {
    try {
      const response = await apiClient.get(`/?homeId=${homeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching devices by home:', error);
      throw error;
    }
  },

  // Search devices by name
  searchDevices: async (searchTerm) => {
    try {
      const response = await apiClient.get(`/?search=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching devices:', error);
      throw error;
    }
  },

  // Get device by ID
  getDeviceById: async (deviceId) => {
    try {
      const response = await apiClient.get(`/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching device by ID:', error);
      throw error;
    }
  },

  // POST requests

  // Create a new device
  createDevice: async (deviceData) => {
    try {
      const response = await apiClient.post('/', deviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  },

  // Turn device on
  turnDeviceOn: async (deviceId) => {
    try {
      const response = await apiClient.post(`/${deviceId}/on`);
      return response.data;
    } catch (error) {
      console.error('Error turning device on:', error);
      throw error;
    }
  },

  // Turn device off
  turnDeviceOff: async (deviceId) => {
    try {
      const response = await apiClient.post(`/${deviceId}/off`);
      return response.data;
    } catch (error) {
      console.error('Error turning device off:', error);
      throw error;
    }
  },

  // PUT requests

  // Control device (generic control method)
  controlDevice: async (deviceId, controlData) => {
    try {
      const response = await apiClient.put(`/${deviceId}/control`, controlData);
      return response.data;
    } catch (error) {
      console.error('Error controlling device:', error);
      throw error;
    }
  },

  // DELETE requests

  // Delete device
  deleteDevice: async (deviceId) => {
    try {
      await apiClient.delete(`/${deviceId}`);
      return true;
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  },
};

export default deviceService;
