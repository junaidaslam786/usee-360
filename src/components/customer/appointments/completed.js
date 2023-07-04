import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatAppointmentDate, convertGmtToTime } from "../../../utils";
import ViewAppointment from "./view-appointment";
import AppointmentService from "../../../services/customer/appointment";
import { APPOINTMENT_STATUS } from "../../../constants";
import { useStateIfMounted } from "use-state-if-mounted";

export default function Completed(props) {
  const [currentPage, setCurrentPage] = useStateIfMounted();
  const [totalPages, setTotalPages] = useStateIfMounted();
  const [list, setList] = useStateIfMounted([]);
  const [appointmentView, setAppointmentView] = useState(null);
  const openViewModal = useRef(null);

  const loadAllList = async (page = 1) => {
    let appendQuery = props?.selectedFilter
      ? `&filter=${props?.selectedFilter}`
      : "";
    appendQuery = `${appendQuery}${
      props?.startDate && props?.endDate
        ? `&startDate=${props.startDate}&endDate=${props.endDate}`
        : ""
    }`;

    const response = await AppointmentService.list({
      type: APPOINTMENT_STATUS.COMPLETED,
      page,
      appendQuery,
    });
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

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    fetchAllAppointments();
  }, [props]);

  return (
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
                    {element?.agentUser?.firstName}{" "}
                    {element?.agentUser?.lastName}
                  </h6>
                  <small>
                    <i className="icon-clock" />{" "}
                    {element?.appointmentTimeGmt
                      ? convertGmtToTime(element.appointmentTimeGmt)
                      : "-"}
                  </small>
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

      <span
        ref={openViewModal}
        data-bs-toggle="modal"
        data-bs-target="#completed-appointment-details"
      ></span>
      <ViewAppointment
        target="completed-appointment-details"
        appointment={appointmentView}
      />
    </div>
  );
}
