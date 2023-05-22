import React, { useState, useEffect } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import ResponseHandler from "../global-components/respones-handler";
import axios from "axios";

const colourStyles = {
  // ...colourStyles,
  menu: (provided, state) => ({
    ...provided,
    marginTop: 0,
    marginBottom: 0,
  }),
  menuList: (provided, state) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#9eea9f" : "#fff",
    color: state.isSelected ? "#171b2a;" : "#171b2a;",
    fontFamily: "var(--ltn__body-font)",
    "&:hover": {
      backgroundColor: state.isSelected ? "#9eea9f" : "#9eea9f",
      color: "#171b2a;",
    },
  }),
  control: (base, state) => ({
    ...base,
    transition: "none",
    border: state.isFocused ? "1px solid #888" : "1px solid #dadada",
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 0,
    color: "#d9d9d9",
    backgroundColor: "#fff",
    "&:hover": {
      border: state.isFocused ? "1px solid #00cb04" : "1px solid #00cb04",
    },
    "&:focus-within": {
      border: state.isFocused ? "1px solid #00cb04" : "none",
      boxShadow: state.isFocused
        ? "0 0 0 0.125em rgba(249, 81, 146, 0.25)"
        : "none",
    },
    fontWeight: "600",
    fontFamily: "var(--ltn__body-font)",
    cursor: "pointer",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "#d9d9d9",
    fontSize: "16px",
  }),
};

const Modal = ({ id, agentId, propertyId }) => {
  const [slots, setSlots] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState();
  const [timeSlotId, setTimeSlotId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [supervisor, setSupervisor] = useState(false);
  const [success, setSuccess] = useState();
  const [errors, setErrors] = useState();

  const handleClick = (id) => {
    setTimeSlotId(id);
    checkAvailability(id);
  };

  const setErrorHandler = (msg, param = "form", fullError = false) => {
    setErrors(fullError ? msg : [{ msg, param }]);
    setTimeout(() => {
      setErrors([]);
    }, 3000);
    setSuccess("");
  };

  const setSuccessHandler = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 3000);
    setErrors([]);
  };

  async function loadSlots() {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/iframe/list-slots?agent=${agentId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setSlots(response.data);
      });
  }

  async function bookAppointmentHandler(e) {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      email,
      productId: propertyId,
      type: "appointment",
      appointmentDate: appointmentDate.year + "-" + appointmentDate.month + "-" + appointmentDate.day,
      timeSlotId: Number(timeSlotId),
      isAssignedToSupervisor: supervisor,
    };

    await axios
      .post(`${process.env.REACT_APP_API_URL}/iframe/appointment`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setSuccessHandler(response.data.message);
        setFirstName("");
        setLastName("");
        setEmail("");
        setAppointmentDate(null);
        setTimeSlotId(null);
        setSupervisor(false);
      })
      .catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else if (error?.response?.data?.message) {
          setErrorHandler(error.response.data.message);
        } else {
          setErrorHandler("Unable to add to wishlist, please try again later");
        }
      });
  }

  async function checkAvailability(id) {
    const payload = {
      userId: agentId,
      date: appointmentDate.year + "-" + appointmentDate.month + "-" + appointmentDate.day,
      time: Number(id),
    };

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/iframe/check-availability`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (!response.data.success) {
          setErrorHandler("Time slot already booked.");
        }
      });
  }

  useEffect(() => {
    loadSlots();
  }, []);

  return (
    <div>
      <div className="ltn__modal-area ltn__add-to-cart-modal-area timeModal">
        <div className="modal fade" id={id} tabIndex={-1}>
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body calenderBody">
                <div
                  className="row centered"
                >
                  <div
                    className="col-12 col-lg-6 centered"
                  >
                    <div
                      className="calenderContent mh_562"
                    >
                      <h1 className="calenderModalHeading">Pick a Day</h1>
                      <Calendar
                        calendarClassName="custom-calendar"
                        value={appointmentDate}
                        onChange={setAppointmentDate}
                        shouldHighlightWeekends
                      />
                    </div>
                  </div>
                  {appointmentDate ? (
                    <div
                      className="ltn__quick-view-modal-inner col-12 col-lg-6 centered"
                    >
                      <div>
                        <div className="ml_n10"
                        >
                          <h2
                            className="calenderModalHeading mb_10"
                          >
                            Pick a Time Slot
                          </h2>
                          <ResponseHandler errors={errors} />
                        </div>
                        <div className="modal-product-item mt-4">
                          <div className="row">
                            {slots &&
                              slots.map((item, index) => {
                                return (
                                  <div className="col-3 px-1 py-1">
                                    <div
                                      key={index}
                                      onClick={() => handleClick(item.id)}
                                      className={
                                        timeSlotId === item.id
                                          ? "bgNew"
                                          : "timeCards"
                                      }
                                    >
                                      <p>{item.fromTime}</p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          id="supervisor"
                          onChange={(e) => setSupervisor(e.target.checked)}
                          checked={supervisor}
                          className="mt_10"
                        />
                        <label for="supervisor" className="ml_5"
                         >
                          Select Supervisor
                        </label>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div
                  className="modalBtn justify-content-between"
                >
                  <button
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    className="ml_15"
                  >
                    Close
                  </button>
                  <button
                  className="mr_20"
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    data-bs-toggle="modal"
                    data-bs-target="#child-modal"
                    disabled={!appointmentDate || !timeSlotId}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="ltn__modal-area ltn__add-to-cart-modal-area timeModal">
          <div className="modal fade" id="child-modal" tabIndex={-1}>
            <div className="modal-dialog modal-md" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body calenderBody childModal">
                  <form
                  className="pt_40"
                    onSubmit={bookAppointmentHandler}
                  >
                    <ResponseHandler errors={errors} success={success} />
                    <div>
                      <label htmlFor="fname">First Name</label>
                      <br />
                      <input
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        placeholder="Enter First Name"
                        required
                      ></input>
                    </div>
                    <div>
                      <label htmlFor="fname">Last Name</label>
                      <br />
                      <input
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        placeholder="Enter Last Name"
                        required
                      ></input>
                    </div>
                    <div>
                      <label htmlFor="fname">Email</label>
                      <br />
                      <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Enter Email Address"
                        required
                      ></input>
                    </div>
                    <div
                      className="modalBtn childBtn justify-content-between mt_40"
                    >
                      <button
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        data-bs-toggle="modal"
                        data-bs-target="#time_modal"
                        onClick={(e) => e.preventDefault()}
                      >
                        Back
                      </button>
                      <button type="submit">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
