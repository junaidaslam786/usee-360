import React, { useState, useEffect } from "react";
import Layout from "./layouts/layout";
import UpcomingAppointments from "./appointments/upcoming";
import SelectorDate from "./DateSelector/SelectorDate";

export default function Dashboard() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [profileImage, setProfileImage] = useState();

    const token = JSON.parse(localStorage.getItem("agentToken"));
    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
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
                        <img src={profileImage} alt="Author Image" />
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
            </div>
            <SelectorDate />
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
