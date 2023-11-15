// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getUserDetailsFromJwt } from '../../utils';
import AuthService from '../../services/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userDetails: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const refreshAuthState = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && refreshToken) {
        try {
          const userDetails = getUserDetailsFromJwt(token);
          if (userDetails) {
            setAuthState({ userDetails, isAuthenticated: true });
          } else {
            const refreshed = await AuthService.refreshToken({ refreshToken });
            if (refreshed.accessToken) {
              localStorage.setItem('token', refreshed.accessToken);
              const newDetails = getUserDetailsFromJwt(refreshed.accessToken);
              setAuthState({ userDetails: newDetails, isAuthenticated: true });
            }
          }
        } catch (error) {
          console.error('Failed to refresh auth state', error);
          setAuthState({ userDetails: null, isAuthenticated: false });
          // Redirect to login or handle accordingly
        }
      }
    };

    refreshAuthState();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};
