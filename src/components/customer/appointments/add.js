import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { 
  checkTimeOver, 
  findCurrentTimeSlot, 
  formatSlotFromTime
} from "../../../utils";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import PropertyService from "../../../services/agent/property";
import UserService from "../../../services/agent/user";
import AppointmentService from "../../../services/customer/appointment";
import AvailabilityService from "../../../services/agent/availability";

export default function Add(props) {
  const [defaultPropertyOptions, setDefaultPropertyOptions] = useState([]);
  const [selectedAllocatedProperty, setSelectedAllocatedProperty] = useState([]);
  const [selectedAllocatedPropertyAgent, setSelectedAllocatedPropertyAgent] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState();
  const [anySlotAvailableForToday, setAnySlotAvailableForToday] = useState(false);
  const [selectedAllocatedAgent, setSelectedAllocatedAgent] = useState("");
  const [users, setUsers] = useState([]);
  const location = useLocation();

  const loadProperties = (inputValue, callback) => {
    try {
      setTimeout(async () => {
        const response = await PropertyService.toAllocateCustomer(inputValue);
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

  const checkAvailability = async () => {
    if (!time || !date || !selectedAllocatedPropertyAgent) {
      return;
    }

    const response = await AppointmentService.checkAvailability({
      userId: selectedAllocatedPropertyAgent,
      date,
      time,
    });

    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    if (!response) {
      props.responseHandler([`Unfortunately, ${process.env.REACT_APP_AGENT_ENTITY_LABEL} is not available at this timeslot. Please choose another timeslot or assign it to staff.`]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      property: selectedAllocatedProperty.value,
      appointmentDate: date,
      timeSlotId: time,
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
      setSelectedAllocatedProperty("");
      setSelectedAllocatedPropertyAgent(0);
      setDate("");
      setTime("");
    }
  };

  const selectedAllocatedPropertyHandler = async (e) => {
    setSelectedAllocatedProperty(e);
    setSelectedAllocatedPropertyAgent(e.userId);

    const usersToAllocate = await UserService.toAllocate(e.userId);
    if (usersToAllocate?.length > 0) {
      setUsers(usersToAllocate.map((userDetail) => {
        return {
          label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
          value: userDetail.userId
        }
      }));
    }

    const response = await AvailabilityService.listSlots({ agent: e.userId });
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
  };

  const handleButtonClick = (event) => {
    const nextSlot = selectNextSlot();
    if (!nextSlot) {
      props.responseHandler(["Slot is not available, select another slot"]);
      
      return;
    }

    setTime(nextSlot.value);
  }

  const printSelectedTime = () => {
    const selectedTime = timeslots.find((slot) => slot.value === time);
    return selectedTime?.fromTime  ? selectedTime.fromTime : "";
  };

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

    if (idParam) {
      const loadUserSelectedProperty = async () => {
        const response = await PropertyService.detail(idParam);
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
    }
    
  }, [location]);

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
                  disabled={!(anySlotAvailableForToday && selectedAllocatedProperty)}
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
                  <label>Assign To Staff</label>
                  <Select 
                    classNamePrefix="custom-select"
                    options={users} 
                    onChange={(e) => setSelectedAllocatedAgent(e)}
                    value={selectedAllocatedAgent}
                  />
                </div>
              </div>
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
  );
}
