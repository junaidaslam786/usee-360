import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    getUserDetailsFromJwt,
    formatAppointmentDate,
    convertGmtToTime
} from "../../../utils";
import { APPOINTMENT_STATUS } from "../../../constants";

export default function ViewAppointment(props) {
  const [appointmentView, setAppointmentView] = useState({});
  const userDetail = getUserDetailsFromJwt();

  useEffect(() => {
    if (props.appointment) {
        const appointmentViewDetail = {
            id: props.appointment.id,
            agentId: props.appointment.agentId,
            allotedAgent: props.appointment.allotedAgent,
            date: props.appointment?.appointmentDate ? formatAppointmentDate(props.appointment.appointmentDate) : "-",
            time: props.appointment?.appointmentTimeGmt ? convertGmtToTime(props.appointment.appointmentTimeGmt) : "-",
            customerName: `${props.appointment.customerUser.firstName} ${props.appointment.customerUser.lastName}`,
            customerEmail: props.appointment.customerUser.email,
            customerPhone: props.appointment.customerUser.phoneNumber,
            customerPic: `${process.env.REACT_APP_API_URL}/${props.appointment.customerUser.profileImage}`,
            agentName: `${props.appointment.agentUser.firstName} ${props.appointment.agentUser.lastName}`,
            agentPic: `${process.env.REACT_APP_API_URL}/${props.appointment.agentUser.profileImage}`,
            supervisorName: props.appointment?.allotedAgentUser ? `${props.appointment.allotedAgentUser.firstName} ${props.appointment.allotedAgentUser.lastName}` : null,
            properties: props.appointment.products,
            status: props.appointment.status
        };

        setAppointmentView(appointmentViewDetail);
    }
    
  }, [props.appointment]);

  return (
    <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id={props.target} tabIndex={-1}>
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
                                        <h4 className="mb-5">Booking # {appointmentView?.id || "N/A"}</h4>
                                    </div>
                                    <div className="col-lg-6">
                                        <div>
                                            <h5 className="p-0 m-0">{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Name</h5>
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
                                                        { appointmentView?.date }
                                                    </p>
                                                </div>
                                                <div className="col">
                                                    <p>
                                                        <i className="fa-regular fa-clock"></i>{" "}
                                                        { appointmentView?.time }
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
                                            <h5 className="p-0 m-0">
                                                {appointmentView.allotedAgent !== appointmentView.agentId ? "Supervisor Name" : "Agent Name"}
                                            </h5>
                                            <p className="p-0 m-o">
                                                {appointmentView.supervisorName ? appointmentView.supervisorName : appointmentView?.agentName || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                        <img
                                            className="mt-2"
                                            src={appointmentView?.agentPic || "N/A"}
                                            height="150"
                                        />
                                        </div>
                                        {
                                            appointmentView?.properties
                                            ?   appointmentView?.properties.map((element, i) => (
                                                    <div key={element.id}>
                                                        <h5 className="p-0 m-0 my-2"> Property: {element.title}</h5>
                                                        <Link
                                                            to={`/agent/property-details/${element.id}`}
                                                            className="close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        >
                                                            <img
                                                                className="mt-2"
                                                                src={element?.featuredImage ? `${process.env.REACT_APP_API_URL}/${element?.featuredImage}` : ""}
                                                                height="150"
                                                            />
                                                        </Link>
                                                    </div>
                                                ))
                                            : ""
                                        }
                                    </div>
                                    {
                                        (appointmentView.status === APPOINTMENT_STATUS.PENDING || appointmentView.status === APPOINTMENT_STATUS.INPROGRESS) && (
                                            <div className="col-lg-12 mt-20">
                                                {
                                                    appointmentView.allotedAgent === userDetail.id ? (
                                                        <Link
                                                            to={{
                                                                pathname: `/precall/${appointmentView.id}/agent`,
                                                                state: {
                                                                appointment: appointmentView,
                                                                },
                                                            }}
                                                        >
                                                            <button className="py-2" data-bs-dismiss="modal">JOIN CALL</button>
                                                        </Link>
                                                    ) : (
                                                        <div className='supervisor-text'>Assigned to supervisor</div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
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
