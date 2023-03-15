import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, BrowserRouter, Route, Switch,
} from 'react-router-dom';

import Home from './pages/home';
import PropertyGrid from './pages/property-grid';
import PropertyDetails from './pages/property-details';
import Service from './pages/service';
import Demo from './pages/demo';
import Contact from './pages/contact';

import AgentRegister from './pages/agent/register';
import AgentLogin from './pages/agent/login';
import AgentAccount from './pages/agent/account';

import ClientRegister from './pages/client/register';
import ClientLogin from './pages/client/login';
import ClientAccount from './pages/client/account';

import Error from './pages/404';

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
            <Route path="/services" component={Service} />
            <Route path="/demo" component={Demo} />
            <Route path="/contact" component={Contact} />

            {/* Agent Routes */}
            <Route path="/agent/register" component={AgentRegister} />
            <Route path="/agent/login" component={AgentLogin} />
            <Route path="/agent" component={AgentAccount} />

            {/* Client Routes */}
            <Route path="/client/register" component={ClientRegister} />
            <Route path="/client/login" component={ClientLogin} />
            <Route path="/client" component={ClientAccount} />

            <Route path="*" component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Root;

ReactDOM.render(<Root />, document.getElementById('quarter'));
