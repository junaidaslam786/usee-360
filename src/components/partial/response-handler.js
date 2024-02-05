
import React, { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { removeLoginToken } from "../../utils";

export default function ResponseHandler(props) {
  const history = useHistory();

  useEffect(() => {
    if (props?.response?.success) {
      toast.success(props.response.success);
    } else if (props?.response?.errors) {
      // Ensure errors is always treated as an array
      const errors = Array.isArray(props.response.errors) ? props.response.errors : [props.response.errors];
      let msg = "";
      let isSessionExpired = false;
      
      errors.forEach(error => {
        msg = error.msg || error;
        toast.error(msg);

        if (
          msg === "There is no user with this email address!" ||
          msg === "Account is disabled, please contact admin!" ||
          msg === "Account is deleted, please contact admin!"
        ) {
          isSessionExpired = true;
          return;
        }
      });

      if (isSessionExpired) {
        setTimeout(() => {
          removeLoginToken();
          history.push(`/${props.type}/login`);
        }, 2000);
      }
    }
  }, [props?.response?.errors, props?.response?.success, props.type, history]);

  return (
    <div>
      { 
        (props?.response?.success || props?.response?.errors) && ( 
          <ToastContainer />
        )
      }
    </div>
  );
}
