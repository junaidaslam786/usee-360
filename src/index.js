import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";

import Home from "./pages/home";
import PropertyGrid from "./pages/property-grid";
import PropertyDetails from "./pages/property-details";
import Services from "./pages/services";
import Demo from "./pages/demo";
import Contact from "./pages/contact";

import HomesService from "./pages/services/homes";
import VillasService from "./pages/services/villas";
import BoatsService from "./pages/services/boats";
import VehiclesService from "./pages/services/vehicles";
import AviationService from "./pages/services/aviation";
import CommercialRetailService from "./pages/services/commercial-retail";

import AgentRegister from "./pages/agent/register";
import AgentLogin from "./pages/agent/login";
import AgentResetPassword from './pages/agent/reset-password';
import AgentDashboard from "./pages/agent/dashboard";
import AgentAccountDetails from "./pages/agent/account-details";
import AgentProperties from "./pages/agent/properties";
import AgentAddProperty from "./pages/agent/add-property";
import AgentEditProperty from "./pages/agent/edit-property";
import AgentPropertyDetails from "./pages/agent/property-details";
import AgentAppointments from "./pages/agent/appointments";
import AgentAddAppointment from "./pages/agent/add-appointment";
import AgentAlerts from "./pages/agent/alerts";

import CustomerRegister from "./pages/customer/register";
import CustomerLogin from "./pages/customer/login";
import CustomerResetPassword from './pages/customer/reset-password';
import CustomerDashboard from "./pages/customer/dashboard";
import CustomerAppointments from "./pages/customer/appointments";
import CustomerWishlist from "./pages/customer/wishlist";
import CustomerPropertyDetails from "./pages/customer/property-details"
import CustomerProfile from "./pages/customer/profile";

import Precall from "./pages/precall";
import Meeting from "./pages/meeting";

import Error from "./pages/404";

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

            {/* Services Routes */}
            <Route path="/services/homes" component={HomesService} />
            <Route path="/services/villas" component={VillasService} />
            <Route path="/services/boats" component={BoatsService} />
            <Route path="/services/vehicles" component={VehiclesService} />
            <Route path="/services/aviation" component={AviationService} />
            <Route path="/services/commercial-retail" component={CommercialRetailService} />
            <Route path="/services" component={Services} />

            {/* Agent Routes */}
            <Route path="/agent/register" component={AgentRegister} />
            <Route path="/agent/login" component={AgentLogin} />
            <Route path="/agent/reset-password/:token" component={AgentResetPassword} />
            <Route path="/agent/dashboard" component={AgentDashboard} />
            <Route path="/agent/account-details" component={AgentAccountDetails} />
            <Route path="/agent/properties" component={AgentProperties} />
            <Route path="/agent/add-property" component={AgentAddProperty} />
            <Route path="/agent/edit-property/:id" component={AgentEditProperty} />
            <Route path="/agent/property-details/:id" component={AgentPropertyDetails} />
            <Route path="/agent/appointments" component={AgentAppointments} />
            <Route path="/agent/add-appointment" component={AgentAddAppointment} />
            <Route path="/agent/alerts" component={AgentAlerts} />

            {/* Client Routes */}
            <Route path="/customer/register" component={CustomerRegister} />
            <Route path="/customer/login" component={CustomerLogin} />
            <Route path="/customer/reset-password/:token" component={CustomerResetPassword} />
            <Route path="/customer/dashboard" component={CustomerDashboard} />
            <Route path="/customer/appointments" component={CustomerAppointments} />
            <Route path="/customer/wishlist" component={CustomerWishlist} />
            <Route path="/customer/property-details/:id" component={CustomerPropertyDetails} />
            <Route path="/customer/profile" component={CustomerProfile} />

            {/* Meeting Routes */}
            <Route path="/meeting" component={Meeting} />
            <Route path="/precall" component={Precall} />

            <Route path="*" component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Root;

ReactDOM.render(<Root />, document.getElementById("quarter"));
