import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token for requests
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

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
          message = 'User not found.';
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

// User API service
export const userService = {
  // Sync user from Clerk to backend
  syncUser: async (clerkUser) => {
    try {
      // Create full name from available Clerk data
      let fullName = '';
      
      if (clerkUser.fullName) {
        fullName = clerkUser.fullName.trim();
      } else if (clerkUser.firstName || clerkUser.lastName) {
        const firstName = clerkUser.firstName || '';
        const lastName = clerkUser.lastName || '';
        fullName = `${firstName} ${lastName}`.trim();
      } else {
        // Fallback to generating a name from email or ID
        const email = clerkUser.emailAddresses[0]?.emailAddress || '';
        const emailName = email.split('@')[0];
        fullName = emailName || `User ${clerkUser.id.slice(-4)}`;
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      const username = clerkUser.username || email.split('@')[0] || `user_${clerkUser.id.slice(-8)}`;

      const userData = {
        clerkId: clerkUser.id,
        username: username,
        fullName: fullName,
        email: email,
      };

      console.log('Syncing user data:', userData); // Debug log

      const response = await apiClient.post('', userData);
      return response.data;
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  },

  // Get user by clerkId
  getUserByClerkId: async (clerkId) => {
    try {
      const response = await apiClient.get(`/${clerkId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (clerkId, userData) => {
    try {
      const response = await apiClient.put(`/${clerkId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

export default userService;