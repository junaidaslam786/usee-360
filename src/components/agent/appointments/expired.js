import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import {
  getUserDetailsFromJwt,
  formatAppointmentDate,
  convertGmtToTime,
} from "../../../utils";
import ViewAppointment from "./view-appointment";
import AppointmentService from "../../../services/agent/appointment";
import { APPOINTMENT_STATUS, USER_TYPE } from "../../../constants";
import { useStateIfMounted } from "use-state-if-mounted";

export default function Expired(props) {
  const [currentPage, setCurrentPage] = useStateIfMounted();
  const [totalPages, setTotalPages] = useStateIfMounted();
  const [list, setList] = useStateIfMounted([]);
  const [appointmentView, setAppointmentView] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const userDetail = getUserDetailsFromJwt();
  const [showNotesList, setShowNotesList] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [notes, setNotes] = useState("");
  const openViewModal = useRef(null);

  const loadAllList = useCallback(async (page = 1) => {
    const response = await AppointmentService.list({
      type: APPOINTMENT_STATUS.EXPIRED,
      page,
    });
    console.log('expired appointment list', response)
    if (response?.data) {
      setList(response.data);
      setCurrentPage(parseInt(response.page));
      setTotalPages(parseInt(response.totalPage));
    }
  },[props, setCurrentPage, setList, setTotalPages]);

  const handleViewAppointmentButtonClick = async (id) => {
    if (id) {
      const response = await AppointmentService.detail(id);
      if (response?.id) {
        setAppointmentView(response);
        openViewModal.current.click();
      }
    }
  };

  const handleNotesModalSubmit = async () => {
    const requestData = {
      userId: userDetail.id,
      userType: USER_TYPE.AGENT,
      id: selectedAppointment,
      notes,
    };

    const formResponse = await AppointmentService.addNote(requestData);
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    props.responseHandler("Note added successfully.", true);
    setNotes("");

    await loadAllList();
    setIsNotesModalOpen(false);
  };

  const handleNotesModalCancel = () => {
    setIsNotesModalOpen(false);
  };

  const handleNotesModal = (id) => {
    setSelectedAppointment(id);
    setIsNotesModalOpen(true);
  };

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    fetchAllAppointments();
  }, [loadAllList]);

  return (
    <React.Fragment>
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
                      {element?.appointmentDate
                        ? formatAppointmentDate(element.appointmentDate, "D")
                        : "-"}
                    </h1>
                    <h3 className="appointment-date mb-0 text-center">
                      {element?.appointmentDate
                        ? formatAppointmentDate(element.appointmentDate, "MMM")
                        : "-"}
                    </h3>
                  </div>
                </div>
                <div>
                  <div className="ltn__my-properties-info appointment-info">
                    <h6 className="mb-10 go-top overflow-dots">
                      {element?.customerUser?.firstName}{" "}
                      {element?.customerUser?.lastName}
                    </h6>
                    <small>
                      <i className="icon-clock" />{" "}
                      {element?.appointmentTimeGmt
                        ? convertGmtToTime(element.appointmentTimeGmt)
                        : "-"}
                    </small>
                  </div>
                  <div>
                    <button
                      className="status-buttons"
                      onClick={() => handleNotesModal(element.id)}
                    >
                      Add Notes
                    </button>
                    <button
                      className="status-buttons"
                      onClick={() => {
                        setShowNotesList(true);
                        setNotesList(element.appointmentNotes);
                      }}
                    >
                      Show Notes
                    </button>
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

        {list && list.length > 0 && (
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
                      className={currentPage === i + 1 ? "active" : null}
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
        data-bs-target="#expired-appointment-details"
      ></span>
      <ViewAppointment
        target="expired-appointment-details"
        appointment={appointmentView}
      />
      <Modal
        isOpen={isNotesModalOpen}
        onRequestClose={() => setIsNotesModalOpen(false)}
        className="MyModal"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Add some notes to remember</h2>
        <label>Add Note</label>
        <textarea onChange={(e) => setNotes(e.target.value)} value={notes} />
        <button className="btn theme-btn-1" onClick={handleNotesModalSubmit}>
          Submit
        </button>
        <button className="btn theme-btn-2" onClick={handleNotesModalCancel}>
          Cancel
        </button>
      </Modal>
      <Modal
        isOpen={showNotesList}
        onRequestClose={() => setShowNotesList(false)}
        className="MyNotes"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Notes</h2>
        <div className="notes-scrollable-container">
          {notesList.length ? (
            notesList.map((element, i) => (
              <p key={i} className="notes-list">
                {element.notes}
              </p>
            ))
          ) : (
            <span></span>
          )}
        </div>
        <button className="theme-btn-2" onClick={() => setShowNotesList(false)}>
          Close
        </button>
      </Modal>
    </React.Fragment>
  );
}
