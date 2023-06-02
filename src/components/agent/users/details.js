import React, { useState, useEffect } from "react";
import UpcomingAppointments from "../appointments/upcoming";
import CompletedAppointments from "../appointments/completed";
import { AGENT_TYPE_LABEL } from "../../../constants";
import { useParams } from "react-router-dom";
import AllocatedProperties from "./allocated-properties";
import UserService from "../../../services/agent/user";

export default function Details(props) {
    const [userDetail, setUserDetail] = useState(null);

    const params = useParams();

    const loadAgentUser = async () => {
        const formResponse = await UserService.detail(params.id);
        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        if (!formResponse) {
            props.responseHandler(["Unable to get user detail, please try again later"]);
            return;
        }

        setUserDetail(formResponse);
    }

    useEffect(() => {
        loadAgentUser();
    }, []);
    return (
        <React.Fragment>
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
                                className="nav nav-pills pb-2 user-detail-nav-pills"
                                id="pills-tab"
                                role="tablist"
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
                                    <AllocatedProperties selectedUser={userDetail.user.id} responseHandler={props.responseHandler} />
                                </div>

                                <div
                                    className="tab-pane fade show"
                                    id="pills-upcoming"
                                    role="tabpanel"
                                    aria-labelledby="pills-upcoming-tab"
                                >
                                    <UpcomingAppointments selectedUser={userDetail.user.id} responseHandler={props.responseHandler} />
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-completed"
                                    role="tabpanel"
                                    aria-labelledby="pills-completed-tab"
                                >
                                    <CompletedAppointments selectedUser={userDetail.user.id} responseHandler={props.responseHandler} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    );
}
