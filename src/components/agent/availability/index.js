import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { formatSlotFromTime } from "../../../utils";
import AvailabilityService from "../../../services/agent/availability";
import { useStateIfMounted } from "use-state-if-mounted";

export default function Index(props) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedDayTitle, setSelectedDayTitle] = useState("Monday");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [timeOptions, setTimeOptions] = useStateIfMounted({});
  const [timeSlots, setTimeSlots] = useStateIfMounted([]);
  const [userId, setUserId] = useStateIfMounted("");
  const closeModal = useRef(null);

  const handleClick = (index) => {
    if (selectedSlots.includes(index)) {
      setSelectedSlots(selectedSlots.filter((i) => i !== index));
    } else {
      setSelectedSlots([...selectedSlots, index]);
    }
  };

  const loadAllList = async () => {
    let response = await AvailabilityService.list();
    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    const assocArray = response.reduce((acc, obj) => {
      const key = obj.dayId;
      const value = { ...obj.agentTimeSlot, status: obj.status };
      if (!acc[key]) {
        acc[key] = [];
      }
      if (!userId) setUserId(obj.userId);
      acc[key].push(value);
      return acc;
    }, {});

    const currentTimeSlots = [
      {
        id: 1,
        image: "/assets/img/week-days/monday.png",
        title: "Monday",
        desc: "24 slots enabled. Click edit button to view and edit.",
        btnText: "Edit",
        count: 24,
      },
      {
        id: 2,
        image: "/assets/img/week-days/tuesday.png",
        title: "Tuesday",
        desc: "24 slots enabled. Click edit button to view and edit.",
        btnText: "Edit",
        count: 24,
      },
      {
        id: 3,
        image: "/assets/img/week-days/wednesday.png",
        title: "Wednesday",
        desc: "24 slots enabled. Click edit button to view and edit.",
        btnText: "Edit",
        count: 24,
      },
      {
        id: 4,
        image: "/assets/img/week-days/thursday.png",
        title: "Thursday",
        desc: "24 slots enabled. Click edit button to view and edit.",
        btnText: "Edit",
        count: 24,
      },
      {
        id: 5,
        image: "/assets/img/week-days/friday.png",
        title: "Friday",
        desc: "24 slots enabled. Click edit button to view and edit.",
        btnText: "Edit",
        count: 24,
      },
      {
        id: 6,
        image: "/assets/img/week-days/saturday.png",
        title: "Saturday",
        desc: "24 slots enabled. Click edit button to view and edit.",
        btnText: "Edit",
        count: 24,
      },
      {
        id: 7,
        image: "/assets/img/week-days/sunday.png",
        title: "Sunday",
        desc: "24 slots enabled. Click edit button to view and edit.",
        btnText: "Edit",
        count: 24,
      },
    ];

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

      const count = value.filter((obj) => obj.status === true).length;
      const objToUpdate = currentTimeSlots.find(
        (obj) => parseInt(obj.id) === parseInt(key)
      );
      objToUpdate.count = count;
      assocArray[key] = value;
    }

    setTimeSlots(currentTimeSlots);
    setTimeOptions(assocArray);
  };

  useEffect(() => {
    const fetchAvailabilitySlots = async () => {
      await loadAllList();
    };

    fetchAvailabilitySlots();
  }, [loadAllList]);

  const handleSubmit = async () => {
    await updateAvailability({
      userId,
      slotDay: selectedDay,
      timeSlots: selectedSlots,
      allAvailable: false,
    });
  };

  const markAllAvailable = async () => {
    await updateAvailability({
      userId,
      slotDay: selectedDay,
      timeSlots: selectedSlots,
      allAvailable: true,
    });
  };

  const updateAvailability = async (formData) => {
    const response = await AvailabilityService.update(formData);

    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    if (response?.message) {
      closeModal.current.click();
      await loadAllList();

      props.responseHandler(response?.message, true);
    }
  };

  return (
    <div className="ltn__myaccount-tab-content-inner">
      <div className="row mb-50">
        <div className="col-md-4"></div>
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <button
            className="btn theme-btn-1 btn-effect-1"
            onClick={markAllAvailable}
          >
            Mark All Availabile
          </button>
        </div>
      </div>
      {timeSlots &&
        timeSlots.map((item) => {
          return (
            <div className="availabilityCard" key={item.id}>
              <div className="availabilityFirstBox">
                <div className="cardImage">
                  <img
                    src={`${process.env.REACT_APP_PUBLIC_URL}${item.image}`}
                    alt="cardAvatar"
                  />
                </div>
                <div className="availabilityCardHeading">
                  <h1>{item.title}</h1>
                  <p>
                    {item.count} slots enabled. Click edit button to view and
                    edit.
                  </p>
                </div>
              </div>
              <div>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#ltn_api_code_modal"
                  onClick={(event) => {
                    setSelectedDay(item.id);
                    setSelectedDayTitle(item.title);
                    setSelectedSlots(
                      timeOptions[item.id]
                        .filter((timeItem) => timeItem.status)
                        .map((timeItem) => timeItem.id)
                    );
                  }}
                >
                  Edit
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
                          <h2>
                            Update Availability Times - {selectedDayTitle}
                          </h2>
                          <p>Select Time slots</p>
                        </div>
                        <div className="row">
                          {timeOptions &&
                            timeOptions[selectedDay] &&
                            timeOptions[selectedDay].map((item) => {
                              return (
                                <div
                                  className="col-4 col-sm-3 px-1 py-1"
                                  key={item.id}
                                >
                                  <div
                                    key={item.id}
                                    onClick={() => handleClick(item.id)}
                                    className={
                                      selectedSlots.includes(item.id)
                                        ? "timeCards"
                                        : "bgNew"
                                    }
                                  >
                                    <p>
                                      {item?.fromTime
                                        ? formatSlotFromTime(item?.fromTime)
                                        : "-"}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className="modalBtn">
                          <button
                            className="modal_submit"
                            onClick={handleSubmit}
                          >
                            Update
                          </button>
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
  );
}
