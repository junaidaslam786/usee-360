import React, { useEffect, useContext, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify"; // Ensure react-toastify is installed
import {
  getUserDetailsFromJwt,
  setLoginToken,
  setUserType,
  checkAgentDetails,
} from "../../utils";

const OAuthCallback = () => {
  const location = useLocation();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const userType = queryParams.get("userType");

    if (!token || !userType) {
      toast.error("Authentication error. Missing code or state.");
      history.push("/login");
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
              : `/${agentDetails.agentType}/dashboard`;
          history.push(redirectPath);
        })();
      } else if (userType === "customer") {
        history.push("customer/dashboard");
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
