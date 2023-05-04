import React, { useState } from "react";
import Layout from "./layouts/layout";
import UpcomingAppointments from "./appointments/upcoming";
import CompletedAppointments from "./appointments/completed";
import CancelledAppointments from "./appointments/cancelled";


export default function Appointments() {
  //const [selected, setSelected] = useState(0);

  return (
    <Layout>
      <div className="ltn__myaccount-tab-content-inner">
        <div className="ltn__my-properties-table table-responsive">
          <ul
            class="nav nav-pills pb-2"
            id="pills-tab"
            role="tablist"
            style={{ borderBottom: "1px solid #e5eaee", margin: "0 10px" }}
          >
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active customColor"
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
            <li class="nav-item" role="presentation">
              <button
                class="nav-link customColor"
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
            <li class="nav-item" role="presentation">
              <button
                class="nav-link customColor"
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
          </ul>
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-upcoming"
              role="tabpanel"
              aria-labelledby="pills-upcoming-tab"
            >
              <UpcomingAppointments />
            </div>
            <div
              class="tab-pane fade"
              id="pills-completed"
              role="tabpanel"
              aria-labelledby="pills-completed-tab"
            >
              <CompletedAppointments />
            </div>
            <div
              class="tab-pane fade"
              id="pills-cancelled"
              role="tabpanel"
              aria-labelledby="pills-cancelled-tab"
            >
              <CancelledAppointments />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
