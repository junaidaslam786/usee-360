import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export default function CompletedAppointments() {
    let publicUrl = process.env.PUBLIC_URL + "/";

    const [agentId, setAgentId] = useState();
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [appointmentView, setAppointmentView] = useState({});
    const openViewModal = useRef(null);
    const token = JSON.parse(localStorage.getItem("agentToken"));

    const loadAllList = async () => {
        let response = await fetch(`${process.env.REACT_APP_API_URL}/agent/appointment/list?page=${page}&size=10`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        response = await response.json();
        if (response) {
            setList(response.data);
        }
    };

    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const jsonData = await response.json();
        setAgentId(jsonData.id);
    };

    const loadAppointmentFields = async (appointmentId) => {
        return fetch(`${process.env.REACT_APP_API_URL}/agent/appointment/${appointmentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((data) => data.json());
    };

    const handleViewAppointmentButtonClick = async (id) => {
        if (id) {
            const response = await loadAppointmentFields(id);
            if (response?.id) {
                setAppointmentView({
                    id: response.id,
                    agentId: response.agentId,
                    allotedAgent: response.allotedAgent,
                    date: response.appointmentDate,
                    time: response?.agentTimeSlot?.fromTime ? response.agentTimeSlot.fromTime : "",
                    customerName: `${response.customerUser.firstName} ${response.customerUser.lastName}`,
                    customerEmail: response.customerUser.email,
                    customerPhone: response.customerUser.phoneNumber,
                    customerPic: `${process.env.REACT_APP_API_URL}/${response.customerUser.profileImage}`,
                    agentName: `${response.agentUser.firstName} ${response.agentUser.lastName}`,
                    agentPic: `${process.env.REACT_APP_API_URL}/${response.agentUser.profileImage}`,
                    supervisorName: response?.allotedAgentUser ? `${response.allotedAgentUser.firstName} ${response.allotedAgentUser.lastName}` : null,
                    properties: response.products,
                });
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
    }, [page]);

    return (
        <div>
            <div className="ltn__myaccount-tab-content-inner">
                <div className="ltn__my-properties-table table-responsive">
                    <ul class="nav nav-pills pb-2" id="pills-tab" role="tablist" style={{ borderBottom: "1px solid #e5eaee", margin: "0 10px" }}>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active customColor" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                Upcoming
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link customColor" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                                Completed
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link customColor" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">
                                Cancelled
                            </button>
                        </li>
                    </ul>
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                            {list && list.length === 0 ? (
                                <div>
                                    <h4 className="no-data">No Data!</h4>
                                </div>
                            ) : (
                                list.map((element, i) => (
                                    <div key={i} className="tab-data">
                                        <div className="tabInner-data">
                                            <div className="ltn__my-properties-img go-top center">
                                                <div>
                                                    <h1 className="appointment-date mb-1">{moment(element?.appointmentDate).format("D")}</h1>
                                                    <h3 className="appointment-date mb-0">{moment(element?.appointmentDate).format("MMM")}</h3>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="ltn__my-properties-info appointment-info">
                                                    <h6 className="mb-10 go-top">
                                                        {element?.customerUser?.firstName} {element?.customerUser?.lastName}
                                                    </h6>
                                                    <small>
                                                        <i className="icon-clock" /> {element?.agentTimeSlot?.fromTime ? moment(element.agentTimeSlot.fromTime, "hh:mm:ss").format("HH:mm") : "-"}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tabInner-data">
                                            <div>
                                                <button className="view" onClick={() => handleViewAppointmentButtonClick(element.id)}>
                                                    <i className="fa-solid fa-eye" /> View
                                                </button>
                                            </div>
                                            <div>
                                                {element.allotedAgent === agentId ? (
                                                    <Link
                                                        to={{
                                                            pathname: `/precall/${element.id}/agent`,
                                                        }}
                                                    >
                                                        <button className="joinCall">JOIN CALL</button>
                                                    </Link>
                                                ) : (
                                                    "Assigned to supervisor"
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                {list && list.length === 0 ? (
                                    <div>
                                        <h4 className="no-data">No Data!</h4>
                                    </div>
                                ) : (
                                    list.map((element, i) => (
                                        <div key={i} className="tab-data">
                                            <div className="tabInner-data">
                                                <div className="ltn__my-properties-img go-top center">
                                                    <div>
                                                        <h1 className="appointment-date mb-1">{moment(element?.appointmentDate).format("D")}</h1>
                                                        <h3 className="appointment-date mb-0">{moment(element?.appointmentDate).format("MMM")}</h3>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="ltn__my-properties-info appointment-info">
                                                        <h6 className="mb-10 go-top">
                                                            {element?.customerUser?.firstName} {element?.customerUser?.lastName}
                                                        </h6>
                                                        <small>
                                                            <i className="icon-clock" /> {element?.agentTimeSlot?.fromTime ? moment(element.agentTimeSlot.fromTime, "hh:mm:ss").format("HH:mm") : "-"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tabInner-data">
                                                <div>
                                                    <button className="view" onClick={() => handleViewAppointmentButtonClick(element.id)}>
                                                        <i className="fa-solid fa-eye" /> View
                                                    </button>
                                                </div>
                                                <div>
                                                    {element.allotedAgent === agentId ? (
                                                        <Link
                                                            to={{
                                                                pathname: `/precall/${element.id}/agent`,
                                                            }}
                                                        >
                                                            <button className="joinCall">JOIN CALL</button>
                                                        </Link>
                                                    ) : (
                                                        "Assigned to supervisor"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                {list && list.length === 0 ? (
                                    <div>
                                        <h4 className="no-data">No Data!</h4>
                                    </div>
                                ) : (
                                    list.map((element, i) => (
                                        <div key={i} className="tab-data">
                                            <div className="tabInner-data">
                                                <div className="ltn__my-properties-img go-top center">
                                                    <div>
                                                        <h1 className="appointment-date mb-1">{moment(element?.appointmentDate).format("D")}</h1>
                                                        <h3 className="appointment-date mb-0">{moment(element?.appointmentDate).format("MMM")}</h3>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="ltn__my-properties-info appointment-info">
                                                        <h6 className="mb-10 go-top">
                                                            {element?.customerUser?.firstName} {element?.customerUser?.lastName}
                                                        </h6>
                                                        <small>
                                                            <i className="icon-clock" /> {element?.agentTimeSlot?.fromTime ? moment(element.agentTimeSlot.fromTime, "hh:mm:ss").format("HH:mm") : "-"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tabInner-data">
                                                <div>
                                                    <button className="view" onClick={() => handleViewAppointmentButtonClick(element.id)}>
                                                        <i className="fa-solid fa-eye" /> View
                                                    </button>
                                                </div>
                                                <div>
                                                    {element.allotedAgent === agentId ? (
                                                        <Link
                                                            to={{
                                                                pathname: `/precall/${element.id}/agent`,
                                                            }}
                                                        >
                                                            <button className="joinCall">JOIN CALL</button>
                                                        </Link>
                                                    ) : (
                                                        "Assigned to supervisor"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                {list && list.length === 0 ? (
                                    <div>
                                        <h4 className="no-data">No Data!</h4>
                                    </div>
                                ) : (
                                    list.map((element, i) => (
                                        <div key={i} className="tab-data">
                                            <div className="tabInner-data">
                                                <div className="ltn__my-properties-img go-top center">
                                                    <div>
                                                        <h1 className="appointment-date mb-1">{moment(element?.appointmentDate).format("D")}</h1>
                                                        <h3 className="appointment-date mb-0">{moment(element?.appointmentDate).format("MMM")}</h3>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="ltn__my-properties-info appointment-info">
                                                        <h6 className="mb-10 go-top">
                                                            {element?.customerUser?.firstName} {element?.customerUser?.lastName}
                                                        </h6>
                                                        <small>
                                                            <i className="icon-clock" /> {element?.agentTimeSlot?.fromTime ? moment(element.agentTimeSlot.fromTime, "hh:mm:ss").format("HH:mm") : "-"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tabInner-data">
                                                <div>
                                                    <button className="view" onClick={() => handleViewAppointmentButtonClick(element.id)}>
                                                        <i className="fa-solid fa-eye" /> View
                                                    </button>
                                                </div>
                                                <div>
                                                    {element.allotedAgent === agentId ? (
                                                        <Link
                                                            to={{
                                                                pathname: `/precall/${element.id}/agent`,
                                                            }}
                                                        >
                                                            <button className="joinCall">JOIN CALL</button>
                                                        </Link>
                                                    ) : (
                                                        "Assigned to supervisor"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                {list && list.length === 0 ? (
                                    <div>
                                        <h4 className="no-data">No Data!</h4>
                                    </div>
                                ) : (
                                    list.map((element, i) => (
                                        <div key={i} className="tab-data">
                                            <div className="tabInner-data">
                                                <div className="ltn__my-properties-img go-top center">
                                                    <div>
                                                        <h1 className="appointment-date mb-1">{moment(element?.appointmentDate).format("D")}</h1>
                                                        <h3 className="appointment-date mb-0">{moment(element?.appointmentDate).format("MMM")}</h3>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="ltn__my-properties-info appointment-info">
                                                        <h6 className="mb-10 go-top">
                                                            {element?.customerUser?.firstName} {element?.customerUser?.lastName}
                                                        </h6>
                                                        <small>
                                                            <i className="icon-clock" /> {element?.agentTimeSlot?.fromTime ? moment(element.agentTimeSlot.fromTime, "hh:mm:ss").format("HH:mm") : "-"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tabInner-data">
                                                <div>
                                                    <button className="view" onClick={() => handleViewAppointmentButtonClick(element.id)}>
                                                        <i className="fa-solid fa-eye" /> View
                                                    </button>
                                                </div>
                                                <div>
                                                    {element.allotedAgent === agentId ? (
                                                        <Link
                                                            to={{
                                                                pathname: `/precall/${element.id}/agent`,
                                                            }}
                                                        >
                                                            <button className="joinCall">JOIN CALL</button>
                                                        </Link>
                                                    ) : (
                                                        "Assigned to supervisor"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                {list && list.length === 0 ? (
                                    <div>
                                        <h4 className="no-data">No Data!</h4>
                                    </div>
                                ) : (
                                    list.map((element, i) => (
                                        <div key={i} className="tab-data">
                                            <div className="tabInner-data">
                                                <div className="ltn__my-properties-img go-top center">
                                                    <div>
                                                        <h1 className="appointment-date mb-1">{moment(element?.appointmentDate).format("D")}</h1>
                                                        <h3 className="appointment-date mb-0">{moment(element?.appointmentDate).format("MMM")}</h3>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="ltn__my-properties-info appointment-info">
                                                        <h6 className="mb-10 go-top">
                                                            {element?.customerUser?.firstName} {element?.customerUser?.lastName}
                                                        </h6>
                                                        <small>
                                                            <i className="icon-clock" /> {element?.agentTimeSlot?.fromTime ? moment(element.agentTimeSlot.fromTime, "hh:mm:ss").format("HH:mm") : "-"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tabInner-data">
                                                <div>
                                                    <button className="view" onClick={() => handleViewAppointmentButtonClick(element.id)}>
                                                        <i className="fa-solid fa-eye" /> View
                                                    </button>
                                                </div>
                                                <div>
                                                    {element.allotedAgent === agentId ? (
                                                        <Link
                                                            to={{
                                                                pathname: `/precall/${element.id}/agent`,
                                                            }}
                                                        >
                                                            <button className="joinCall">JOIN CALL</button>
                                                        </Link>
                                                    ) : (
                                                        "Assigned to supervisor"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <table className="table">
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
                                            <h3 className="appointment-date">{moment(element?.appointmentDate).format("D MMMM")}</h3>
                                        </td>
                                        <td>
                                            <div className="ltn__my-properties-info appointment-info">
                                                <h6 className="mb-10 go-top">
                                                    {element?.customerUser?.firstName} {element?.customerUser?.lastName}
                                                </h6>
                                                <small>
                                                    <i className="icon-clock" /> {element?.agentTimeSlot?.fromTime ? moment(element.agentTimeSlot.fromTime, "hh:mm:ss").format("HH:mm") : "-"}
                                                </small>
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <button onClick={() => handleViewAppointmentButtonClick(element.id)}>
                                                <i className="fa-solid fa-eye" /> View
                                            </button>
                                        </td>
                                        <td>
                                            {element.allotedAgent === agentId ? (
                                                <Link
                                                    to={{
                                                        pathname: `/precall/${element.id}/agent`,
                                                    }}
                                                >
                                                    <button className="py-2">JOIN CALL</button>
                                                </Link>
                                            ) : (
                                                "Assigned to supervisor"
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table> */}
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
            <span ref={openViewModal} data-bs-toggle="modal" data-bs-target="#appointment-details"></span>
            <div className="ltn__modal-area ltn__add-to-cart-modal-area">
                <div className="modal fade" id="appointment-details" tabIndex={-1}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="ltn__quick-view-modal-inner pb-2">
                                    <div className="modal-product-item">
                                        <div className="row">
                                            <div className="col-12">
                                                <h4 className="mb-5">Booking # {appointmentView?.id || "N/A"}</h4>
                                            </div>
                                            <div className="col-lg-6">
                                                <div>
                                                    <h5 className="p-0 m-0">Customer Name</h5>
                                                    <p className="p-0 m-o">{appointmentView?.customerName || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <img className="mt-2" src={appointmentView?.customerPic || "N/A"} height="150" />
                                                </div>
                                                <div>
                                                    <h5 className="p-0 m-0 mt-2">Booking Time</h5>
                                                    <div className="row">
                                                        <div className="col">
                                                            <p className="p-0 m-o">
                                                                <i className="fa-regular fa-calendar"></i> {appointmentView?.date ? moment(appointmentView.date).format("D/MM/YYYY") : "-"}
                                                            </p>
                                                        </div>
                                                        <div className="col">
                                                            <p>
                                                                <i className="fa-regular fa-clock"></i> {appointmentView?.time ? moment(appointmentView.time, "hh:mm:ss").format("HH:mm") : "-"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="p-0 m-0">Contact Info</h5>
                                                    <p className="p-0 m-o">
                                                        <i className="fa-regular fa-envelope"></i> {appointmentView?.customerEmail || "N/A"}
                                                        <br />
                                                        <i className="fa-regular fa-address-book"></i> {appointmentView?.customerPhone || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div>
                                                    <h5 className="p-0 m-0">{appointmentView.allotedAgent !== appointmentView.agentId ? "Supervisor Name" : "Agent Name"}</h5>
                                                    <p className="p-0 m-o">{appointmentView.supervisorName ? appointmentView.supervisorName : appointmentView?.agentName || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <img className="mt-2" src={appointmentView?.agentPic || "N/A"} height="150" />
                                                </div>
                                                {appointmentView?.properties
                                                    ? appointmentView?.properties.map((element, i) => (
                                                          <div key={element.id}>
                                                              <h5 className="p-0 m-0 my-2">Property: {element.title}</h5>
                                                              <Link to={`/agent/property-details/${element.id}`} className="close" data-bs-dismiss="modal" aria-label="Close">
                                                                  <img className="mt-2" src={element?.featuredImage ? `${process.env.REACT_APP_API_URL}/${element?.featuredImage}` : ""} height="150" />
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
