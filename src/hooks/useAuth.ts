import { useState, useCallback } from 'react';
import { storage } from '../lib/utils';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    storage.set('isLoggedIn', true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    storage.remove('isLoggedIn');
  }, []);

  // Initialize auth state from localStorage
  useState(() => {
    const savedAuthState = storage.get('isLoggedIn', false);
    setIsLoggedIn(savedAuthState);
  });

  return {
    isLoggedIn,
    login,
    logout,
  };
};
