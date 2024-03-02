import React, { useState } from "react";

import InsideNavbar from "../components/global/inside-navbar";
import PageHeader from "../components/global/header";
import MyProfile from "../components/customer/profile";
import Dashboard from "../components/partial/dashboard/dashboard";
import AgentCalendar from "../components/customer/calendar";
import MyWishlist from "../components/customer/wishlist";
import PropertyDetails from "../components/customer/properties/details";
import AddAppointment from "../components/customer/appointments/add";
import MyAppointments from "../components/customer/appointments/list";
import { USER_TYPE } from "../constants";
import CustomerLayout from "../components/global/layout/customer";
import { setResponseHandler } from "../utils";
import ResponseHandler from "../components/partial/response-handler";

export default function CustomerPages({ page }) {
  const [responseMessage, setResponseMessage] = useState();

  const setResponseMessageHandler = (response, isSuccess = false) => {
    setResponseMessage(setResponseHandler(response, isSuccess));
  };

  let pageTitle;
  let ComponentToRender;
  let componentProps = {
    responseHandler: setResponseMessageHandler,
  };

  switch (page) {
    case "dashboard":
      pageTitle = "Dashboard";
      ComponentToRender = Dashboard;
      componentProps.type = USER_TYPE.CUSTOMER;
      break;

    case "add-appointment":
      pageTitle = "Add Appointment";
      ComponentToRender = AddAppointment;
      break;

    case "appointments":
      pageTitle = "My Appointments";
      ComponentToRender = MyAppointments;
      break;

    case "wishlist":
      pageTitle = "My Wishlist";
      ComponentToRender = MyWishlist;
      break;

    case "calendar":
      pageTitle = "My Calendar";
      ComponentToRender = AgentCalendar;
      break;

    // case "alerts":
    //   pageTitle = "Alerts";
    //   ComponentToRender = Alerts;
    //   break;

    case "property-details":
      pageTitle = "Property Details";
      ComponentToRender = PropertyDetails;
      break;

    default:
      pageTitle = "My Profile";
      ComponentToRender = MyProfile;
      break;
  }

  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle={pageTitle} />
      <CustomerLayout
        ComponentToRender={ComponentToRender}
        componentProps={componentProps}
      />
      <ResponseHandler response={responseMessage} type={USER_TYPE.CUSTOMER} />
    </div>
  );
}
