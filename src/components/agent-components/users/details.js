import React, { useState, useEffect } from "react";
import Layout from "../layouts/layout";
import UpcomingAppointments from "../appointments/upcoming";
import CompletedAppointments from "../appointments/completed";
import { AGENT_TYPE_LABEL } from "../../../constants";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getLoginToken } from "../../../utils";
import AllocatedProperties from "./allocated-properties";

export default function Appointments() {
    const [userDetail, setUserDetail] = useState(null);

    const params = useParams();
    const token = getLoginToken();

    async function loadAgentUser() {
        await axios
          .get(`${process.env.REACT_APP_API_URL}/agent/user/${params.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setUserDetail(response.data);
          });
    }

    useEffect(() => {
        loadAgentUser();
    }, []);
    return (
        <Layout>
            {
                userDetail?.id && (
                    <div className="ltn__myaccount-tab-content-inner">
                        <div className="ltn__comment-area mb-50">
                            <div className="ltn-author-introducing clearfix">
                                <div className="author-img">
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/${userDetail.user.profileImage}`}
                                        alt="Author Image"
                                    />
                                </div>
                                <div className="author-info">
                                    <h6>{userDetail?.agentType ? AGENT_TYPE_LABEL[userDetail.agentType] : process.env.REACT_APP_AGENT_ENTITY_LABEL}</h6>
                                    <h2>{`${userDetail.user.firstName} ${userDetail.user.lastName}`}</h2>
                                    <div className="footer-address">
                                    <ul>
                                        <li>
                                            <div className="footer-address-icon">
                                                <i className="icon-call" />
                                            </div>
                                            <div className="footer-address-info">
                                                <p>
                                                    <a href="#">{userDetail.user.phoneNumber}</a>
                                                </p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="footer-address-icon">
                                                <i className="icon-mail" />
                                            </div>
                                            <div className="footer-address-info">
                                                <p>
                                                    <a href="#">{userDetail.user.email}</a>
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ltn__my-properties-table table-responsive">
                            <ul
                                className="nav nav-pills pb-2"
                                id="pills-tab"
                                role="tablist"
                                style={{ borderBottom: "1px solid #e5eaee", margin: "0 10px" }}
                            >
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link active customColor"
                                        id="pills-alloted-properties-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-alloted-properties"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-alloted-properties"
                                        aria-selected="true"
                                    >
                                        Allotted Properties
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link customColor"
                                        id="pills-upcoming-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-upcoming"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-upcoming"
                                        aria-selected="true"
                                    >
                                        Upcoming Appointments
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link customColor"
                                        id="pills-completed-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-completed"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-completed"
                                        aria-selected="false"
                                    >
                                        Completed Appointments
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-alloted-properties"
                                    role="tabpanel"
                                    aria-labelledby="pills-alloted-properties-tab"
                                >
                                    <AllocatedProperties selectedUser={userDetail.user.id}/>
                                </div>

                                <div
                                    className="tab-pane fade show"
                                    id="pills-upcoming"
                                    role="tabpanel"
                                    aria-labelledby="pills-upcoming-tab"
                                >
                                    <UpcomingAppointments selectedUser={userDetail.user.id} />
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-completed"
                                    role="tabpanel"
                                    aria-labelledby="pills-completed-tab"
                                >
                                    <CompletedAppointments selectedUser={userDetail.user.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </Layout>
    );
}
