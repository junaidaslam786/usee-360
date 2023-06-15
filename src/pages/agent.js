import React, { useState } from "react";

import InsideNavbar from "../components/global/inside-navbar";
import PageHeader from "../components/global/header";
import MyProfile from "../components/agent/profile";
import Alerts from "../components/agent/alerts";
import Dashboard from "../components/partial/dashboard/dashboard";
import Availability from "../components/agent/availability/index";
import AgentCalendar from "../components/agent/calendar";
import AddAppointment from "../components/agent/appointments/add";
import MyAppointments from "../components/agent/appointments/list";
import AddProperty from "../components/agent/properties/add";
import MyProperties from "../components/agent/properties/list";
import PropertyDetail from "../components/agent/properties/details";
import AddUser from "../components/agent/users/add";
import EditUser from "../components/agent/users/edit";
import UserDetail from "../components/agent/users/details";
import Users from "../components/agent/users/list";
import { USER_TYPE } from "../constants";
import ResponseHandler from "../components/partial/response-handler";
import AgentLayout from "../components/global/layout/agent";
import { setResponseHandler } from "../utils";
import { useParams } from 'react-router';

export default function AgentPages({ page }) {
    const { id } = useParams();
    
    const [responseMessage, setResponseMessage] = useState();

    const setResponseMessageHandler = (response, isSuccess = false) => {
        setResponseMessage(setResponseHandler(response, isSuccess));
    }

    let pageTitle;
    let ComponentToRender;
    let componentProps = {
        responseHandler: setResponseMessageHandler
    };

    switch (page) {
        case "dashboard":
            pageTitle = "Dashboard";
            ComponentToRender = Dashboard;
            componentProps.type = USER_TYPE.AGENT;
            break;

        case "add-property":
            pageTitle = "Add Property";
            ComponentToRender = AddProperty;
            break;

        case "edit-property":
            pageTitle = "Edit Property";
            ComponentToRender = AddProperty;
            break;

        case "property-details":
            pageTitle = "Property Details";
            ComponentToRender = PropertyDetail;
            break;

        case "properties":
            pageTitle = "My Properties";
            ComponentToRender = MyProperties;
            break;

        case "add-appointment":
            pageTitle = "Add Appointment";
            ComponentToRender = AddAppointment;
            break;

        case "appointments":
            pageTitle = "My Appointments";
            ComponentToRender = MyAppointments;
            break;

        case "availability":
            pageTitle = "My Availability";
            ComponentToRender = Availability;
            break;

        case "calendar":
            pageTitle = "My Calendar";
            ComponentToRender = AgentCalendar;
            break;

        case "alerts":
            pageTitle = "Alerts";
            ComponentToRender = Alerts;
            break;

        case "add-user":
            pageTitle = "Add User";
            ComponentToRender = AddUser;
            break;

        case "edit-user":
            pageTitle = "Edit User";
            componentProps.id = id;
            ComponentToRender = EditUser;
            break;

        case "user-details":
            pageTitle = "User Details";
            ComponentToRender = UserDetail;
            break;

        case "users":
            pageTitle = "Users";
            ComponentToRender = Users;
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
            <AgentLayout ComponentToRender={ComponentToRender} componentProps={componentProps}/>
            <ResponseHandler response={responseMessage} />
        </div>
    );
}