import React, { useState, useEffect } from "react";
import Layout from "./layouts/layout";
import UpcomingAppointments from "./appointments/upcoming";

export default function Dashboard() {
  const publicUrl = `${process.env.PUBLIC_URL}/`;
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [profileImage, setProfileImage] = useState();

  const token = JSON.parse(sessionStorage.getItem("agentToken"));
  const getUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await response.json();
    setName(jsonData.firstName + " " + jsonData.lastName);
    setEmail(jsonData.email);
    setPhone(jsonData.phoneNumber);
    setProfileImage(`${process.env.REACT_APP_API_URL}/${jsonData.profileImage}`);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Layout>
      <div className="ltn__comment-area mb-50">
        <div className="ltn-author-introducing clearfix">
          <div className="author-img">
            <img
              src={profileImage}
              alt="Author Image"
            />
          </div>
          <div className="author-info">
            <h6>Agent</h6>
            <h2>{name}</h2>
            <div className="footer-address">
              <ul>
                <li>
                  <div className="footer-address-icon">
                    <i className="icon-call" />
                  </div>
                  <div className="footer-address-info">
                    <p>
                      <a href="#">{phone}</a>
                    </p>
                  </div>
                </li>
                <li>
                  <div className="footer-address-icon">
                    <i className="icon-mail" />
                  </div>
                  <div className="footer-address-info">
                    <p>
                      <a href="#">{email}</a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="row p-2 mb-5">
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
        </div>*/}
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
