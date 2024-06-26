import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify"; // Ensure react-toastify is installed
import {
  getUserDetailsFromJwt,
  setLoginToken,
  setUserType,
  checkAgentDetails,
} from "../../utils";
import ProfileService from "../../services/profile";

const OAuthCallback = () => {
  const location = useLocation();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const userType = queryParams.get("userType");
    const error = queryParams.get("error");

    if (error) {
      toast.error(error);
      const redirectPath = userType === 'agent' ? '/agent/login' : '/customer/login';
      history.push(redirectPath);
      return;
    }

    if (!token || !userType) {
      toast.error("Authentication error. Missing code or state.");
      const redirectPath = userType === 'agent' ? '/agent/login' : '/customer/login';
      history.push(redirectPath);
      return;
    }

    const userDetails = getUserDetailsFromJwt(token);
    console.log("user details from token", userDetails);

    if (userDetails) {
      setLoginToken(token);
      setUserType(userType);

      if (userType === "agent") {
        // User is an agent
        (async () => {
          // Use an async IIFE to await isAgent
          const agentDetails = await checkAgentDetails();
          console.log("agentDetails", agentDetails);
          // Determine redirectPath based on agentDetails
          const redirectPath =
            agentDetails &&
            agentDetails?.user?.signupStep === -1 &&
            agentDetails?.user?.active === false
              ? "/agent/register-social"
              : '/agent/dashboard';
          history.push(redirectPath);
        })();
      } else if (userType === "customer") {
         // User is a customer
         (async () => {
          const profile = await ProfileService.getProfile();
          if (profile && profile.signupStep === -1) {
            history.push("/customer/onboarding");
          } else if (profile && profile.signupStep === 2) {
            history.push("/customer/dashboard");
          } else {
            toast.error("Unexpected user state, redirecting to login.");
            history.push("/customer/login");
          }
        })();
      }
    } else {
      toast.error("Failed to fetch user details.");
      history.push("/login");
    }
  }, [location.search, history]);

  return (
    <div>
      {isLoading ? "Loading..." : "Authentication failed. Redirecting..."}
    </div>
  );
};

export default OAuthCallback;
