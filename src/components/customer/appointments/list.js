import React from "react";
import UpcomingAppointments from "./upcoming";
import CompletedAppointments from "./completed";
import CancelledAppointments from "./cancelled";
import ExpiredAppointments from "./expired";

export default function List(props) {
  return (
    <div className="ltn__myaccount-tab-content-inner">
      <div className="ltn__my-properties-table table-responsive">
        <ul
          className="nav nav-pills pb-2 custom_divider"
          id="pills-tab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active customColor"
              id="pills-upcoming-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-upcoming"
              type="button"
              role="tab"
              aria-controls="pills-upcoming"
              aria-selected="true"
            >
              Upcoming
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
              Completed
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link customColor"
              id="pills-cancelled-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-cancelled"
              type="button"
              role="tab"
              aria-controls="pills-cancelled"
              aria-selected="false"
            >
              Cancelled
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link customColor"
              id="pills-expired-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-expired"
              type="button"
              role="tab"
              aria-controls="pills-expired"
              aria-selected="false"
            >
              Expired
            </button>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-upcoming"
            role="tabpanel"
            aria-labelledby="pills-upcoming-tab"
          >
            <UpcomingAppointments responseHandler={props.responseHandler} />
          </div>
          <div
            className="tab-pane fade"
            id="pills-completed"
            role="tabpanel"
            aria-labelledby="pills-completed-tab"
          >
            <CompletedAppointments responseHandler={props.responseHandler}/>
          </div>
          <div
            className="tab-pane fade"
            id="pills-cancelled"
            role="tabpanel"
            aria-labelledby="pills-cancelled-tab"
          >
            <CancelledAppointments responseHandler={props.responseHandler}/>
          </div>
          <div
            className="tab-pane fade"
            id="pills-expired"
            role="tabpanel"
            aria-labelledby="pills-expired-tab"
          >
            <ExpiredAppointments responseHandler={props.responseHandler} />
          </div>
        </div>
      </div>
    </div>
  );
}
