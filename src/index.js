import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  useHistory
} from "react-router-dom";

import "./index.css";
import { getLoginToken, getUserDetailsFromJwt, removeLoginToken, setMomentDefaultTimezone } from "./utils"; 

import Home from "./pages/home";
import Services from "./pages/services";
import Precall from "./pages/precall";
import Meeting from "./pages/meeting";
import PropertiesService from "./pages/services/properties";
import AgentPages from "./pages/agent";
import CustomerPages from "./pages/customer";

import LocationSearch from "./components/location-search/location-search";
import IframePropertyDetails from "./components/homepage/iframe/details";
import IframePropertyGrid from "./components/homepage/iframe/grid";
import HomePages from "./pages";
import { AGENT_TYPE, AGENT_USER_ACCESS_TYPE_VALUE } from "./constants";

function checkIfHasRouteAccess(path) {
  let redirectRoute = false;
  const userDetail = getUserDetailsFromJwt();

  switch (path) {
    case "/agent/add-property":
      if (!((userDetail?.agent?.agentType === AGENT_TYPE.AGENT || userDetail?.agentAccessLevels?.find((level) => level.accessLevel === AGENT_USER_ACCESS_TYPE_VALUE.ADD_PROPERTY)))) {
        redirectRoute = true;
      }
      break;
    
    case "/agent/edit-property/:id":
      if (!((userDetail?.agent?.agentType === AGENT_TYPE.AGENT || userDetail?.agentAccessLevels?.find((level) => level.accessLevel === AGENT_USER_ACCESS_TYPE_VALUE.EDIT_PROPERTY)))) {
        redirectRoute = true;
      }
      break;

    case "/agent/users":
    case "/agent/add-user":
      if (userDetail?.agent?.agentType === AGENT_TYPE.STAFF) {
        redirectRoute = true;
      }
      break;

    default:
      break;
  }

  return redirectRoute;
}

function AgentRoute({ component: Component, ...restOfProps }) {
  const history = useHistory();
  const token = getLoginToken();
  let isAuthenticated = false;

  if (token) {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    if (decodedJwt.exp * 1000 < Date.now()) {
      removeLoginToken();
      isAuthenticated = false;
    } else {
      isAuthenticated = true;
    }
  }

  if (checkIfHasRouteAccess(restOfProps?.path)) {
    history.push("/agent/dashboard");
  }

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
  const token = getLoginToken();
  if (token) {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    if (decodedJwt.exp * 1000 < Date.now()) {
      removeLoginToken();
      isAuthenticated = false;
    } else {
      isAuthenticated = true;
    }
  }

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
            <Route path="/property-grid" component={ () => <HomePages page="property-grid" /> }/>
            <Route path="/property-details/:id" component={ () => <HomePages page="property-details" /> }/>
            <Route path="/blogs" component={ () => <HomePages page="blogs" /> }/>
            <Route path="/blog-details/:id" component={ () => <HomePages page="blog-details" /> }/>
            <Route path="/news" component={ () => <HomePages page="news" /> }/>
            <Route path="/news-details/:id" component={ () => <HomePages page="news-details" /> }/>
            <Route path="/community" component={ () => <HomePages page="community" /> }/>
            <Route path="/community-posts/:id" component={ () => <HomePages page="community-posts" /> }/>
            <Route path="/community-post-comments/:id" component={ () => <HomePages page="community-post-comments" /> }/>
            <Route path="/demo" component={ () => <HomePages page="book-demo" /> }/>
            <Route path="/contact" component={ () => <HomePages page="contact-us" /> }/>
            <Route path="/terms-and-conditions" component={ () => <HomePages page="terms-conditions" /> }/>

            {/* Services Routes */}
            <Route path="/services/properties" component={PropertiesService} />
            <Route path="/services" component={Services} />

            {/* Agent Routes */}
            <Route path="/agent/register" component={ () => <HomePages page="register" type="agent" /> }/>
            <Route path="/agent/login" component={ () => <HomePages page="login" type="agent" /> }/>
            <Route path="/agent/reset-password/:token" component={ () => <HomePages page="reset-password" type="agent" /> }/>

            {/* Agent Protected Routes */}
            <AgentRoute path="/agent/dashboard" component={ () => <AgentPages page="dashboard" /> }/>
            <AgentRoute path="/agent/profile" component={ () => <AgentPages page="profile" /> }/>
            <AgentRoute path="/agent/alerts" component={ () => <AgentPages page="alerts" /> }/>
            <AgentRoute path="/agent/calendar" component={ () => <AgentPages page="calendar" /> }/>
            <AgentRoute path="/agent/availability" component={ () => <AgentPages page="availability" /> }/>
            <AgentRoute path="/agent/users" component={ () => <AgentPages page="users" /> }/>
            <AgentRoute path="/agent/add-user" component={ () => <AgentPages page="add-user" /> }/>
            <AgentRoute path="/agent/edit-user/:id" component={ () => <AgentPages page="edit-user" /> }/>
            <AgentRoute path="/agent/user-details/:id" component={ () => <AgentPages page="user-details" /> }/>
            <AgentRoute path="/agent/properties" component={ () => <AgentPages page="properties" /> }/>
            <AgentRoute path="/agent/add-property" component={ () => <AgentPages page="add-property" /> }/>
            <AgentRoute path="/agent/edit-property/:id" component={ () => <AgentPages page="edit-property" /> }/>
            <AgentRoute path="/agent/property-details/:id" component={ () => <AgentPages page="property-details" /> }/>
            <AgentRoute path="/agent/appointments" component={ () => <AgentPages page="appointments" /> }/>
            <AgentRoute path="/agent/add-appointment" component={ () => <AgentPages page="add-appointment" /> }/>
            
            {/* Client Routes */}
            <Route path="/customer/register" component={ () => <HomePages page="register" type="customer" /> }/>
            <Route path="/customer/login" component={ () => <HomePages page="login" type="customer" /> }/>
            <Route path="/customer/reset-password/:token" component={ () => <HomePages page="reset-password" type="customer" /> }/>

            {/* Client Protected Routes */}
            <CustomerRoute path="/customer/dashboard" component={ () => <CustomerPages page="dashboard" /> }/>
            <CustomerRoute path="/customer/appointments" component={ () => <CustomerPages page="appointments" /> }/>
            <CustomerRoute path="/customer/add-appointment" component={ () => <CustomerPages page="add-appointment" /> }/>
            <CustomerRoute path="/customer/calendar" component={ () => <CustomerPages page="calendar" /> }/>
            <CustomerRoute path="/customer/wishlist" component={ () => <CustomerPages page="wishlist" /> }/>
            <CustomerRoute path="/customer/property-details/:id" component={ () => <CustomerPages page="property-details" /> }/>
            <CustomerRoute path="/customer/profile" component={ () => <CustomerPages page="profile" /> }/>

            {/* Meeting Routes */}
            <Route path="/meeting/:id/:usertype" component={Meeting} />
            <Route path="/precall/:id/:usertype" component={Precall} />

            {/* Location Search */}
            <Route path="/location-search" component={LocationSearch} />

            {/*Iframe Routes */}
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
