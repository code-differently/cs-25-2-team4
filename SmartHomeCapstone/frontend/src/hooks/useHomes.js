import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/homes`,
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
      const status = error.response.status;
      let message = 'An error occurred';
      switch (status) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 404:
          message = 'Home not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = `Server error (${status}). Please try again.`;
      }
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
);

// Home API service
export const homeService = {
  // Get homes for a user
  getHomesByClerkId: async (clerkId) => {
    try {
      const response = await apiClient.get('', {
        params: { clerkId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching homes for user:', error);
      throw error;
    }
  },

  // Create a new home
  createHome: async (homeData) => {
    try {
      const response = await apiClient.post('', homeData);
      return response.data;
    } catch (error) {
      console.error('Error creating home:', error);
      throw error;
    }
  },

  // Get home by ID
  getHomeById: async (homeId) => {
    try {
      const response = await apiClient.get(`/${homeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching home by ID:', error);
      throw error;
    }
  },
};

export const useHomes = (clerkId) => {
  const [homes, setHomes] = useState([]);
  const [currentHome, setCurrentHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomes = useCallback(async () => {
    if (!clerkId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const userHomes = await homeService.getHomesByClerkId(clerkId);
      setHomes(userHomes);
      
      if (userHomes.length > 0) {
        setCurrentHome(userHomes[0]); // Set first home as current
      } else {
        setCurrentHome(null); // No homes yet
      }
    } catch (err) {
      console.error('Error in useHomes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clerkId]);

  useEffect(() => {
    fetchHomes();
  }, [fetchHomes]);

  const createHome = async (homeData) => {
    try {
      const newHome = await homeService.createHome(homeData);
      setHomes(prev => [...prev, newHome]);
      return newHome;
    } catch (err) {
      throw err;
    }
  };

  const switchHome = (homeId) => {
    const home = homes.find(h => h.homeId === homeId);
    if (home) {
      setCurrentHome(home);
    }
  };

  return {
    homes,
    currentHome,
    loading,
    error,
    createHome,
    switchHome,
    refreshHomes: fetchHomes,
  };
};

export default useHomes;