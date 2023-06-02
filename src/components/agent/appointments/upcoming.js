import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  getUserDetailsFromJwt,
  formatAppointmentDate,
  convertGmtToTime
} from "../../../utils";
import Modal from 'react-modal';
import ViewAppointment from "./view-appointment";
import { useHistory } from "react-router";
import AppointmentService from "../../../services/agent/appointment";
import { APPOINTMENT_STATUS, USER_TYPE } from "../../../constants";

export default function Upcoming(props) {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [list, setList] = useState([]);
  const [appointmentView, setAppointmentView] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [notes, setNotes] = useState('');
  const openViewModal = useRef(null);
  const userDetail = getUserDetailsFromJwt();
  const history = useHistory();

  const loadAllList = async (page = 1) => {
    let appendQuery = props?.selectedFilter ? `&filter=${props?.selectedFilter}`: "";
    appendQuery = `${appendQuery}${(props?.startDate && props?.endDate) ? `&startDate=${props.startDate}&endDate=${props.endDate}`: ""}`;
    appendQuery = `${appendQuery}${props?.selectedUser ? `&selectedUser=${props.selectedUser}` : ""}`;

    const response = await AppointmentService.list({ type: "upcoming", page, appendQuery });
    if (response?.data) {
      setList(response.data);
      setCurrentPage(parseInt(response.page));
      setTotalPages(parseInt(response.totalPage));
    }
  };

  const handleViewAppointmentButtonClick = async (id) => {
    if (id) {
      const response = await AppointmentService.detail(id);
      if (response?.id) {
        setAppointmentView(response);
        openViewModal.current.click();
      }
    }
  };

  const handleCancelModalConfirm = async () => {
    const updateStatusResponse = await AppointmentService.updateStatus({
      id: selectedAppointment,
      status: APPOINTMENT_STATUS.CANCELLED,
    });

    if (updateStatusResponse?.error && updateStatusResponse?.message) {
      props.responseHandler(updateStatusResponse.message);
      return;
    }

    if (updateStatusResponse && updateStatusResponse.success) {
      props.responseHandler(updateStatusResponse.message, true);
      setTimeout(() => {
        history.go(0);
      }, 1000);
    }

    setConfirmCancelModal(false);
  }

  const handleCancelModalCancel = () => {
    setConfirmCancelModal(false);
  }

  const handleNotesModalSubmit = async () => {
    const requestData = {
      userId: userDetail.id,
      userType: USER_TYPE.AGENT,
      id: selectedAppointment,
      notes
    };

    const formResponse = await AppointmentService.addNote(requestData);
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    setNotes('');

    await loadAllList();
    setIsNotesModalOpen(false);

    const updateStatusResponse = await AppointmentService.updateStatus({
      id: selectedAppointment,
      status: APPOINTMENT_STATUS.COMPLETED,
    });

    if (updateStatusResponse?.error && updateStatusResponse?.message) {
      props.responseHandler(updateStatusResponse.message);
      return;
    }

    if (updateStatusResponse && updateStatusResponse.success) {
      props.responseHandler(updateStatusResponse.message, true);
      setTimeout(() => {
        history.go(0);
      }, 1000);
    }
  }

  const handleNotesModalCancel = () => {
    setIsNotesModalOpen(false);
  }

  const handleConfirm = (id) => {
    setSelectedAppointment(id);
    setConfirmCancelModal(true);
  }

  const handleNotesModal = (id) => {
    setSelectedAppointment(id);
    setIsNotesModalOpen(true);
  }

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    fetchAllAppointments();
  }, [props]);

  return (
    <React.Fragment>
      <div>
        {
          list && list.length === 0 ? (
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
                  <div>
                    <div className="ltn__my-properties-info appointment-info">
                      <h6 className="mb-10 go-top overflow-dots">
                        {element?.customerUser?.firstName}{" "}
                        {element?.customerUser?.lastName}
                      </h6>
                      <small>
                        <i className="icon-clock" />{" "}
                        { element?.appointmentTimeGmt ? convertGmtToTime(element.appointmentTimeGmt) : "-" }
                      </small>
                    </div>
                  </div>
                </div>
                <div className="tabInner-data">
                  <div className="me-lg-2">
                    <div>
                    {
                      element.allotedAgent === userDetail.id ? (
                        <Link
                          to={{
                            pathname: `/precall/${element.id}/agent`,
                          }}
                        >
                          <button className="joinCall">Join Call</button>
                        </Link>
                      ) : (
                        <button className="supervisor-btn">Assigned to {`${element.allotedAgentUser.firstName} ${element.allotedAgentUser.lastName}`}</button>
                      )
                    }
                  </div>
                    <div>
                      <button className="status-buttons completed mt-lg-2" onClick={() => handleNotesModal(element.id)}>
                        <i className="fa-solid fa-check completed-icon"></i>
                        Completed</button>
                    </div>
                  </div>
                  <div>
                  <div>
                      <button
                      className="view"
                      onClick={() => handleViewAppointmentButtonClick(element.id)}
                      >
                        <i className="fa-solid fa-eye" /> View
                      </button>
                  </div>
                  <div>
                      <button className="status-buttons cancelled mt-lg-2" onClick={() => handleConfirm(element.id)}><i className="fa-solid fa-xmark cancelled-icon"></i>Cancelled</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        }

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
        data-bs-target="#appointment-details"
      ></span>
      <ViewAppointment target="appointment-details" appointment={appointmentView}/>
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
        isOpen={confirmCancelModal}
        onRequestClose={() => setConfirmCancelModal(false)}
        className="MyModal Cancelled"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Confirmation</h2>
        <p>Are you sure you want to cancel this appointment? You won't be able to join this appointment again.</p>
        <div className="ButtonContainer">
          <button className="btn theme-btn-1 modal-btn-custom" onClick={handleCancelModalConfirm}>Yes</button>
          <button className="btn theme-btn-2 modal-btn-custom" onClick={handleCancelModalCancel}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
}
