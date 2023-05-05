import React from "react";
import { USER_TYPE } from "../../../constants";

export default function Cards(props) {
    return (
        <React.Fragment>
            {
                props?.type === USER_TYPE.AGENT && (
                    <div className="row p-2 mb-5">
                                <div className="col-md-6 p-2">
                                    <div className="dashboard-card card-1 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                                        <div className="d-flex">
                                            <i className="fa-solid fa-house"></i>
                                            <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                                                No. of Properties
                                            </p>
                                        </div>

                                        <p className="card-desc-right m-0 p-0">{props.data?.totalProperties || 0}</p>
                                    </div>
                                </div>
                                <div className="col-md-6 p-2">
                                    <div className="dashboard-card card-2 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                                        <div className="d-flex">
                                            <i className="fa-solid fa-calendar"></i>
                                            <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                                                Upcoming Bookings
                                            </p>
                                        </div>
                                        <p className="card-desc-right m-0 p-0">{props.data?.totalUpcomingAppointment || 0}</p>
                                    </div>
                                </div>
                                <div className="col-md-6 p-2">
                                    <div className="dashboard-card card-3 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                                        <div className="d-flex">
                                            <i className="fa-solid fa-house"></i>
                                            <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                                                Properties Sold
                                            </p>
                                        </div>
                                        <p className="card-desc-right m-0 p-0">{props.data?.totalPropertiesSold || 0}</p>
                                    </div>
                                </div>
                                <div className="col-md-6 p-2">
                                    <div className="dashboard-card card-4 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                                        <div className="d-flex">
                                            <i className="fa-regular fa-calendar"></i>
                                            <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                                                Completed Bookings
                                            </p>
                                        </div>
                                        <p className="card-desc-right m-0 p-0">{props.data?.totalCompletedAppointment || 0}</p>
                                    </div>
                                </div>
                            </div>
                )
            }

            {
                props?.type === USER_TYPE.CUSTOMER && (
                    <div className="row p-2 mb-5">
                        <div className="col-md-6 p-2">
                            <div className="dashboard-card card-1 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                                <div className="d-flex">
                                    <i className="fa-solid fa-house"></i>
                                    <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                                        No of Properties Viewed
                                    </p>
                                </div>

                                <p className="card-desc-right m-0 p-0">{props.data?.totalPropertiesViewed || 0}</p>
                            </div>
                        </div>
                        <div className="col-md-6 p-2">
                            <div className="dashboard-card card-2 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                                <div className="d-flex">
                                    <i className="fa-solid fa-calendar"></i>
                                    <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                                        Upcoming Bookings
                                    </p>
                                </div>
                                <p className="card-desc-right m-0 p-0">{props.data?.totalUpcomingAppointment || 0}</p>
                            </div>
                        </div>
                        <div className="col-md-6 p-2">
                            <div className="dashboard-card card-3 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                                <div className="d-flex">
                                    <i className="fa-solid fa-house"></i>
                                    <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                                        No. of Properties in Wishlist
                                    </p>
                                </div>
                                <p className="card-desc-right m-0 p-0">{props.data?.totalPropertiesInWishlist || 0}</p>
                            </div>
                        </div>
                        <div className="col-md-6 p-2">
                            <div className="dashboard-card card-4 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                                <div className="d-flex">
                                    <i className="fa-regular fa-calendar"></i>
                                    <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                                        Completed Bookings
                                    </p>
                                </div>
                                <p className="card-desc-right m-0 p-0">{props.data?.totalCompletedAppointment || 0}</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    );
};