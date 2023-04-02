import React, { useState } from "react";
import Layout from "./layouts/layout";
import UpcomingAppointments from "./appointments/upcoming";
//import CompletedAppointments from "./appointments/completed";

export default function Dashboard() {
  const publicUrl = `${process.env.PUBLIC_URL}/`;
  // const [selected, setSelected] = useState(0);

  return (
    <Layout>
      <div className="ltn__comment-area mb-50">
        <div className="ltn-author-introducing clearfix">
          <div className="author-img">
            <img
              src={publicUrl + "assets/img/blog/author.jpg"}
              alt="Author Image"
            />
          </div>
          <div className="author-info">
            <h6>Agent of Property</h6>
            <h2>Rosalina D. William</h2>
            <div className="footer-address">
              <ul>
                <li>
                  <div className="footer-address-icon">
                    <i className="icon-call" />
                  </div>
                  <div className="footer-address-info">
                    <p>
                      <a href="tel:+0123-456789">+0123-456789</a>
                    </p>
                  </div>
                </li>
                <li>
                  <div className="footer-address-icon">
                    <i className="icon-mail" />
                  </div>
                  <div className="footer-address-info">
                    <p>
                      <a href="mailto:example@example.com">
                        example@example.com
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row p-2 mb-5">
          <div className="col-md-6 p-2">
            <div className="dashboard-card card-1">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 m-0 p-0 text-start">
                  <p className="card-desc-left m-0 p-0">No. of Properties</p>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 m-0 p-0 text-end">
                  <i className="fa-solid fa-house"></i>
                  <p className="card-desc-right m-0 p-0">27</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 p-2">
            <div className="dashboard-card card-2">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 m-0 p-0 text-start">
                  <p className="card-desc-left m-0 p-0">Upcoming Bookings</p>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 m-0 p-0 text-end">
                  <i className="fa-solid fa-calendar"></i>
                  <p className="card-desc-right m-0 p-0">11</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 p-2">
            <div className="dashboard-card card-3">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 m-0 p-0 text-start">
                  <p className="card-desc-left m-0 p-0">Properties Sold</p>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 m-0 p-0 text-end">
                  <i className="fa-solid fa-house"></i>
                  <p className="card-desc-right m-0 p-0">5</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 p-2">
            <div className="dashboard-card card-4">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 m-0 p-0 text-start">
                  <p className="card-desc-left m-0 p-0">Completed Bookings</p>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 m-0 p-0 text-end">
                  <i className="fa-regular fa-calendar"></i>
                  <p className="card-desc-right m-0 p-0">18</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row mb-3">
        <div className="col-lg-2 col-sm-3">
          <h5>
            <a
              className={selected === 0 ? "link-active" : null}
              href="#"
              onClick={() => setSelected(0)}
            >
              Upcoming
            </a>
          </h5>
        </div>
        <div className="col-lg-2 col-sm-3">
          <h5>
            <a
              className={selected === 1 ? "link-active" : null}
              href="#"
              onClick={() => setSelected(1)}
            >
              Completed
            </a>
          </h5>
        </div>
      </div>
      {selected === 0 ? <UpcomingAppointments /> : null}
      {selected === 1 ? <CompletedAppointments /> : null} */}
      <UpcomingAppointments />
    </Layout>
  );
}
