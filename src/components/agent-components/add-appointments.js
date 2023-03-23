import React from "react";

export default function AddAppointments() {
  return (
    <div>
      <h4 className="title-2">Add Quick Appointment</h4>
      <div className="ltn__myaccount-tab-content-inner">
        <div className="ltn__form-box">
          <form action="#">
            <div className="row mb-50">
              <div className="col-md-12">
                <div className="input-item">
                  <label>Select Property</label>
                  <select className="nice-select">
                    <option>Apartments</option>
                    <option>Condos</option>
                    <option>Duplexes</option>
                    <option>Houses</option>
                    <option>Industrial</option>
                    <option>Land</option>
                    <option>Offices</option>
                    <option>Retail</option>
                    <option>Villas</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Select Date</label>
                  <input type="date" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Choose Time</label>
                  <input type="time" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Customer Name</label>
                  <input type="text" placeholder="Customer Name" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Customer Email</label>
                  <input type="email" placeholder="Customer Email" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Customer Phone</label>
                  <input type="text" placeholder="Customer Phone" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Alloted To</label>
                  <select className="nice-select">
                    <option>Alex Paul</option>
                    <option>James Foster</option>
                  </select>
                </div>
              </div>
              <div className="btn-wrapper">
                <button
                  type="submit"
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
