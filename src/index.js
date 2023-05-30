import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import "./index.css";
import { setMomentDefaultTimezone } from "./utils"; 

import Home from "./pages/home";
import PropertyGrid from "./pages/property-grid";
import PropertyDetails from "./pages/property-details";
import Services from "./pages/services";
import Demo from "./pages/demo";
import Contact from "./pages/contact";
import Termcondition from "./pages/termcondition";

import PropertiesService from "./pages/services/properties";

import AgentRegister from "./pages/agent/register";
import AgentLogin from "./pages/agent/login";
import AgentResetPassword from "./pages/agent/reset-password";
import AgentDashboard from "./pages/agent/dashboard";
import AgentAccountDetails from "./pages/agent/account-details";
import AgentProperties from "./pages/agent/properties";
import AgentAddProperty from "./pages/agent/add-property";
import AgentEditProperty from "./pages/agent/edit-property";
import AgentPropertyDetails from "./pages/agent/property-details";
import AgentAppointments from "./pages/agent/appointments";
import AgentAddAppointment from "./pages/agent/add-appointment";
import AgentAlerts from "./pages/agent/alerts";
import AgentMyCalendar from "./pages/agent/my-calendar";
import AgentAvailability from "./pages/agent/my-availability";
import AgentUsers from "./pages/agent/users";

import CustomerRegister from "./pages/customer/register";
import CustomerLogin from "./pages/customer/login";
import CustomerResetPassword from "./pages/customer/reset-password";
import CustomerDashboard from "./pages/customer/dashboard";
import CustomerAppointments from "./pages/customer/appointments";
import CustomerAddAppointment from "./pages/customer/add-appointment";
import CustomerMyCalendar from "./pages/customer/my-calendar";
import CustomerWishlist from "./pages/customer/wishlist";
import CustomerPropertyDetails from "./pages/customer/property-details";
import CustomerProfile from "./pages/customer/profile";

import IframePropertyGrid from "./pages/iframe/property-grid";
import IframePropertyDetails from "./pages/iframe/property-details";

import LocationSearch from "./components/agent-components/location-search";

import Precall from "./pages/precall";
import Meeting from "./pages/meeting";

import Error from "./pages/404";

function AgentRoute({ component: Component, ...restOfProps }) {
  let isAuthenticated = false;
  const token = localStorage.getItem("agentToken");
  if(token) {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    if (decodedJwt.exp * 1000 < Date.now()) {
      localStorage.removeItem("agentToken");
      isAuthenticated = false;
    } else {
      isAuthenticated = true;
    }
  }

  // console.log('agent-current-timezone', JSON.parse(localStorage.getItem("userTimezone")));
  setMomentDefaultTimezone();

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/agent/login" />
      }
    />
  );
}

function CustomerRoute({ component: Component, ...restOfProps }) {
  let isAuthenticated = false;
  const token = localStorage.getItem("customerToken");
  if(token) {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    if (decodedJwt.exp * 1000 < Date.now()) {
      localStorage.removeItem("customerToken");
      isAuthenticated = false;
    } else {
      isAuthenticated = true;
    }
  }

  // console.log('customer-current-timezone', JSON.parse(localStorage.getItem("userTimezone")));
  setMomentDefaultTimezone();

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/customer/login" />
      }
    />
  );
}

class Root extends Component {
  render() {
    return (
      <BrowserRouter basename="/">
        <div>
          <Switch>
            {/* Main Routes */}
            <Route exact path="/" component={Home} />
            <Route path="/property-grid" component={PropertyGrid} />
            <Route path="/property-details/:id" component={PropertyDetails} />
            <Route path="/demo" component={Demo} />
            <Route path="/contact" component={Contact} />
            <Route path="/terms-and-conditions" component={Termcondition} />

            {/* Services Routes */}
            <Route path="/services/properties" component={PropertiesService} />
            <Route path="/services" component={Services} />

            {/* Agent Routes */}
            <Route path="/agent/register" component={AgentRegister} />
            <Route path="/agent/login" component={AgentLogin} />
            <Route path="/agent/reset-password/:token" component={AgentResetPassword} />

            {/* Agent Protected Routes */}
            <AgentRoute path="/agent/dashboard" component={AgentDashboard} />
            <AgentRoute path="/agent/account-details" component={AgentAccountDetails} />
            <AgentRoute path="/agent/properties" component={AgentProperties} />
            <AgentRoute path="/agent/add-property" component={AgentAddProperty} />
            <AgentRoute path="/agent/edit-property/:id" component={AgentEditProperty} />
            <AgentRoute path="/agent/property-details/:id" component={AgentPropertyDetails} />
            <AgentRoute path="/agent/appointments" component={AgentAppointments} />
            <AgentRoute path="/agent/add-appointment" component={AgentAddAppointment} />
            <AgentRoute path="/agent/alerts" component={AgentAlerts} />
            <AgentRoute path="/agent/calendar" component={AgentMyCalendar} />
            <AgentRoute path="/agent/my-availability" component={AgentAvailability} />
            <AgentRoute path="/agent/users" component={ () => <AgentUsers page="users" /> }/>
            <AgentRoute path="/agent/add-user" component={ () => <AgentUsers page="add-user" /> }/>
            <AgentRoute path="/agent/user-details/:id" component={ () => <AgentUsers page="user-details" /> }/>
            
            {/* Client Routes */}
            <Route path="/customer/register" component={CustomerRegister} />
            <Route path="/customer/login" component={CustomerLogin} />
            <Route path="/customer/reset-password/:token" component={CustomerResetPassword} />

            {/* Client Protected Routes */}
            <CustomerRoute path="/customer/dashboard" component={CustomerDashboard} />
            <CustomerRoute path="/customer/appointments" component={CustomerAppointments} />
            <CustomerRoute path="/customer/add-appointment" component={CustomerAddAppointment} />
            <CustomerRoute path="/customer/calendar" component={CustomerMyCalendar} />
            <CustomerRoute path="/customer/wishlist" component={CustomerWishlist} />
            <CustomerRoute path="/customer/property-details/:id" component={CustomerPropertyDetails} />
            <CustomerRoute path="/customer/profile" component={CustomerProfile} />

            {/* Meeting Routes */}
            <Route path="/meeting/:id/:usertype" component={Meeting} />
            <Route path="/precall/:id/:usertype" component={Precall} />

            {/* Location Search */}
            <Route path="/location-search" component={LocationSearch} />

            {/* Iframe Routes */}
            <Route path="/iframe/property-grid/:id" component={IframePropertyGrid} />
            <Route path="/iframe/property-details/:agentId/:propertyId" component={IframePropertyDetails} />

            <Route path="*" component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Root;

ReactDOM.render(<Root />, document.getElementById("quarter"));
