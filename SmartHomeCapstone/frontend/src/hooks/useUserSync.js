import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userService } from '../services/userService';

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const [backendUser, setBackendUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    const syncUserToBackend = async () => {
      if (!user) {
        setBackendUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Clerk user data:', user); // Debug log

        // Try to get existing user from backend
        let existingUser;
        try {
          existingUser = await userService.getUserByClerkId(user.id);
        } catch (err) {
          // User doesn't exist in backend, create them
          if (err.message.includes('User not found')) {
            console.log('User not found in backend, creating new user...');
            existingUser = await userService.syncUser(user);
          } else {
            throw err;
          }
        }

        setBackendUser(existingUser);
      } catch (err) {
        console.error('Error syncing user:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    syncUserToBackend();
  }, [user, isLoaded]);

  const updateBackendUser = async (userData) => {
    if (!user || !backendUser) return;

    try {
      const updatedUser = await userService.updateUser(user.id, userData);
      setBackendUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    user, // Clerk user
    backendUser, // Our backend user
    isLoading,
    error,
    updateBackendUser,
    isAuthenticated: !!user,
  };
}

export default useUserSync;