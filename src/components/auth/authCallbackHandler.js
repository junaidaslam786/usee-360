import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Adjust the import path as necessary
import AuthService from "../../services/auth"; 
import { getUserDetailsFromJwt } from "../../utils";
// import { co } from "@fullcalendar/core/internal-common";

const OAuthCallbackHandler = () => {
    const { setAuthState } = useContext(AuthContext);
    const history = useHistory();
  
    useEffect(() => {
      const fetchUserDetailsAndUpdateState = async () => {
        try {
          // Assuming AuthService includes a method to fetch current user details
          const userDetails = await AuthService.getCurrentUserDetails();
          console.log('userDetails', userDetails);
          if (userDetails.error) {
            throw new Error(userDetails.message || "Failed to fetch user details.");
          }
  
          // Update AuthContext with fetched user details
          setAuthState({ userDetails, isAuthenticated: true });
  
          // Redirect user based on their role or to a default authenticated route
          const redirectPath = userDetails.role === "agent" ? "/register-social" : "/dashboard";
          history.push(redirectPath);
        } catch (error) {
          console.error("Error fetching user details:", error);
          history.push("/login"); // Redirect to login on error
        }
      };
  
      fetchUserDetailsAndUpdateState();
    }, [history, setAuthState]);
  
    return <div>Loading...</div>;
  };
  

export default OAuthCallbackHandler;
