import React, { useState, useEffect, useRef } from "react";
import Layout from "./layouts/layout";
import "../Availability/index.css";
import options from "../Availability/avaliabilityData";
import ResponseHandler from '../global-components/respones-handler';
import { formatSlotFromTime, getLoginToken } from "../../utils";

export default function Availability() {

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedDayTitle, setSelectedDayTitle] = useState("Monday");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [timeOptions, setTimeOptions] = useState({});
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  const closeModal = useRef(null);

  const handleClick = (index) => {
    if (selectedSlots.includes(index)) {
      setSelectedSlots(selectedSlots.filter((i) => i !== index));
    } else {
      setSelectedSlots([...selectedSlots, index]);
    }
  };

  const token = getLoginToken();

  const loadAllList = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/availability/list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    response = await response.json();
    if (response) {
      const assocArray = response.reduce((acc, obj) => {
        const key = obj.dayId;
        const value = { ...obj.agentTimeSlot, status:  obj.status };
        if (!acc[key]) {
          acc[key] = [];
        }
        if(!userId) setUserId(obj.userId);
        acc[key].push(value);
        return acc;
      }, {});
      for (const [key, value] of Object.entries(assocArray)) {
        value.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          } else if (a.id > b.id) {
            return 1;
          } else {
            return 0;
          }
        });
        const count = value.filter(obj => obj.status === true).length;
        const objToUpdate = options.find(obj => parseInt(obj.id) === parseInt(key));
        objToUpdate.count = count;
        assocArray[key] = value;
      }
      setTimeOptions(assocArray);
    }
  };

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    fetchAllAppointments();
  }, []);

  const handleSubmit = async () => {
    const requestData = {
      userId,
      slotDay: selectedDay,
      timeSlots: selectedSlots,
      allAvailable: false
    };
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/availability/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData)
      }
    );
    if(response && response.status === 200) {
      closeModal.current.click();
      await loadAllList();
      setSuccessHandler("Availability slots have been updated!");
    }
  };

  const setSuccessHandler = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 3000);

    setErrors([]);
  };

  return (
    <Layout>
      <ResponseHandler errors={errors} success={success}/>
      <div className="ltn__myaccount-tab-content-inner">
        {options &&
          options.map((item) => {
            return (
              <div className="availabilityCard">
                <div className="availabilityFirstBox">
                  <div className="cardImage">
                    <img
                      src={`${process.env.PUBLIC_URL}${item.image}`}
                      alt="cardAvatar"
                    />
                  </div>
                  <div className="availabilityCardHeading">
                    <h1>{item.title}</h1>
                    <p>{item.count} slots enabled. Click edit button to view and edit.</p>
                  </div>
                </div>
                <div>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#ltn_api_code_modal"
                    onClick={(event) => {
                      setSelectedDay(item.id);
                      setSelectedDayTitle(item.title)
                      setSelectedSlots(timeOptions[item.id].filter(timeItem => timeItem.status).map(timeItem => timeItem.id));
                    }}
                  >
                    {item.btnText}
                  </button>
                </div>
              </div>
            );
          })}
        <div className="ltn__modal-area ltn__add-to-cart-modal-area timeModal">
          <div className="modal fade" id="ltn_api_code_modal" tabIndex={-1}>
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
                <div className="modal-body">
                  <div className="ltn__quick-view-modal-inner">
                    <div className="modal-product-item">
                      <div className="row">
                        <div className="col-12">
                          <div className="modalHeading">
                            <h2>Update Availability Times - {selectedDayTitle}</h2>
                            <p>Select Time slots</p>
                          </div>
                          <div className="row">
                            {timeOptions && timeOptions[selectedDay] &&
                              timeOptions[selectedDay].map((item) => {
                                return (
                                  <div className="col-4 col-sm-3 px-1 py-1">
                                    <div
                                      key={item.id}
                                      onClick={() => handleClick(item.id)}
                                      className={
                                        selectedSlots.includes(item.id) ? "timeCards" : "bgNew"
                                      }
                                    >
                                      <p>{ item?.fromTime ? formatSlotFromTime(item?.fromTime) : "-" }</p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div className="modalBtn">
                            <button className="modal_submit"
                              onClick={handleSubmit}>Submit</button>
                            <button
                              type="button"
                              className="modal_close ml_10"
                              data-bs-dismiss="modal"
                              ref={closeModal}
                              aria-label="Close"
                            >
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
