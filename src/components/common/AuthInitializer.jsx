"use client";
import { useEffect } from 'react';
import { checkAndValidateAuth } from '@/utils/authCheck';
import useAuthStore from '@/store/authStore';

const AuthInitializer = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check and validate auth state on component mount
    const isValid = checkAndValidateAuth();
    
    if (!isValid && isAuthenticated) {
      // If validation failed but state shows authenticated, clear everything
      console.warn("Invalid auth state detected, clearing...");
      const { logout } = useAuthStore.getState();
      logout();
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default AuthInitializer; 