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
import AgentAccount from "./pages/agent/account";

import CustomerRegister from "./pages/customer/register";
import CustomerLogin from "./pages/customer/login";
import CustomerAccount from "./pages/customer/account";

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
            <Route path="/property-details" component={PropertyDetails} />
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
            <Route path="/agent" component={AgentAccount} />

            {/* Client Routes */}
            <Route path="/customer/register" component={CustomerRegister} />
            <Route path="/customer/login" component={CustomerLogin} />
            <Route path="/customer" component={CustomerAccount} />

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
