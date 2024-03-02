

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
    setSnagOfferId(id);
    // Additional logic can be added here if needed
  };

  useEffect(() => {
    setProductId(props.property?.id || 0);
    setList(
      props.property?.productOffers?.filter(
        (offer) => offer?.user?.id === userDetail.id
      ) || []
    );
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
      <div className="modal" id="ltn_snag_list_modal" tabIndex={-1}>
        {/* Modal content */}
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
              {/* Snag List Form */}
              <div>
                <h4>Snag List Items</h4>
                <form onSubmit={handleSnagListFormSubmit}>
                  {/* List of Snag Items */}
                  {/* ...Display and Edit Snag Items */}
                  <button type="submit">
                    {loading ? "Updating..." : "Update Snag List"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
