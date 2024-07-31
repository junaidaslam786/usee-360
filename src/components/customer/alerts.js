import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { USER_ALERT_MODE, USER_ALERT_TYPE } from "../../constants";
import { formatCreatedAtTimestamp, formatPrice } from "../../utils";
import ViewAppointment from "./appointments/view-appointment"; // Adapt for customer use
import CustomerAlertService from "../../services/customer/alert";
import AppointmentService from "../../services/customer/appointment";
import { useStateIfMounted } from "use-state-if-mounted";


export default function CustomerAlerts(props) {
  const [list, setList] = useStateIfMounted([]);
  const [appointmentView, setAppointmentView] = useState(null);
  const [offerView, setOfferView] = useState({});
 
  const openViewModal = useRef(null);
  const openOfferModal = useRef(null);

  const history = useHistory();

  const formatAlertText = (alert) => {
    let text = "";
    const agentName = alert.agentAlertUser
      ? `<b>${alert.agentAlertUser.firstName} ${alert.agentAlertUser.lastName}</b>`
      : "An agent";
    const productTitle = alert.product
      ? `<b>"${alert.product.title}"</b>`
      : "a property";

    switch (alert.alertMode) {
      case USER_ALERT_MODE.OFFER:
        text = `${agentName} has responded to your offer for the property ${productTitle}`;
        if (alert.alertType === USER_ALERT_TYPE.OFFER_DELETED) {
          text = `${agentName} has deleted the offer for the property ${productTitle}`;
        }
        break;
      case USER_ALERT_MODE.APPOINTMENT:
        text = `${agentName} made an appointment for the property ${productTitle}`;

        break;
      case USER_ALERT_MODE.SNAGLIST:
        text = `There is a snag list update for the property ${productTitle}`;
        if (alert.alertType === USER_ALERT_TYPE.SNAGLIST_APPROVED) {
          text = `Your snag list for the property ${productTitle} has been approved`;
        }
        break;
      default:
        text = "Alert received";
        break;
    }

    return (
      <p
        onClick={() => handleAlertClick(alert)}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  const handleAlertClick = async (alert) => {
    // if (alert.alertMode === USER_ALERT_MODE.OFFER) {
    //   await handleViewOfferButtonClick(alert.keyId);
    // }

    if (alert.alertMode === USER_ALERT_MODE.APPOINTMENT) {
      await handleViewAppointmentButtonClick(alert.keyId);
    }

    if (alert.alertMode === USER_ALERT_MODE.SNAGLIST) {
      history.push(`/customer/property-details/${alert.productId}`);
    }
  };

  const handleViewAppointmentButtonClick = async (id) => {
    const response = await AppointmentService.detail(id); // Make sure this is adapted for customer use
    if (response?.id) {
      setAppointmentView(response);
      openViewModal.current.click();
    }
  };

  //   const handleViewSnagListButtonClick = async (productId) => {
  //     // Hypothetical function to fetch snag list details by product ID
  //     // This could involve setting state for a snag list detail view or redirecting to a snag list detail page
  //     // For this example, let's assume it redirects to a detail page:
  //     history.push(`/customer/snaglist-details/${productId}`);
  //   };

  useEffect(() => {
    const fetchAllAlerts = async () => {
      const response = await CustomerAlertService.list(); // Adapt to actual service method
      if (response?.error && response?.message) {
        props.responseHandler(response.message);
        return;
      }
      setList(response);
    };
    fetchAllAlerts();
  }, []);

  return (
    <React.Fragment>
      <div className="widget ltn__popular-post-widget ltn__twitter-post-widget">
        <ul>
          {list && list.length === 0 ? (
            <li>No Data!</li>
          ) : (
            list.map((element, i) => (
              <li key={element.id}>
                <div className="popular-post-widget-item clearfix">
                  <div className="popular-post-widget-img">
                    <i className="fa-solid fa-bell" />
                  </div>
                  <div className="popular-post-widget-brief">
                    {formatAlertText(element)}
                    <div className="ltn__blog-meta">
                      <ul>
                        <li className="ltn__blog-date">
                          <i className="far fa-calendar-alt" />
                          {element?.createdAt
                            ? formatCreatedAtTimestamp(element.createdAt)
                            : "-"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <span
        ref={openViewModal}
        data-bs-toggle="modal"
        data-bs-target="#appointment-details"
      ></span>
      <ViewAppointment
        target="appointment-details"
        appointment={appointmentView}
      />

      <span
        ref={openOfferModal}
        data-bs-toggle="modal"
        data-bs-target="#offer-details"
      ></span>
      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="offer-details" tabIndex={-1}>
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
                        <div className="ltn__my-properties-table table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Amount</th>
                                <th scope="col">
                                  {process.env.REACT_APP_AGENT_ENTITY_LABEL}{" "}
                                  comment
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{formatPrice(offerView.amount)}</td>
                                <td>{offerView.notes}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-20">
                      <div className="col-lg-4">
                        <Link
                          to={`/customer/property-details/${offerView?.productId}`}
                        >
                          <button
                            className="btn theme-btn-1 btn-effect-1 text-uppercase"
                            data-bs-dismiss="modal"
                          >
                            View Property
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
