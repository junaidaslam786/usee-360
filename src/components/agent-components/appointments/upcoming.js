import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export default function CompletedAppointments() {
  let publicUrl = process.env.PUBLIC_URL + "/";

  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [appointmentView, setAppointmentView] = useState({});
  const openViewModal = useRef(null);
  const token = JSON.parse(localStorage.getItem("agentToken"));

  const loadAllList = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/appointment/list?page=${page}&size=10`,
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
      setList(response.data);
    }
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

  const handleViewAppointmentButtonClick = async (id) => {
    if (id) {
      const response = await loadAppointmentFields(id);
      if (response?.id) {
        setAppointmentView({
          id: response.id,
          date: response.appointmentDate,
          time: response.appointmentTime,
          customerName: `${response.customerUser.firstName} ${response.customerUser.lastName}`,
          customerEmail: response.customerUser.email,
          customerPhone: response.customerUser.phoneNumber,
          customerPic: `${process.env.REACT_APP_API_URL}/${response.customerUser.profileImage}`,
          agentName: `${response.agentUser.firstName} ${response.agentUser.lastName}`,
          agentPic: `${process.env.REACT_APP_API_URL}/${response.agentUser.profileImage}`,
          properties: response.products,
        });
        openViewModal.current.click();
      }
    }
  };

  useEffect(() => {
    loadAllList();

    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    fetchAllAppointments();
  }, [page]);

  return (
    <div>
      <div className="ltn__myaccount-tab-content-inner">
        <div className="ltn__my-properties-table table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Appointments</th>
                <th scope="col" />
                <th scope="col" />
                <th scope="col">Actions</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {list && list.length === 0 ? (
                <tr>
                  <td className="no-data">No Data!</td>
                </tr>
              ) : (
                list.map((element, i) => (
                  <tr key={i}>
                    <td className="ltn__my-properties-img go-top">
                      <h3 className="appointment-date">
                        {moment.utc(element?.appointmentDate).format("D MMMM")}
                      </h3>
                    </td>
                    <td>
                      <div className="ltn__my-properties-info appointment-info">
                        <h6 className="mb-10 go-top">
                          {element?.customerUser?.firstName}{" "}
                          {element?.customerUser?.lastName}
                        </h6>
                        <small>
                          <i className="icon-clock" />{" "}
                          {moment(element?.appointmentTime, "h:mm").format(
                            "HH:mm"
                          )}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span
                        ref={openViewModal}
                        data-bs-toggle="modal"
                        data-bs-target="#appointment-details"
                      ></span>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleViewAppointmentButtonClick(element.id)
                        }
                      >
                        <i className="fa-solid fa-eye" /> View
                      </button>
                    </td>
                    <td>
                      <Link
                        to={{
                          pathname: `/precall/${element.id}/agent`,
                        }}
                      >
                        <button className="py-2">JOIN CALL</button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* <div className="ltn__pagination-area text-center">
          <div className="ltn__pagination">
            <ul>
              <li>
                <Link to="#">
                  <i className="fas fa-angle-double-left" />
                </Link>
              </li>
              <li>
                <Link to="#">1</Link>
              </li>
              <li className="active">
                <Link to="#">2</Link>
              </li>
              <li>
                <Link to="#">3</Link>
              </li>
              <li>
                <Link to="#">...</Link>
              </li>
              <li>
                <Link to="#">10</Link>
              </li>
              <li>
                <Link to="#">
                  <i className="fas fa-angle-double-right" />
                </Link>
              </li>
            </ul>
          </div>
        </div> */}
      </div>
      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="appointment-details" tabIndex={-1}>
          <div className="modal-dialog modal-lg" role="document">
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
                <div className="ltn__quick-view-modal-inner pb-2">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-12">
                        <h4 className="mb-5">
                          Booking # {appointmentView?.id || "N/A"}
                        </h4>
                      </div>
                      <div className="col-lg-6">
                        <div>
                          <h5 className="p-0 m-0">Customer Name</h5>
                          <p className="p-0 m-o">
                            {appointmentView?.customerName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <img
                            className="mt-2"
                            src={appointmentView?.customerPic || "N/A"}
                            height="150"
                          />
                        </div>
                        <div>
                          <h5 className="p-0 m-0 mt-2">Booking Time</h5>
                          <div className="row">
                            <div className="col">
                              <p className="p-0 m-o">
                                <i className="fa-regular fa-calendar"></i>{" "}
                                {appointmentView?.date
                                  ? moment
                                      .utc(appointmentView.date)
                                      .format("D/MM/YYYY")
                                  : "-"}
                              </p>
                            </div>
                            <div className="col">
                              <p>
                                <i className="fa-regular fa-clock"></i>{" "}
                                {appointmentView?.time
                                  ? moment(appointmentView.time, "h:mm").format(
                                      "HH:mm"
                                    )
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="p-0 m-0">Contact Info</h5>
                          <p className="p-0 m-o">
                            <i className="fa-regular fa-envelope"></i>{" "}
                            {appointmentView?.customerEmail || "N/A"}
                            <br />
                            <i className="fa-regular fa-address-book"></i>{" "}
                            {appointmentView?.customerPhone || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div>
                          <h5 className="p-0 m-0">Agent Name</h5>
                          <p className="p-0 m-o">
                            {appointmentView?.agentName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <img
                            className="mt-2"
                            src={appointmentView?.agentPic || "N/A"}
                            height="150"
                          />
                        </div>
                        {appointmentView?.properties
                          ? appointmentView?.properties.map((element, i) => (
                              <div key={element.id}>
                                <h5 className="p-0 m-0 my-2">
                                  Property: {element.title}
                                </h5>
                                <Link
                                  to={`/agent/property-details/${element.id}`}
                                  className="close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <img
                                    className="mt-2"
                                    src={
                                      element?.featuredImage
                                        ? `${process.env.REACT_APP_API_URL}/${element?.featuredImage}`
                                        : ""
                                    }
                                    height="150"
                                  />
                                </Link>
                              </div>
                            ))
                          : ""}
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