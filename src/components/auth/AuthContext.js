import React, { createContext, useState, useEffect } from "react";
import { getUserDetailsFromJwt } from "../../utils";
import AuthService from "../../services/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userDetails: null,
    isAuthenticated: false,
    token: null,
    role: null,
    email: null,
    loading: true,
  });

  const updateAuthState = ({ userDetails, token, role, email }) => {
    localStorage.setItem("userToken", token); // Consistently use "userToken"
    localStorage.setItem("userType", role); // Consistently use "userRole"
    setAuthState({
      userDetails,
      isAuthenticated: !!userDetails,
      token,
      role,
      email,
      loading: false,
    });
  };

  useEffect(() => {
    const initializeAuthState = async () => {
      const token = localStorage.getItem("userToken");
      const role = localStorage.getItem("userType");
      if (token) {
        try {
          const userDetails = getUserDetailsFromJwt(token);
          if (userDetails) {
            setAuthState((prevState) => ({
              ...prevState,
              userDetails,
              isAuthenticated: true,
              token,
              role,
              email: userDetails.email,
              loading: false, // Set loading to false as auth state is initialized
            }));
          } else {
            // If userDetails couldn't be extracted, consider the token invalid/expired
            localStorage.removeItem("userToken");
            localStorage.removeItem("userType"); // Clear stored role if token is invalid/expired
            setAuthState((prevState) => ({
              ...prevState,
              userDetails: null,
              isAuthenticated: false,
              token: null,
              role: null,
              email: null,
              loading: false,
            }));
          }
        } catch (error) {
          console.error("Error initializing auth state", error);
          localStorage.removeItem("userToken");
          localStorage.removeItem("userRole");
          setAuthState((prevState) => ({
            ...prevState,
            userDetails: null,
            isAuthenticated: false,
            token: null,
            role: null,
            email: null,
            loading: false,
          }));
        }
      } else {
        setAuthState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    initializeAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
