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

    setLoading(true);
    const formResponse = await PropertyService.makeOffer({
      productId,
      amount,
      notes,
    });
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.message) {
      props.responseHandler(formResponse.message, true);
      setAmount("");
      setNotes("");
    //   setTimeout(() => {
    //     history.go(0);
    //   }, 1000);
    }
  };

  const handleOfferDelete = async (offerId) => {
    const formResponse = await PropertyService.deleteOffer(offerId);
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    const currentOffers = [...list];
    const deletedOfferIndex = currentOffers.findIndex(
      (offer) => offer.id === offerId
    );
    currentOffers.splice(deletedOfferIndex, 1);

    setList(currentOffers);
    props.responseHandler(formResponse.message, true);
  };

  const handleSnagListFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formResponse = await PropertyService.updateSnagList({
      offerId: snagOfferId,
      snagList: snagListFormData,
      isApprovedByCustomer: customerApprove,
    });
    setLoading(false);

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

  const customerApproveCheckHandler = () => {
    setCustomerApprove(!customerApprove);
  };

  const handleSnagListButtonClick = (id) => {
    setSnagOfferId(id);
  };

  useEffect(() => {
    const currentUserId = userDetail.id;

    if (props?.property?.id) {
      setProductId(props.property.id);
    }

    if (currentUserId && props?.property?.productOffers) {
      setList(
        props.property.productOffers.filter(
          (offer) => offer?.user?.id && offer.user.id === currentUserId
        )
      );
    }
  }, [props.property, userDetail, list]);

  useEffect(() => {
    if (snagOfferId && list.length > 0) {
      let productSnagList;
      let productSnagListItem;

      const productOffer = list.find((offer) => offer.id === snagOfferId);
      if (productOffer?.productSnagList) {
        productSnagList = productOffer.productSnagList;
        setCustomerApprove(productSnagList.customerApproved);
        setIsApprovedByCustomer(productSnagList.customerApproved);
        setIsApprovedByAgent(productSnagList.agentApproved);
      } else {
        setCustomerApprove(false);
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
          comment: productSnagListItem?.cc ? productSnagListItem.cc : "",
          agentComment: productSnagListItem?.ac ? productSnagListItem.ac : "",
        };
      });
      setSnagListFormData(initialSnagListFormData);
    }
  }, [snagOfferId, list]);

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
                {loading ? (
                  <div className="lds-ring">
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
              {list && list.length === 0 ? (
                <tr>
                  <td className="no-data">No Offers!</td>
                </tr>
              ) : (
                list.map((element, i) => (
                  <tr key={i}>
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
                        <button
                          className="ml-30"
                          onClick={() => handleOfferDelete(element.id)}
                        >
                          Delete
                        </button>
                      )}
                      {element?.status === OFFER_STATUS.ACCEPTED && (
                        <button
                          className="ml-30"
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
                                      {isApprovedByAgent
                                        ? `Approved by ${process.env.REACT_APP_AGENT_ENTITY_LABEL}`
                                        : `Not yet approved by ${process.env.REACT_APP_AGENT_ENTITY_LABEL}`}
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
                                            isApprovedByCustomer &&
                                            isApprovedByAgent ? (
                                              <tr key={index}>
                                                <td>
                                                  <div className="input-item">
                                                    <label>
                                                      {element.label}
                                                    </label>
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
                                                    ?.agentComment
                                                    ? snagListFormData[index]
                                                        .agentComment
                                                    : "N/A"}
                                                </td>
                                                <td>
                                                  {snagListFormData[index]
                                                    ?.comment
                                                    ? snagListFormData[index]
                                                        .comment
                                                    : "N/A"}
                                                </td>
                                              </tr>
                                            ) : (
                                              <tr key={index}>
                                                <td>
                                                  <div className="input-item">
                                                    <label>
                                                      {element.label}
                                                    </label>
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
                                                  {snagListFormData[index]
                                                    ?.agentComment
                                                    ? snagListFormData[index]
                                                        .agentComment
                                                    : "N/A"}
                                                </td>
                                                <td>
                                                  <div className="input-item">
                                                    <textarea
                                                      value={
                                                        snagListFormData[index]
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
                                              </tr>
                                            )
                                          )}
                                      </tbody>
                                    </table>
                                  </div>
                                  {isApprovedByCustomer && isApprovedByAgent ? (
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
                                                checked={customerApprove}
                                                onChange={
                                                  customerApproveCheckHandler
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
    </div>
  );
}
