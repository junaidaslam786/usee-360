import React from "react";

const Cards = () => {
    return (
        <div className="row p-2 mb-5">
            <div className="col-md-6 p-2">
                <div className="dashboard-card card-1 d-flex align-items-center justify-content-between" style={{ lineHeight: "30px" }}>
                    <div className="d-flex">
                        <i className="fa-solid fa-house"></i>
                        <p className="card-desc-left m-0 p-0" style={{ maxWidth: "45%" }}>
                            No. of Properties
                        </p>
                    </div>

                    <p className="card-desc-right m-0 p-0">27</p>
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
                    <p className="card-desc-right m-0 p-0">11</p>
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
                    <p className="card-desc-right m-0 p-0">5</p>
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
                    <p className="card-desc-right m-0 p-0">18</p>
                </div>
            </div>
        </div>
    );
};

export default Cards;
