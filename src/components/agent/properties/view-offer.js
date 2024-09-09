
import React, { useState, useEffect, useRef } from "react";
import { OFFER_STATUS, SNAG_LIST } from "../../../constants";
import { useHistory } from "react-router";
import PropertyService from "../../../services/agent/property";
import StripeService from "../../../services/agent/stripe-service";
import { formatPrice, getUserDetailsFromJwt } from "../../../utils";
import { toast } from "react-toastify";

export default function ViewOffer(props) {
  const [list, setList] = useState([]);
  const [offerId, setOfferId] = useState(0);
  const [snagOfferId, setSnagOfferId] = useState(0);
  const [offerRejectReason, setOfferRejectReason] = useState("");
  const [snagListFormData, setSnagListFormData] = useState([]);
  const [agentApprove, setAgentApprove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isApprovedByCustomer, setIsApprovedByCustomer] = useState(false);
  const [isApprovedByAgent, setIsApprovedByAgent] = useState(false);
  const [isSnagListEnabled, setIsSnagListEnabled] = useState(false);
  const [isSnagListSubscribed, setIsSnagListSubscribed] = useState(false);
  const [userSubscriptionId, setUserSubscriptionId] = useState(null);
  const closeModal = useRef(null);
  const history = useHistory();
  const userDetail = getUserDetailsFromJwt();

  const checkSubscriptionDetails = async () => {
    try {
      const response = await StripeService.getUserSubscriptionDetails(userDetail.id);
  
      
      // Check if the response contains an error or lacks the required data
      if (response?.status !== 200 || !response?.data?.userSubscriptions) {
        toast.error(response?.statusText || "Failed to load subscription details.");
        return;
      }
  
      // Extract userSubscriptions from the response
      const userSubscriptions = response.data.userSubscriptions;
  
      // Find the Snag List subscription in the user's active subscriptions
      const snagListSubscription = userSubscriptions.find(
        (sub) => sub?.feature?.name === "Snag List" && sub.status === "active"
      );
  
      

      // If Snag List is found, update the state
      if (snagListSubscription) {
        setIsSnagListSubscribed(true);
        setUserSubscriptionId(snagListSubscription.id);
      } else {
        setIsSnagListSubscribed(false);
        toast.error("You have not subscribed to the Snag List feature.");
      }
    } catch (error) {
      console.error("Error checking subscription details:", error);
      toast.error("Failed to check subscription details. Please try again later.");
    }
  };
  
  const enableSnagList = async () => {
    try {
      setLoading(true);
      const response = await PropertyService.enableSnagList(props.property.id, userSubscriptionId);
      console.log('enable snaglist', response)
      setLoading(false);
      if (!response.error) {
        setIsSnagListEnabled(true);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error enabling snag list:", error);
      setLoading(false);
      toast.error("Failed to enable snag list. Please try again later.");
    }
  };

  const checkSnagList = async () => {
    try {
      const response = await PropertyService.checkSnagList(props.property.id, userSubscriptionId);
      
      console.log('check snaglist', response)
      console.log('check snaglist', response?.success)

      if (response?.success === true && response?.message === "Snag list is enabled for property.") {
        // Snag list is enabled, update the state
        setIsSnagListEnabled(true);
      } else {
        // Snag list is not enabled
        setIsSnagListEnabled(false);
      }
    } catch (error) {
      console.error("Error checking snag list:", error);
      toast.error("Failed to check snag list. Please try again later.");
    }
  };
  

  const updateOfferStatus = async (formData) => {
    setLoading(true);
    const formResponse = await PropertyService.updateOffer(formData);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.message) {
      props.responseHandler(formResponse.message, true);
      setTimeout(() => {
        history.go(0);
      }, 1000);
    }
  };

  const acceptOfferHandler = async (offerId) => {
    await updateOfferStatus({
      offerId,
      status: OFFER_STATUS.ACCEPTED,
      reason: "",
    });
  };

  const rejectOfferHandler = async (e) => {
    e.preventDefault();

    await updateOfferStatus({
      offerId,
      status: OFFER_STATUS.REJECTED,
      reason: offerRejectReason,
    });
  };

  const handleRejectOfferButtonClick = (id) => {
    setOfferId(id);
  };

  const handleSnagListFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formResponse = await PropertyService.updateSnagList({
      offerId: snagOfferId,
      snagList: snagListFormData,
      isApprovedByAgent: agentApprove,
    });
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.id) {
      props.responseHandler("Snaglist updated successfully", true);
      setTimeout(() => {
        history.go(0);
      }, 1000);
    }
  };

  const handleSnagResultChange = (index) => {
    const updatedFormData = [...snagListFormData];
    updatedFormData[index].result = updatedFormData[index]?.result
      ? !updatedFormData[index].result
      : true;
    setSnagListFormData(updatedFormData);
  };

  const handleSnagCommentChange = (index, comment) => {
    const updatedFormData = [...snagListFormData];
    updatedFormData[index].comment = comment;
    setSnagListFormData(updatedFormData);
  };

  const agentApproveCheckHandler = () => {
    setAgentApprove(!agentApprove);
  };

  const handleSnagListButtonClick = (id) => {
    setSnagOfferId(id);
  };

  useEffect(() => {
    if (props?.property?.productOffers) {
      setList(props.property.productOffers);
    }
    checkSubscriptionDetails();
    checkSnagList();
  }, [props.property]);

  useEffect(() => {
    if (snagOfferId && list.length > 0) {
      let productSnagList;
      let productSnagListItem;

      const productOffer = list.find((offer) => offer.id === snagOfferId);
      if (productOffer?.productSnagList) {
        productSnagList = productOffer.productSnagList;
        setAgentApprove(productSnagList.agentApproved);
        setIsApprovedByAgent(productSnagList.agentApproved);
        setIsApprovedByCustomer(productSnagList.customerApproved);
      } else {
        setAgentApprove(false);
        setIsApprovedByCustomer(false);
        setIsApprovedByAgent(false);
      }

      const initialSnagListFormData = SNAG_LIST.map((snagList) => {
        if (productSnagList?.productSnagListItems?.length > 0) {
          productSnagListItem = productSnagList.productSnagListItems.find(
            (item) => item.snagKey === snagList.value
          );
        }

        return {
          value: snagList.value,
          result: productSnagListItem?.snagValue
            ? productSnagListItem.snagValue
            : false,
          comment: productSnagListItem?.ac ? productSnagListItem.ac : "",
          customerComment: productSnagListItem?.cc
            ? productSnagListItem.cc
            : "",
        };
      });

      setSnagListFormData(initialSnagListFormData);
    }
  }, [snagOfferId, list]);

  return (
    <div className="ltn__myaccount-tab-content-inner">
      <h4 className="title-2">Offers</h4>
      <div className="ltn__my-properties-table table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">{process.env.REACT_APP_CUSTOMER_ENTITY_LABEL}</th>
              <th scope="col" />
              <th scope="col">Amount</th>
              <th scope="col">Notes</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {list && list.length === 0 ? (
              <tr>
                <td className="no-data">No Offers!</td>
              </tr>
            ) : (
              list.map((element, i) => (
                <tr key={i}>
                  <td className="ltn__my-properties-img go-top">
                    {element.user.firstName} {element.user.lastName}
                  </td>
                  <td></td>
                  <td>{formatPrice(element.amount)}</td>
                  <td>{element.notes}</td>
                  <td>
                    {element.status}
                    {element.status === OFFER_STATUS.REJECTED &&
                    element?.rejectReason
                      ? ` - Reason: ${element.rejectReason}`
                      : ""}
                  </td>
                  <td>
                    {element?.status === OFFER_STATUS.PENDING && (
                      <div>
                        <button
                          className="acceptBtn"
                          onClick={() => acceptOfferHandler(element.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="rejectBtn"
                          data-bs-toggle="modal"
                          data-bs-target="#ltn_offer_status_modal"
                          onClick={() =>
                            handleRejectOfferButtonClick(element.id)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {element?.status === OFFER_STATUS.ACCEPTED && (
                      isSnagListEnabled ? (
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#ltn_snag_list_modal"
                          onClick={() => handleSnagListButtonClick(element.id)}
                        >
                          Snag List
                        </button>
                      ) : (
                        <button
                          onClick={enableSnagList}
                          disabled={!isSnagListSubscribed || loading}
                        >
                          {loading ? "Enabling..." : "Enable Snag List"}
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="ltn__modal-area ltn__add-to-cart-modal-area----">
          <div className="modal show" id="ltn_offer_status_modal" tabIndex={-1}>
            <div className="modal-dialog modal-md" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    ref={closeModal}
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
                            <h4>Reject Offer</h4>
                            <form
                              className="ltn__form-box"
                              onSubmit={rejectOfferHandler}
                            >
                              <textarea
                                placeholder="Reason to reject offer"
                                value={offerRejectReason}
                                onChange={(e) =>
                                  setOfferRejectReason(e.target.value)
                                }
                              />

                              <div className="btn-wrapper mt-0">
                                <button
                                  className="theme-btn-1 btn btn-full-width-2"
                                  type="submit"
                                >
                                  Reject
                                </button>
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
                                          {
                                            process.env
                                              .REACT_APP_AGENT_ENTITY_LABEL
                                          }{" "}
                                          Comments( area / damage etc..)
                                        </th>
                                        <th scope="col">
                                          {
                                            process.env
                                              .REACT_APP_CUSTOMER_ENTITY_LABEL
                                          }{" "}
                                          Comments( area / damage etc..)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {SNAG_LIST &&
                                        SNAG_LIST.length > 0 &&
                                        SNAG_LIST.map((element, index) =>
                                          isApprovedByAgent &&
                                          isApprovedByCustomer ? (
                                            <tr key={index}>
                                              <td>
                                                <div className="input-item">
                                                  <label>{element.label}</label>
                                                </div>
                                              </td>
                                              <td>
                                                <div className="input-item">
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      snagListFormData[index]
                                                        ? snagListFormData[
                                                            index
                                                          ].result
                                                        : false
                                                    }
                                                    readOnly
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                {snagListFormData[index]
                                                  ?.comment
                                                  ? snagListFormData[index]
                                                      .comment
                                                  : "N/A"}
                                              </td>
                                              <td>
                                                {snagListFormData[index]
                                                  ?.customerComment
                                                  ? snagListFormData[index]
                                                      .customerComment
                                                  : "N/A"}
                                              </td>
                                            </tr>
                                          ) : (
                                            <tr key={index}>
                                              <td>
                                                <div className="input-item">
                                                  <label>{element.label}</label>
                                                </div>
                                              </td>
                                              <td>
                                                <div className="input-item">
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      snagListFormData[index]
                                                        ? snagListFormData[
                                                            index
                                                          ].result
                                                        : false
                                                    }
                                                    onChange={() =>
                                                      handleSnagResultChange(
                                                        index
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                <div className="input-item">
                                                  <textarea
                                                    value={
                                                      snagListFormData[index]
                                                        ?.comment
                                                        ? snagListFormData[
                                                            index
                                                          ].comment
                                                        : ""
                                                    }
                                                    onChange={(e) =>
                                                      handleSnagCommentChange(
                                                        index,
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                {snagListFormData[index]
                                                  ?.customerComment
                                                  ? snagListFormData[index]
                                                      .customerComment
                                                  : "N/A"}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                    </tbody>
                                  </table>
                                </div>
                                {isApprovedByAgent && isApprovedByCustomer ? (
                                  <button
                                    type="button"
                                    className="close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    Close
                                  </button>
                                ) : (
                                  <div>
                                    <div className="row mb-50">
                                      <div className="col-md-12">
                                        <div className="input-item">
                                          <label>
                                            Approve Snaglist, if all above
                                            points are accepted.
                                          </label>
                                          <div className="input-item">
                                            <input
                                              type="checkbox"
                                              checked={agentApprove}
                                              onChange={
                                                agentApproveCheckHandler
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      className="theme-btn-1 btn btn-full-width-2"
                                      type="submit"
                                    >
                                      {loading ? (
                                        <div className="lds-ring snagList">
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                        </div>
                                      ) : (
                                        "Submit"
                                      )}
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
    </div>
  );
}
