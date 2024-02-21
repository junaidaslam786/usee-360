import React, { useEffect, useContext, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify"; // Ensure react-toastify is installed
import {
  getUserDetailsFromJwt, getUserDetailsFromJwt2,
} from "../../utils";

const FacebookAuthCallback = () => {
  const { updateAuthState } = useContext(AuthContext);
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

    const fetchAuthDetails = async () => {
      try {
        // Assuming getUserDetailsFromJwt correctly parses the JWT and returns user details
        const userDetails = await getUserDetailsFromJwt2(token);

        if (userDetails) {
          updateAuthState({
            userDetails,
            token,
            isAuthenticated: true,
            type: userType,
            email: userDetails.email,
          });

          // Redirect users based on their type
          const redirectPath =
            userType === "agent" ? "/agent/register-social" : "/customer/dashboard";
          history.push(redirectPath);
        } else {
          // Handle case where user details could not be fetched
          toast.error("Failed to fetch user details.");
          history.push("/login");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
        history.push("/login");
      }
    };

    fetchAuthDetails();
  }, [location.search, history, updateAuthState]);

  return (
    <div>
      {isLoading ? "Loading..." : "Authentication failed. Redirecting..."}
    </div>
  );
};

export default FacebookAuthCallback;
