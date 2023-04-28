import React, { useState, useEffect } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import Select from "react-select";
import axios from "axios";
import Layout from "./layouts/layout";
import ResponseHandler from "../global-components/respones-handler";
import { checkTimeOver, findCurrentTimeSlot } from "../../utils";
import moment from "moment";

export default function AddAppointment() {
  const [customers, setCustomers] = useState([]);
  // const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  // const [selectedAllocatedAgent, setSelectedAllocatedAgent] = useState("");
  const [selectedAllocatedProperties, setSelectedAllocatedProperties] =
    useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState();
  const [isChecked, setIsChecked] = useState(false);

  const token = JSON.parse(localStorage.getItem("agentToken"));

  const loadCustomers = async (searchQuery) => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/list-customer?q=${searchQuery}`,
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
      setCustomers(responseResult);
      return responseResult;
    }
  };

  // const loadUsersToAllocate = async () => {
  //   return fetch(`${process.env.REACT_APP_API_URL}/agent/user/to-allocate`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((data) => data.json());
  // };

  const loadAgentAvailabilitySlots = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/availability/list-slots`,
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

  const loadPropertiesToAllocate = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/property/to-allocate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
  };

  const checkAvailability = async () => {
    if (!time || !date) {
      return;
    }

    await axios.post(`${process.env.REACT_APP_API_URL}/agent/user/check-availability`,
    {
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
          setErrorHandler("Sorry this timeslot is not available. Please choose another timeslot.");
        }
        return true;
    }).catch(error => {
      console.log('checkAvailability-error', error);
      setErrorHandler(error?.response?.data?.message ? error.response.data.message : "Unable to check availability, please try again later.");
    });
  };

  const loadOptions = (inputValue, callback) => {
    try {
      setTimeout(async () => {
        const response = await loadCustomers(inputValue);
        const options = response.map((customer) => {
          return {
            value: customer.id,
            label: `${customer.firstName} ${customer.lastName}`,
          };
        });
        callback(options);
      }, 1000);
    } catch (error) {
      console.log("errorInFilterCustomer", error);
    }
  };

  const selectedCustomerHandler = (e) => {
    setSelectedCustomer(e);
    if (!email) {
      setEmail("");
    }

    if (!phone) {
      setPhone("");
    }

    const currentCustomer = customers.find(
      (customer) => customer.id == e.value
    );
    if (currentCustomer) {
      setEmail(currentCustomer.email);
      setPhone(currentCustomer.phoneNumber || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let customerFirstName = "";
    let customerLastName = "";
    let customerEmail = "";
    let customerPhoneNumber = "";
    let customerId = "";

    customerEmail = email;
    customerPhoneNumber = phone;

    const customer = customers.find(
      (customer) => (customer.id = selectedCustomer.value)
    );
    if (customer) {
      customerId = customer.id;
      customerFirstName = customer.firstName;
      customerLastName = customer.lastName;
      customerEmail = customer.email;
      customerPhoneNumber = customer.phoneNumber;
    } else if (selectedCustomer?.value) {
      const customerName = selectedCustomer.value.split(" ");
      customerFirstName = customerName[0];
      if (customerName.length >= 2) {
        customerLastName = customerName[1];
      }
    }

    const formData = {
      properties: selectedAllocatedProperties.map((property) => property.value),
      appointmentDate: date,
      timeSlotId: time,
      customerId: customerId,
      customerFirstName: customerFirstName,
      customerLastName: customerLastName,
      customerPhone: customerPhoneNumber,
      customerEmail: customerEmail,
      isAssignedToSupervisor: isChecked
      // allotedAgent: selectedAllocatedAgent
    };

    setLoading(true);
    const formResponse = await axios
      .post(
        `${process.env.REACT_APP_API_URL}/agent/appointment/create`,
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
      setSelectedCustomer("");
      // setSelectedAllocatedAgent("");
      setSelectedAllocatedProperties("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
      setIsChecked(false);
    }
  };

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  const printSelectedTime = () => {
    const selectedTime = timeslots.find((slot) => slot.value === time);
    return selectedTime?.fromTime  ? selectedTime.fromTime : "";
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

  useEffect(() => {
    // const fetchUsersToAllocate = async () => {
    //   const response = await loadUsersToAllocate();
    //   if (response) {
    //     setUsers(response.map((userDetail) => {
    //       return {
    //         label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
    //         value: userDetail.userId
    //       }
    //     }));
    //   }
    // }

    const fetchPropertiesToAllocate = async () => {
      const response = await loadPropertiesToAllocate();
      if (response) {
        setProperties(
          response.map((property) => {
            return {
              label: property.title,
              value: property.id,
            };
          })
        );
      }
    };

    const fetchAgentAvailabilitySlots = async () => {
      const response = await loadAgentAvailabilitySlots();
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
    }

    // fetchUsersToAllocate();
    fetchPropertiesToAllocate();
    fetchAgentAvailabilitySlots();
  }, []);

  useEffect(() => {
    if (date && time) {
      const callCheckAvailability = async () => {
        await checkAvailability();
      }

      callCheckAvailability();
    }
  }, [date, time]);

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
                    <Select
                      classNamePrefix="custom-select"
                      isMulti
                      options={properties}
                      onChange={(e) => setSelectedAllocatedProperties(e)}
                      value={selectedAllocatedProperties}
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
                    <label>Choose Time * </label>
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
                    <label>Customer Name</label>
                    <AsyncCreatableSelect
                      classNamePrefix="custom-select"
                      cacheOptions
                      loadOptions={loadOptions}
                      defaultOptions={[]}
                      onChange={selectedCustomerHandler}
                      value={selectedCustomer}
                      placeholder="Type to search"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-item">
                    <label>Customer Email</label>
                    <input
                      type="email"
                      placeholder="Customer Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-item">
                    <label>Customer Phone</label>
                    <input
                      type="text"
                      placeholder="Customer Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-item mt-50">
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
                {/* <div className="col-md-6">
                  <div className="input-item">
                    <Select 
                      options={users} 
                      onChange={(e) => setSelectedAllocatedAgent(e)}
                      value={selectedAllocatedAgent}
                      required
                    />
                  </div>
                </div> */}
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
                            <button type="button" style={{"background-color": "#dadada", "color":"black"}} data-bs-dismiss="modal" aria-label="Close">
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
