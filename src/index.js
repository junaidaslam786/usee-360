import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, HashRouter, Route, Switch } from "react-router-dom";
import Home from './components/home';
import PropertyGrid from './components/property-grid'
import PropertyDetails from './components/property-details'
import Service from './components/service';
import Error  from './components/404';
import Demo from './components/demo';
import Contact from './components/contact';
import MyAccount from './components/my-account';
import Login from './components/login';
import Register from './components/register';

class Root extends Component {
    render() {
        return(
                <HashRouter basename="/">
	                <div>
	                <Switch>
                        
                        <Route exact path="/" component={ Home } />
                        <Route path="/property-grid" component={ PropertyGrid } />
                        <Route path="/property-details" component={ PropertyDetails } />
                        <Route path="/services" component={ Service } />
                        <Route path="/login" component={ Login } />
                        <Route path="/register" component={ Register } />
                        <Route path="/my-account" component={ MyAccount } />
                        <Route path="/demo" component={ Demo } />
                        <Route path="/contact" component={ Contact } />

	                </Switch>
	                </div>
                </HashRouter>
        )
    }
}

export default Root;

ReactDOM.render(<Root />, document.getElementById('quarter'));