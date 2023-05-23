import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import { 
  getUserDetailsFromJwt,
  formatAppointmentDate,
  convertGmtToTime 
} from "../../../utils";
import ViewAppointment from "./view-appointment";

export default function CompletedAppointments(props) {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [agentId, setAgentId] = useState();
  const [list, setList] = useState([]);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [notes, setNotes] = useState('');
  const [appointmentView, setAppointmentView] = useState(null);
  const openViewModal = useRef(null);
  const token = JSON.parse(localStorage.getItem("agentToken"));
  const userDetail = getUserDetailsFromJwt();
  const [showNotesList, setShowNotesList] = useState(false);
  const [notesList, setNotesList] = useState([]);
  
  const loadAllList = async (page = 1) => {
    let appendQuery = props?.selectedFilter ? `&filter=${props?.selectedFilter}`: "";
    appendQuery = `${appendQuery}${(props?.startDate && props?.endDate) ? `&startDate=${props.startDate}&endDate=${props.endDate}`: ""}`;
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/appointment/list?page=${page}&size=10&type=completed${appendQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    response = await response.json();
    if (response?.data) {
      setList(response.data);
      setCurrentPage(parseInt(response.page));
      setTotalPages(parseInt(response.totalPage));
    }
  };

  const getUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await response.json();
    setAgentId(jsonData.id);
  };

  const loadAppointmentFields = async (appointmentId) => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/agent/appointment/${appointmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((data) => data.json());
  };

  async function addNote(notes) {
    const requestData = {
      userId: userDetail.id,
      userType: "agent",
      id: selectedAppointment,
      notes
    };
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/appointment/note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData)
      }
    );
    if(response && response.status === 200) {
    }
  }

  const handleViewAppointmentButtonClick = async (id) => {
    if (id) {
      const response = await loadAppointmentFields(id);
      if (response?.id) {
        setAppointmentView(response);
        openViewModal.current.click();
      }
    }
  };

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    const fetchCurrentUser = async () => {
      await getUser();
    };

    fetchCurrentUser();
    fetchAllAppointments();
  }, [props]);

  const handleNotesModalSubmit = async () => {
    // Do something when the user clicks "Yes"
    await addNote(notes);
    setNotes('');
    await loadAllList();
    setIsNotesModalOpen(false); // Close the modal
  }

  const handleNotesModalCancel = () => {
    // Do something when the user clicks "No"
    setIsNotesModalOpen(false); // Close the modal
  }

  const handleNotesModal = (id) => {
    setSelectedAppointment(id);
    setIsNotesModalOpen(true);
  }

  return (
    <div>
      <div>
        {list && list.length === 0 ? (
          <div>
            <h4 className="no-data">No Data!</h4>
          </div>
        ) : (
          list.map((element, i) => (
            <div key={i} className="tab-data">
              <div className="tabInner-data">
                <div className="ltn__my-properties-img go-top center ltn__my-properties-imgNew">
                  <div>
                    <h1 className="appointment-date mb-1 text-center">
                      { element?.appointmentDate ? formatAppointmentDate(element.appointmentDate, "D") : "-" }
                    </h1>
                    <h3 className="appointment-date mb-0 text-center">
                      { element?.appointmentDate ? formatAppointmentDate(element.appointmentDate, "MMM") : "-" }
                    </h3>
                  </div>
                </div>
                <div className="border-right">
                  <div className="ltn__my-properties-info appointment-info no-border">
                    <h6 className="mb-10 go-top overflow-dots">
                      {element?.customerUser?.firstName}{" "}
                      {element?.customerUser?.lastName}
                    </h6>
                    <small>
                      <i className="icon-clock" />{" "}
                      { element?.appointmentTimeGmt ? convertGmtToTime(element.appointmentTimeGmt) : "-" }
                    </small>
                  </div>
                  <div className="mt-2 ms-4">
                    <button className="status-buttons" onClick={() => handleNotesModal(element.id)}>Add Notes</button>
                    <button className="status-buttons ms-1" onClick={() => {setShowNotesList(true); setNotesList(element.appointmentNotes);}}>Show Notes</button>
                  </div>
                </div>
              </div>
              <div className="tabInner-data">
                <div>
                  <button
                    className="view"
                    onClick={() => handleViewAppointmentButtonClick(element.id)}
                  >
                    <i className="fa-solid fa-eye" /> View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {
          list && list.length > 0 && (
            <div className="ltn__pagination-area text-center">
              <div className="ltn__pagination">
                <ul>
                  <li>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage !== 1) {
                          loadAllList(currentPage - 1);
                        }
                      }}
                    >
                      <i className="fas fa-angle-double-left" />
                    </Link>
                  </li>
                  {Array.from(Array(totalPages), (e, i) => {
                    return (
                      <li
                        key={i}
                        className={currentPage == i + 1 ? "active" : null}
                      >
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            loadAllList(i + 1);
                          }}
                        >
                          {i + 1}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage !== totalPages) {
                          loadAllList(currentPage + 1);
                        }
                      }}
                    >
                      <i className="fas fa-angle-double-right" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
        )}
      </div>

      <span
        ref={openViewModal}
        data-bs-toggle="modal"
        data-bs-target="#completed-appointment-details"
      ></span>
      <ViewAppointment target="completed-appointment-details" appointment={appointmentView}/>
      <Modal
        isOpen={isNotesModalOpen}
        onRequestClose={() => setIsNotesModalOpen(false)}
        className="MyModal Modal-size-unset"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Add some notes to remember</h2>
        <label>Add Note</label>
        <textarea
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
        <button className="btn theme-btn-1 modal-btn-custom" onClick={handleNotesModalSubmit}>Submit</button>
        <button className="btn theme-btn-2 modal-btn-custom" onClick={handleNotesModalCancel}>Cancel</button>
      </Modal>
      <Modal
        isOpen={showNotesList}
        onRequestClose={() => setShowNotesList(false)}
        className="MyNotes MyModal Modal-size-unset"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Notes</h2>
        <div className="notes-scrollable-container">
        {notesList.length ? (
          notesList.map((element, i) => (
            <p key={i} className="notes-list">{element.notes}</p>
          ))
        ) : <span></span>}
        </div>
        <button className="theme-btn-2 modal-btn-custom" onClick={() => setShowNotesList(false)}>Close</button>
      </Modal>
    </div>
  );
}
