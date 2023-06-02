
import React, { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResponseHandler(props) {
  useEffect(() => {
    if (props?.response?.success) {
      toast.success(props.response.success);
    } else if (props?.response?.errors) {
      props.response.errors.forEach(error => {
        toast.error(error.msg || error);
      });
    }
  }, [props?.response?.errors, props?.response?.success]);

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
