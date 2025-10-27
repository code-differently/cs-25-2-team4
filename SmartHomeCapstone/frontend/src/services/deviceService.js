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

// Device API service for fetching all devices
export const deviceService = {
  // Get all devices
  getAllDevices: async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching all devices:', error);
      throw new Error('Failed to fetch devices. Please try again.');
    }
  },
};

export default deviceService;
