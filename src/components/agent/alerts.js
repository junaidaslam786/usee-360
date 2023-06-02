import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { USER_ALERT_MODE, USER_ALERT_TYPE, DEFAULT_CURRENCY } from "../../constants";
import { 
  formatCreatedAtTimestamp,
} from "../../utils";
import ViewAppointment from "./appointments/view-appointment";
import AlertService from "../../services/agent/alert";
import PropertyService from "../../services/agent/property";
import AppointmentService from "../../services/agent/appointment";

export default function Alerts() {
  const [list, setList] = useState([]);
  const [appointmentView, setAppointmentView] = useState(null);
  const [offerView, setOfferView] = useState({});
  const openViewModal = useRef(null);
  const openOfferModal = useRef(null);
  const history = useHistory();

  const formatAlertText = (alert) => {
    let text = "";
    const customerName = `<b>${alert.customerAlertUser.firstName} ${alert.customerAlertUser.lastName}</b>`;
    const productTitle = `<b>"${alert.product.title}"</b>`;
  
    switch(alert.alertMode) {
      case USER_ALERT_MODE.WISHLIST: 
        text = `${customerName} removed the property ${productTitle} from wishlist`;
        if (alert.alertType == USER_ALERT_TYPE.WISHLIST_ADDED) {
          text = `${customerName} added the property ${productTitle} to wishlist`;
        }
        
        break;
      case USER_ALERT_MODE.INTEREST: 
        text = `${customerName} is interested in property ${productTitle}`;
        if (alert.alertType == USER_ALERT_TYPE.NOT_INTERESTED) {
          text = `${customerName} is not interested in property ${productTitle}`;
        }

        break;
      case USER_ALERT_MODE.OFFER: 
        text = `${customerName} made an offer to the property ${productTitle}`;
        if (alert.alertType == USER_ALERT_TYPE.OFFER_DELETED) {
          text = `${customerName} has deleted the offer of the property ${productTitle}`;
        }

        break;
      case USER_ALERT_MODE.APPOINTMENT: 
        text = `${customerName} made an appointment for the property ${productTitle}`;

        break;
      case USER_ALERT_MODE.SNAGLIST: 
        text = `${customerName} has updated the snaglist for the property ${productTitle}`;
        if (alert.alertType == USER_ALERT_TYPE.SNAGLIST_APPROVED) {
          text = `${customerName} has approved the snaglist for the property ${productTitle}`;
        }
        
        break;
      default:
        break;
    }
    
    return <p onClick={() => handleAlertClick(alert)} dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const handleAlertClick = async (alert) => {
    if (alert.alertMode === USER_ALERT_MODE.OFFER) {
      await handleViewOfferButtonClick(alert.keyId);
    }

    if (alert.alertMode === USER_ALERT_MODE.APPOINTMENT) {
      await handleViewAppointmentButtonClick(alert.keyId);
    }

    if (alert.alertMode === USER_ALERT_MODE.SNAGLIST) {
      history.push(`/agent/property-details/${alert.productId}`);
    }
  }

  const handleViewOfferButtonClick = async (id) => {
    if (id) {
      const response = await PropertyService.offerDetail(id);
      if (response?.id) {
        setOfferView({
          id: response.id,
          productId: response.productId,
          amount: response.amount,
          notes: response.notes,
        });
        openOfferModal.current.click();
      }
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
    const fetchAllAlerts = async () => {
      const response = await AlertService.list();
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
                    { formatAlertText(element) }
                    <div className="ltn__blog-meta">
                      <ul>
                        <li className="ltn__blog-date">
                          <i className="far fa-calendar-alt" />
                          { element?.createdAt ? formatCreatedAtTimestamp(element.createdAt) : "-" }
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
      <ViewAppointment target="appointment-details" appointment={appointmentView}/>
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
                                <th scope="col">{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } comment</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {DEFAULT_CURRENCY} { offerView.amount }
                                </td>
                                <td>
                                  { offerView.notes }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-20">
                      <div className="col-lg-4">
                        <Link to={`/agent/property-details/${offerView?.productId}`}>
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
