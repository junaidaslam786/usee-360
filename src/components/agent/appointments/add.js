import React, { useState, useEffect } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import Select from "react-select";
import { 
  checkTimeOver, 
  findCurrentTimeSlot, 
  formatSlotFromTime,
  getUserDetailsFromJwt
} from "../../../utils";
import { AGENT_TYPE } from "../../../constants";
import CustomerUserService from "../../../services/customer/user";
import AgentUserService from "../../../services/agent/user";
import AvailabilityService from "../../../services/agent/availability";
import PropertyService from "../../../services/agent/property";
import AppointmentService from "../../../services/agent/appointment";

export default function Add(props) {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedAllocatedAgent, setSelectedAllocatedAgent] = useState("");
  const [selectedAllocatedProperties, setSelectedAllocatedProperties] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState();
  const [anySlotAvailableForToday, setAnySlotAvailableForToday] = useState(false);
  const userDetail = getUserDetailsFromJwt();

  const checkAvailability = async (customerId) => {
    if (!time || !date) {
      return;
    }

    let customerIdRequest = customerId;
    if (selectedCustomer?.value) {
      customerIdRequest = selectedCustomer.value;
    }

    const response = await AppointmentService.checkAvailability({
      customerId: customerIdRequest,
      date,
      time,
    });

    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    if (!response) {
      props.responseHandler(["Unfortunately, this timeslot is not available. Please choose another timeslot."]);
    }
  };

  const loadOptions = (inputValue, callback) => {
    try {
      setTimeout(async () => {
        const response = await CustomerUserService.listCustomers(inputValue);
        setCustomers(response);

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

  const selectedCustomerHandler = async (e) => {
    setSelectedCustomer(e);
    if (!email) {
      setEmail("");
    }

    if (!phone) {
      setPhone("");
    }

    const currentCustomer = customers.find((customerValue) => customerValue.id == e.value);
    if (currentCustomer) {
      setEmail(currentCustomer.email);
      setPhone(currentCustomer.phoneNumber || "");
    }

    await checkAvailability(currentCustomer.id);
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

    const customer = customers.find((customerValue) => (customerValue.id === selectedCustomer.value));
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
      allotedAgent: selectedAllocatedAgent.value
    };

    setLoading(true);
    const formResponse = await AppointmentService.add(formData);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse) {
      props.responseHandler("Appointment created successfully", true);
      setSelectedCustomer("");
      setSelectedAllocatedAgent("");
      setSelectedAllocatedProperties("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
    }
  };

  const printSelectedTime = () => {
    const selectedTime = timeslots.find((slot) => slot.value === time);
    return selectedTime?.fromTime  ? selectedTime.fromTime : "";
  };

  const handleButtonClick = (event) => {
    const nextSlot = selectNextSlot();
    if (!nextSlot) {
      props.responseHandler(["Slot is not available, select another slot"]);
      
      return;
    }

    setTime(nextSlot.value);
  }

  const selectNextSlot = (currentTimeSlots) => {
    const availabilityTimeSlots = currentTimeSlots ? currentTimeSlots : timeslots;
    const now = new Date();

    // Format the date and time values to be used as input values
    const dateValue = now.toISOString().slice(0, 10);
    setDate(dateValue);

    const currentSlot = findCurrentTimeSlot(availabilityTimeSlots);
    if (currentSlot) { 
      const foundSlot = availabilityTimeSlots.find((time) => time.value === currentSlot.value);

      // check if current slot expired
      const isTimeExpired = checkTimeOver(dateValue, foundSlot.fromTime);

      // if current slot expired, then select next slot
      const nextSlot = !isTimeExpired ? foundSlot : availabilityTimeSlots.find((time) => time.value === currentSlot.value + 1);

      if (!nextSlot) {
        setAnySlotAvailableForToday(false);
        return false;
      }

      setAnySlotAvailableForToday(true);
      return nextSlot;
    }

    return false;
  }

  const setDateHandler = (e) => {
    const now = new Date();
    let dateValue = e;

    if (new Date(e) < now) {
      // Format the date and time values to be used as input values
      dateValue = now.toISOString().slice(0, 10);
    }
    
    setDate(dateValue);
  }

  useEffect(() => {
    const fetchUsersToAllocate = async () => {
      const response = await AgentUserService.toAllocate();
      if (response) {
        setUsers(response.map((userDetail) => {
          return {
            label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
            value: userDetail.userId
          }
        }));
      }
    }

    const fetchPropertiesToAllocate = async () => {
      const response = await PropertyService.toAllocate();
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
      const response = await AvailabilityService.listSlots();
      if (response) {
        const timeSlotsResponse = response.map((timeSlot) => {
          return {
            label: timeSlot.textShow,
            value: timeSlot.id,
            fromTime: timeSlot.fromTime,
            toTime: timeSlot.toTime
          }
        });

        setTimeslots(timeSlotsResponse);
        selectNextSlot(timeSlotsResponse);
      }
    }

    fetchUsersToAllocate();
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

  return (
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
                  disabled={!(anySlotAvailableForToday && selectedAllocatedProperties.length > 0)}
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
                    onChange={(e) => setDateHandler(e.target.value)}
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
                  <label>{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Name</label>
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
                  <label>{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Email</label>
                  <input
                    type="email"
                    placeholder={`${process.env.REACT_APP_CUSTOMER_ENTITY_LABEL} Email` }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Phone</label>
                  <input
                    type="text"
                    placeholder={`${process.env.REACT_APP_CUSTOMER_ENTITY_LABEL} Phone` }
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              {
                userDetail.agent.agentType !== AGENT_TYPE.STAFF && (
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Assign To</label>
                      <Select 
                        classNamePrefix="custom-select"
                        options={users} 
                        onChange={(e) => setSelectedAllocatedAgent(e)}
                        value={selectedAllocatedAgent}
                      />
                    </div>
                  </div>
                )
              }
              
              <div className="btn-wrapper">
                
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
                                    <p>{ item?.fromTime ? formatSlotFromTime(item.fromTime) : "-" }</p>
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>
                        <div className="modalBtn">
                          <button type="button"
                          className="modal_close"
                            data-bs-dismiss="modal" aria-label="Close">
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
  );
}
