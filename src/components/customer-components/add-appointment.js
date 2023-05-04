import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Layout from "./layouts/layout";
import ResponseHandler from "../global-components/respones-handler";
import { checkTimeOver, findCurrentTimeSlot } from "../../utils";
import moment from "moment";
import { useLocation } from "react-router-dom";

export default function AddAppointment() {
  const [defaultPropertyOptions, setDefaultPropertyOptions] = useState([]);
  const [selectedAllocatedProperty, setSelectedAllocatedProperty] =
    useState([]);
  const [selectedAllocatedPropertyAgent, setSelectedAllocatedPropertyAgent] =
    useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeslots, setTimeslots] = useState([]);
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const location = useLocation();

  const token = JSON.parse(localStorage.getItem("customerToken"));

  async function loadProperty(id) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/property/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseResult = await response.json();
    if (responseResult) {
      return responseResult;
    }
  }

  const loadPropertiesToAllocate = async (searchQuery) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/property/to-allocate-customer?q=${searchQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseResult = await response.json();
    if (responseResult) {
      return responseResult;
    }
  };

  const loadProperties = (inputValue, callback) => {
    try {
      setTimeout(async () => {
        const response = await loadPropertiesToAllocate(inputValue);
        const options = response.map((property) => {
          return {
            value: property.id,
            label: property.title,
            userId: property.userId,
          };
        });
        callback(options);
      }, 1000);
    } catch (error) {
      console.log("errorInFilterProperty", error);
    }
  };

  const loadAgentAvailabilitySlots = async (agent) => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/availability/list-slots?agent=${agent}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseResult = await response.json();
    if (responseResult) {
      setTimeslots(responseResult);
      return responseResult;
    }
  };

  const checkAvailability = async () => {
    if (!time || !date || !selectedAllocatedPropertyAgent) {
      return;
    }

    await axios.post(`${process.env.REACT_APP_API_URL}/agent/user/check-availability`,
    {
      userId: selectedAllocatedPropertyAgent,
      date,
      time,
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
        console.log('checkAvailability-response', response);
        if (!response || !response?.data?.success) {
          setErrorHandler(`Sorry! ${process.env.REACT_APP_AGENT_ENTITY_LABEL} is not available at this timeslot. Please choose another timeslot or assign it to supervisor.`);
        }
        return true;
    }).catch(error => {
      console.log('checkAvailability-error', error);
      setErrorHandler(error?.response?.data?.message ? error.response.data.message : "Unable to check availability, please try again later.");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      property: selectedAllocatedProperty.value,
      appointmentDate: date,
      timeSlotId: time,
      isAssignedToSupervisor: isChecked
    };

    setLoading(true);
    const formResponse = await axios
      .post(
        `${process.env.REACT_APP_API_URL}/customer/appointment/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response?.status !== 201) {
          setErrorHandler(
            "Unable to create appointment, please try again later"
          );
        }

        // console.log("create-appointment-response", response);

        return response.data;
      })
      .catch((error) => {
        console.log("create-appointment-error", error);
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else if (error?.response?.data?.message) {
          setErrorHandler(error.response.data.message);
        } else {
          setErrorHandler(
            "Unable to create appointment, please try again later"
          );
        }
      });

    setLoading(false);
    if (formResponse) {
      setSuccessHandler("Appointment created successfully");
      setSelectedAllocatedProperty("");
      setSelectedAllocatedPropertyAgent(0);
      setDate("");
      setTime("");
      setIsChecked(false);
    }
  };

  const selectedAllocatedPropertyHandler = async (e) => {
    setSelectedAllocatedProperty(e);
    setSelectedAllocatedPropertyAgent(e.userId);
    const response = await loadAgentAvailabilitySlots(e.userId);
    if (response) {
      setTimeslots(response.map((timeSlot) => {
        return {
          label: timeSlot.textShow,
          value: timeSlot.id,
          fromTime: timeSlot.fromTime,
          toTime: timeSlot.toTime
        }
      }));
    }
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

  const handleButtonClick = (event) => {
    const now = new Date();

    // Format the date and time values to be used as input values
    const dateValue = now.toISOString().slice(0, 10);
    setDate(dateValue);

    const currentSlot = findCurrentTimeSlot(timeslots);
    if (currentSlot) { 
      const foundSlot = timeslots.find((time) => time.value === currentSlot.value);

      // check if current slot expired
      const isTimeExpired = checkTimeOver(dateValue, foundSlot.fromTime);

      // if current slot expired, then select next slot
      const nextSlot = !isTimeExpired ? foundSlot : timeslots.find((time) => time.value === currentSlot.value + 1);

      if (!nextSlot) {
        setErrorHandler(
          "Slot is not available, select another slot"
        );
      }

      setTime(nextSlot.value);
    } else {
      setErrorHandler(
        "Slot is not available, select another slot"
      );
    }
  }

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  const printSelectedTime = () => {
    const selectedTime = timeslots.find((slot) => slot.value === time);
    return selectedTime?.fromTime  ? selectedTime.fromTime : "";
  };

  useEffect(() => {
    if (date && time) {
      const callCheckAvailability = async () => {
        await checkAvailability();
      }

      callCheckAvailability();
    }
  }, [date, time]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idParam = searchParams.get('id');

    const loadUserSelectedProperty = async () => {
      const response = await loadProperty(idParam);
      if (response?.id) {
        const defaultOption = {
          value: response.id,
          label: response.title,
          userId: response.userId,
        };
        setDefaultPropertyOptions([defaultOption]);
        selectedAllocatedPropertyHandler(defaultOption);
      }
    }

    loadUserSelectedProperty();
  }, [location]);

  return (
    <Layout>
      <div>
        <h4 className="title-2">Add Quick Appointment</h4>
        <div className="ltn__myaccount-tab-content-inner">
          <div className="ltn__form-box">
            <form onSubmit={handleSubmit}>
              <div className="row mb-50">
                <div className="col-md-12">
                  <div className="input-item">
                    <label>Select Property *</label>
                    <AsyncSelect
                      isMulti={false}
                      classNamePrefix="custom-select"
                      cacheOptions
                      loadOptions={loadProperties}
                      defaultOptions={defaultPropertyOptions}
                      onChange={(e) => selectedAllocatedPropertyHandler(e) }
                      value={selectedAllocatedProperty}
                      placeholder="Type to search"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn theme-btn-2 request-now-btn"
                    onClick={handleButtonClick}
                  >
                    Request Now
                  </button>
                </div>
                <div className="col-md-4">
                  <div className="input-item">
                    <label>Select Date *</label>
                    <input
                      type="date"
                      onChange={(e) => setDate(e.target.value)}
                      value={date}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-item">
                    <label>Choose Time *</label>
                    <input
                      className="timeselectinput"
                      data-bs-toggle="modal"
                      data-bs-target="#ltn_api_code_modal"
                      type="text"
                      placeholder="Choose time"
                      readOnly
                      value={ printSelectedTime() }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-item">
                    <label className="checkbox-item">
                      Assign to Supervisor
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={checkHandler}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
                <div className="btn-wrapper">
                  <ResponseHandler errors={errors} success={success} />
                  <button
                    type="submit"
                    className="btn theme-btn-1 btn-effect-1 text-uppercase"
                  >
                    {loading ? (
                      <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="ltn__modal-area ltn__add-to-cart-modal-area timeModal">
          <div className="modal fade" id="ltn_api_code_modal" tabIndex={-1}>
            <div className="modal-dialog modal-md" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="ltn__quick-view-modal-inner">
                    <div className="modal-product-item">
                      <div className="row">
                        <div className="col-12">
                          <div className="modalHeading">
                            <h2>Select Time slots - { date }</h2>
                          </div>
                          <div className="row">
                            {
                              timeslots && timeslots.map((item, index) => {
                                return (
                                  <div className="col-4 col-sm-3 px-1 py-1" key={index}>
                                    <div onClick={() => setTime(item.value)} className={ time === item.value ? "bgNew" : "timeCards" }>
                                      <p>{ item?.fromTime ? moment(item.fromTime, "hh:mm:ss").format("HH:mm") : "-" }</p>
                                    </div>
                                  </div>
                                );
                              })
                            }
                          </div>
                          <div className="row">
                            <ResponseHandler errors={errors} success={success} />
                          </div>
                          <div className="modalBtn">
                            <button type="button" data-bs-dismiss="modal" aria-label="Close">
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
