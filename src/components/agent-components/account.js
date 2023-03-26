import React, { Component } from "react";
import Dashboard from './dashboard';
import AccoutnDetails from './account-details';
import MyProperties from './my-properties';
import AddProperty from './add-property';
import Appointments from './appointments';
import AddAppointments from "./add-appointments";
import Alerts from './alerts';

class MyAccount extends Component {
  render() {
    function handleClick() {
      sessionStorage.removeItem('agentToken');
      window.location = '/agent/login';
    }

    return (
      <div className="liton__wishlist-area pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* PRODUCT TAB AREA START */}
              <div className="ltn__product-tab-area">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="ltn__tab-menu-list mb-50">
                        <div className="nav">
                          <a
                            className="active show"
                            data-bs-toggle="tab"
                            href="#ltn_tab_1_1"
                          >
                            Dashboard
                            <i className="fas fa-home" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_2">
                            Account Details
                            <i className="fas fa-user" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_3">
                            My Properties
                            <i className="fa-solid fa-list" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_4">
                            Add Property
                            <i className="fa-solid fa-map-location-dot" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_5">
                            Appointments
                            <i className="fa-solid fa-clock" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_6">
                            Add Appointments
                            <i className="fa-solid fa-calendar-check"></i>
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_7">
                            Alerts
                            <i className="fa-solid fa-bell" />
                          </a>
                          <a href="#" onClick={ handleClick }>
                            Logout
                            <i className="fas fa-sign-out-alt" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="tab-content">
                        <div className="tab-pane fade active show" id="ltn_tab_1_1">
                          <Dashboard />
                          <Appointments />
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_2">
                          <AccoutnDetails />
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_3">
                          <MyProperties />
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_4">
                          <AddProperty />
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_5">
                          <Appointments />
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_6">
                          <AddAppointments />
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_7">
                          <Alerts />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* PRODUCT TAB AREA END */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyAccount;
