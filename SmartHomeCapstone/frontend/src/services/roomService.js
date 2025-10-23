import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/rooms`,
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
          message = 'Room not found.';
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

// Room API service
export const roomService = {
  // GET requests

  // Get all rooms for a home
  getRoomsByHome: async (homeId) => {
    try {
      const response = await apiClient.get('', {
        params: { homeId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  // Get room by ID
  getRoomById: async (roomId) => {
    try {
      const response = await apiClient.get(`/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room by ID:', error);
      throw error;
    }
  },

  // POST requests

  // Create a new room
  createRoom: async (roomData) => {
    try {
      const response = await apiClient.post('', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // PUT requests

  // Update room
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await apiClient.put(`/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  // DELETE requests

  // Delete room
  deleteRoom: async (roomId) => {
    try {
      await apiClient.delete(`/${roomId}`);
      return true;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },
};

export default roomService;