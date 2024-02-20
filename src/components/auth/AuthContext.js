

import React, { createContext, useState, useEffect } from "react";
import { getUserDetailsFromJwt } from "../../utils";
import AuthService from "../../services/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userDetails: null,
    isAuthenticated: false,
    token: null,
    type: null,
    email: null,
    loading: true,
    error: null, // Added for error handling
  });

  const updateAuthState = ({ userDetails, token, type, email }) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userType", type); // Updated key name for consistency
    setAuthState({
      userDetails,
      isAuthenticated: !!userDetails,
      token,
      type,
      email,
      loading: false,
      error: null, // Reset error state on successful auth update
    });
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    setAuthState({
      userDetails: null,
      isAuthenticated: false,
      token: null,
      type: null,
      email: null,
      loading: false,
      error: null,
    });
  };

  const handleError = (error) => {
    setAuthState((prevState) => ({
      ...prevState,
      error, // Update state with error information
    }));
  };

  useEffect(() => {
    const initializeAuthState = async () => {
      const token = localStorage.getItem("userToken");
      const type = localStorage.getItem("userType");
      if (token) {
        try {
          const userDetails = getUserDetailsFromJwt(token);
          if (userDetails) {
            updateAuthState({
              userDetails,
              token,
              type: type || userDetails.type,
              email: userDetails.email,
            });
          } else {
            logout(); // Use logout function to clear state and storage
          }
        } catch (error) {
          console.error("Error initializing auth state", error);
          handleError(error.message);
        }
      } else {
        setAuthState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    initializeAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, updateAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
