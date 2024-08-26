import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { OFFER_STATUS, SNAG_LIST } from "../../../constants";
import { formatPrice, getUserDetailsFromJwt } from "../../../utils";
import PropertyService from "../../../services/customer/property";

export default function ViewOffer(props) {
  const [productId, setProductId] = useState(0);
  const [snagOfferId, setSnagOfferId] = useState(0);
  const [list, setList] = useState([]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [snagListFormData, setSnagListFormData] = useState([]);
  const [customerApprove, setCustomerApprove] = useState(false);
  const [isApprovedByAgent, setIsApprovedByAgent] = useState(false);
  const [isApprovedByCustomer, setIsApprovedByCustomer] = useState(false);
  const history = useHistory();
  const userDetail = getUserDetailsFromJwt();

  const makeOfferSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await PropertyService.makeOffer({
        productId,
        amount,
        notes,
      });
      props.responseHandler(response.message, !response.error);
      if (!response.error) {
        setAmount("");
        setNotes("");
      }
    } catch (error) {
      console.error("Error during offer submission:", error);
      props.responseHandler("Failed to submit offer");
    } finally {
      setLoading(false);
    }
  };

  const handleOfferDelete = async (offerId) => {
    try {
      const response = await PropertyService.deleteOffer(offerId);
      if (!response.error) {
        setList(list.filter((offer) => offer.id !== offerId));
        props.responseHandler(response.message, true);
      } else {
        props.responseHandler(response.message);
      }
    } catch (error) {
      console.error("Error during offer deletion:", error);
      props.responseHandler("Failed to delete offer");
    }
  };

  const handleSnagListFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await PropertyService.updateSnagList({
        offerId: snagOfferId,
        snagList: snagListFormData,
        isApprovedByCustomer: customerApprove,
      });
      if (response.id) {
        props.responseHandler("Snaglist updated successfully", true);
        setTimeout(() => history.go(0), 1000);
      } else {
        props.responseHandler(response.message);
      }
    } catch (error) {
      console.error("Error updating snag list:", error);
      props.responseHandler("Failed to update snag list");
    } finally {
      setLoading(false);
    }
  };

  const updateSnagListFormData = (index, field, value) => {
    setSnagListFormData(
      snagListFormData.map((item, idx) => {
        if (idx === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSnagListButtonClick = (id) => {
    const offer = list.find((offer) => offer.id === id);
    if (offer && offer.snagList) {
      const snagData = offer.snagList.map((item) => ({
        value: item.value,
        result: item.result,
        comment: item.comment,
        agentComment: item.agentComment,
      }));
      setSnagListFormData(snagData);
      setIsApprovedByCustomer(offer.isApprovedByCustomer);
    }
    setSnagOfferId(id);
  };

  useEffect(() => {
    setProductId(props.property?.id || 0);
    const offers =
      props.property?.productOffers?.filter(
        (offer) => offer?.user?.id === userDetail.id
      ) || [];
    setList(offers);
    if (offers.length > 0) {
      handleSnagListButtonClick(offers[0].id); 
    }
  }, [props.property, userDetail.id]);

  useEffect(() => {
    if (snagOfferId && list.length > 0) {
      const offer = list.find((offer) => offer.id === snagOfferId);
      const snagList = offer?.productSnagList || {};
      setCustomerApprove(snagList.customerApproved);
      setIsApprovedByAgent(snagList.agentApproved);
      setIsApprovedByCustomer(snagList.customerApproved);
      initSnagListFormData(snagList);
    }
  }, [snagOfferId, list]);

  const handleApproval = async () => {
    try {
      setLoading(true);
      const response = await PropertyService.updateSnagList({
        offerId: snagOfferId,
        snagList: snagListFormData.map(({ value, result, comment }) => ({
          value,
          result,
          agentComment: comment, // Ensure this matches your backend expectations
        })),
        isApprovedByCustomer: true,
      });
      if (!response.error) {
        setIsApprovedByCustomer(true);
        props.responseHandler("Snag list approved successfully", true);
      } else {
        props.responseHandler(response.message);
      }
    } catch (error) {
      console.error("Error approving snag list:", error);
      props.responseHandler("Failed to approve snag list");
    } finally {
      setLoading(false);
    }
  };

  const initSnagListFormData = (snagList) => {
    const formData = SNAG_LIST.map((snagListItem) => {
      const existingItem =
        snagList?.productSnagListItems?.find(
          (item) => item.snagKey === snagListItem.value
        ) || {};
      return {
        value: snagListItem.value,
        result: existingItem.snagValue || false,
        comment: existingItem.cc || "",
        agentComment: existingItem.ac || "",
      };
    });
    setSnagListFormData(formData);
  };

  // Rest of the component logic...
  return (
    <div>
      <div className="ltn__shop-details-tab-content-inner--- ltn__shop-details-tab-inner-2 ltn__product-details-review-inner mb-60">
        <div className="ltn__comment-reply-area ltn__form-box mb-30">
          <form onSubmit={makeOfferSubmit} className="ltn__form-box">
            <h4>Make an Offer</h4>
            <div className="input-item input-item-website ltn__custom-icon">
              <input
                type="text"
                placeholder="Enter Offer..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="input-item input-item-textarea ltn__custom-icon">
              <textarea
                placeholder="Enter message...."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="btn-wrapper">
              <button
                className="btn theme-btn-1 btn-effect-1 text-uppercase"
                type="submit"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="ltn__myaccount-tab-content-inner">
        <h4 className="title-2">Offers</h4>
        <div className="ltn__my-properties-table table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Amount</th>
                <th scope="col">Notes</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    No Offers!
                  </td>
                </tr>
              ) : (
                list.map((element, i) => (
                  <tr key={i}>
                    <td>{formatPrice(element.amount)}</td>
                    <td>{element.notes}</td>
                    <td>{element.status}</td>
                    <td>
                      {element.status === OFFER_STATUS.PENDING && (
                        <button onClick={() => handleOfferDelete(element.id)}>
                          Delete
                        </button>
                      )}
                      {element.status === OFFER_STATUS.ACCEPTED && (
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#ltn_snag_list_modal"
                          onClick={() => handleSnagListButtonClick(element.id)}
                        >
                          Snag List
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Snag List */}
      <div className="ltn__modal-area ltn__add-to-cart-modal-area----">
        <div className="modal show" id="ltn_snag_list_modal" tabIndex={-1}>
          <div
            className="modal-dialog modal-dialog-large modal-md"
            role="document"
          >
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
                        <div className="modal-product-info text-center">
                          <h4>Snag List Items</h4>
                          <form
                            className="ltn__form-box"
                            onSubmit={handleSnagListFormSubmit}
                          >
                            <div className="btn-wrapper mt-0">
                              <div className="row mb-50">
                                <b>
                                  {isApprovedByCustomer
                                    ? "Approved by customer"
                                    : "Not yet approved by customer"}
                                </b>
                              </div>
                              <div className="ltn__my-properties-table table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th scope="col">Type</th>
                                      <th scope="col">Result</th>
                                      <th scope="col">
                                        Agent Comments (area/damage etc.)
                                      </th>
                                      <th scope="col">
                                        Customer Comments (area/damage etc.)
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {snagListFormData.map((item, index) => (
                                      <tr key={index}>
                                        <td>
                                          <div className="input-item">
                                            <label>{item.value}</label>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="input-item">
                                            <input
                                              type="checkbox"
                                              checked={item.result}
                                              readOnly
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <div className="input-item">
                                            <textarea
                                              readOnly
                                              value={item.agentComment || "N/A"}
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <div className="input-item">
                                            <textarea
                                              value={item.comment || ""}
                                              onChange={(e) =>
                                                updateSnagListFormData(
                                                  index,
                                                  "comment",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {!isApprovedByCustomer && (
                                <div className="btn-wrapper">
                                  <button
                                    className="theme-btn-1 btn btn-full-width-2"
                                    type="submit"
                                  >
                                    Submit Comments
                                  </button>
                                  <button
                                    onClick={handleApproval}
                                    className="btn btn-success ml-2"
                                    type="button"
                                  >
                                    Approve Snag List
                                  </button>
                                </div>
                              )}
                            </div>
                          </form>
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
