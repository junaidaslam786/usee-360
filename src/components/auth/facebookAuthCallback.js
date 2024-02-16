import React, { useEffect, useContext, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify"; // Ensure react-toastify is installed
import { httpGet } from "../../rest-api";

const FacebookAuthCallback = () => {
  const { updateAuthState } = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthDetails = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code || !state) {
        toast.error("Authentication error. Missing code or state.");
        history.push("/login");
        return;
      }

      try {
        const backendURL = `${process.env.REACT_APP_API_URL}/auth/facebook/callback?code=${code}&state=${state}`;
        const response = await httpGet(backendURL);
        const { user, token, refreshToken } = response.data;

        updateAuthState(user, token, refreshToken);
        toast.success("Logged in successfully!");

        const redirectPath =
          user.userType === "agent"
            ? "/agent/dashboard"
            : "/customer/dashboard";
        history.push(redirectPath);
      } catch (error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
        history.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthDetails();
  }, [location, history, updateAuthState]);

  return (
    <div>
      {isLoading ? "Loading..." : "Authentication failed. Redirecting..."}
    </div>
  );
};

export default FacebookAuthCallback;
