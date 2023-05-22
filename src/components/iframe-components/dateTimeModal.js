import React, { useState, useEffect } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import ResponseHandler from "../global-components/respones-handler";
import axios from "axios";
import Select from "react-select";

const Modal = ({ id, agentId, propertyId }) => {
  const [slots, setSlots] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState();
  const [timeSlotId, setTimeSlotId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [selectedAllocatedAgent, setSelectedAllocatedAgent] = useState("");
  const [success, setSuccess] = useState();
  const [errors, setErrors] = useState();
  const [users, setUsers] = useState([]);

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

  const loadSlots = async () => {
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

  const loadUsersToAllocate = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/iframe/to-allocate?user=${agentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
  };

  const bookAppointmentHandler = async (e) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      email,
      productId: propertyId,
      type: "appointment",
      appointmentDate: appointmentDate.year + "-" + formatMonth(appointmentDate.month) + "-" + appointmentDate.day,
      timeSlotId: Number(timeSlotId),
      allotedAgent: selectedAllocatedAgent.value,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const formResponse = await axios
      .post(`${process.env.REACT_APP_API_URL}/iframe/appointment`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response?.status !== 201) {
          setErrorHandler(
            "Unable to create appointment, please try again later"
          );
        }

        // console.log("create-iframe-appointment-response", response);

        return response.data;
      })
      .catch((error) => {
        console.log("create-iframe-appointment-error", error);
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else if (error?.response?.data?.message) {
          setErrorHandler(error.response.data.message);
        } else {
          setErrorHandler("Unable to create appointment, please try again later");
        }
      }
    );

    if (formResponse) {
      setSuccessHandler("Appointment created successfully");
      setFirstName("");
      setLastName("");
      setEmail("");
      setAppointmentDate(null);
      setTimeSlotId(null);
      setSelectedAllocatedAgent(false);
    }
  }

  const checkAvailability = async (id) => {
    console.log('appointmentDate', appointmentDate);
    await axios.post(`${process.env.REACT_APP_API_URL}/iframe/check-availability`,
    {
      userId: agentId,
      date: appointmentDate.year + "-" + formatMonth(appointmentDate.month) + "-" + appointmentDate.day,
      time: Number(id),
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
        console.log('iframe-checkAvailability-response', response);
        if (!response || !response?.data?.success) {
          setErrorHandler(`Unfortunately, ${process.env.REACT_APP_AGENT_ENTITY_LABEL} is not available at this timeslot. Please choose another timeslot or assign it to staff.`);
        }
        
        return true;
    }).catch(error => {
      console.log('iframe-checkAvailability-error', error);
      setErrorHandler(error?.response?.data?.message ? error.response.data.message : "Unable to check availability, please try again later.");
    });
  }

  const formatMonth = (month) => {
    return month < 10 ? `0${month}` : month;
  }

  useEffect(() => {
    const fetchUsersToAllocate = async () => {
      const response = await loadUsersToAllocate();
      if (response?.length > 0) {
        setUsers(response.map((userDetail) => {
          return {
            label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
            value: userDetail.userId
          }
        }));
      }
    }

    fetchUsersToAllocate();
    loadSlots();
  }, [propertyId]);

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
                        <div className="ml_n10">
                          <h2 className="calenderModalHeading mb_10">
                            Pick a Time Slot
                          </h2>
                        </div>
                        <ResponseHandler errors={errors} success={success}/>
                        <div className="modal-product-item mt-4">
                          <div className="row">
                            <div className="input-item">
                              <label>Assign To Staff</label>
                              <Select 
                                classNamePrefix="custom-select"
                                options={users} 
                                onChange={(e) => setSelectedAllocatedAgent(e)}
                                value={selectedAllocatedAgent}
                              />
                            </div>
                          </div>
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
