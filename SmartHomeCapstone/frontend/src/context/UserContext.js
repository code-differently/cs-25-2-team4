import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUserSync } from '../hooks/useUserSync';
import { setAuthToken as setRoomAuthToken } from '../services/roomService';
import { setAuthToken as setDeviceAuthToken } from '../services/deviceService';
import { setAuthToken as setUserAuthToken } from '../services/userService';
import { setAuthToken as setHomeAuthToken } from '../hooks/useHomes';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const { getToken } = useAuth();
  const { user, backendUser, isLoading, error, updateBackendUser, isAuthenticated } = useUserSync();

  // Set auth tokens when user is authenticated
  useEffect(() => {
    const setupAuthTokens = async () => {
      if (isAuthenticated && getToken) {
        try {
          const token = await getToken();
          setRoomAuthToken(token);
          setDeviceAuthToken(token);
          setUserAuthToken(token);
          setHomeAuthToken(token);
        } catch (error) {
          console.error('Error setting auth tokens:', error);
        }
      } else {
        // Clear tokens when not authenticated
        setRoomAuthToken(null);
        setDeviceAuthToken(null);
        setUserAuthToken(null);
        setHomeAuthToken(null);
      }
    };

    setupAuthTokens();
  }, [isAuthenticated, getToken]);

  const value = {
    user, // Clerk user
    backendUser, // Our backend user
    isLoading,
    error,
    updateBackendUser,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;