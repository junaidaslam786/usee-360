import React, { useEffect, useContext, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify"; // Ensure react-toastify is installed
import { httpGet } from "../../rest-api";
import { getUserDetailsFromJwt, getUserDetailsFromJwt2, setLoginToken, setUserType } from "../../utils";
import UserService from "../../services/agent/user";

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
        const user = await getUserDetailsFromJwt2(token);
        
        if (user && userType === "agent") {
          const {id, email } = user;
          
          setLoginToken(token);
          setUserType(userType);

          const userDetail = await UserService.detail(id);
          console.log("userDetail", userDetail);

          updateAuthState({
            userDetails: userDetail,
            token: token,
            isAuthenticated: true,
            role: userType,
            email: email,
          });
          // const dashboardPath =
          //   userType === "agent" ? "/agent/dashboard" : "/customer/dashboard";
          // history.push(dashboardPath);
          history.push("/agent/register-social");
        } else {
          history.push("/agent/register-social");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
        history.push("/login");
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
