import React, { useState } from "react";
import Layout from "./layouts/layout";
import CompletedAppointments from "./appointments/completed";
import UpcomingAppointments from "./appointments/upcoming";

export default function Appointments() {
  const [selected, setSelected] = useState(0);

  return (
    <Layout>
      <div className="row mb-3">
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
      {selected === 1 ? <CompletedAppointments /> : null}
    </Layout>
  );
}
