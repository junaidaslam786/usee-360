

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  getUserDetailsFromJwt,
  formatCreatedAtTimestamp,
} from "../../../utils";
import StripeService from "../../../services/agent/stripe-service";
import PropertyService from "../../../services/agent/property";
import { AGENT_USER_ACCESS_TYPE_VALUE } from "../../../constants";
import { useStateIfMounted } from "use-state-if-mounted";
import { FaPaw } from "react-icons/fa";
import { toast } from "react-toastify";

export default function List(props) {
  const [currentPage, setCurrentPage] = useStateIfMounted(1);
  const [totalPages, setTotalPages] = useStateIfMounted(1);
  const [search, setSearch] = useState("");
  const [propertyIdToDelete, setPropertyIdToDelete] = useState(0);
  const [removeReason, setRemoveReason] = useState(null);
  const [notes, setNotes] = useState("");
  const [list, setList] = useStateIfMounted([]);
  const [removeReasons, setRemoveReasons] = useStateIfMounted([]);
  const [carbonFootprints, setCarbonFootprints] = useState({});
  const [freeRemainingUnits, setFreeRemainingUnits] = useState(0);
  const userDetail = getUserDetailsFromJwt();
  const closeModal = useRef(null);

  const loadAllList = useCallback(async (search = "", page = 1) => {
    try {
      const response = await PropertyService.list({ search, page });
      
      if (response?.data) {
        setList(response.data);
        setCurrentPage(parseInt(response.page));
        setTotalPages(parseInt(response.totalPage));
        setFreeRemainingUnits(
          response.productSubscription?.freeRemainingUnits || 0
        );
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    }
  }, []);

  

  const fetchCarbonFootprint = async (propertyId) => {
    if (!carbonFootprints[propertyId]) {
      try {
        // Fetch user subscription details
        const subscriptionDetails = await StripeService.getUserSubscriptionDetails(userDetail?.id);
  
        // Check if the subscriptionDetails and userSubscriptions are defined
        if (!subscriptionDetails || !subscriptionDetails.userSubscriptions) {
          toast.error("Failed to retrieve subscription details.");
          return;
        }
  
        // Check if the user has subscribed to the "Carbon Footprint" feature
        const hasCarbonFootprintSubscription = subscriptionDetails.userSubscriptions.some(
          (subscription) => subscription.feature.name === "Carbon Footprint"
        );
  
        if (!hasCarbonFootprintSubscription) {
          toast.error("You haven't subscribed to the Carbon Footprint feature.");
          return;
        }
  
        // Proceed with fetching the carbon footprint data
        setCarbonFootprints((prev) => ({
          ...prev,
          [propertyId]: { loading: true },
        }));
  
        const response = await PropertyService.carbonFootprint(propertyId);
        setCarbonFootprints((prev) => ({
          ...prev,
          [propertyId]: { value: response.totalCo2SavedText },
        }));
        
      } catch (error) {
        setCarbonFootprints((prev) => ({
          ...prev,
          [propertyId]: { error: "Failed to load carbon footprint" },
        }));
        console.error("Error fetching carbon footprint:", error);
      }
    }
  };

  const handleDeleteButtonClick = (id) => {
    setPropertyIdToDelete(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!removeReason) {
      props.responseHandler(["Please select reason"]);
      return;
    }

    try {
      const formResponse = await PropertyService.removalRequest({
        productId: propertyIdToDelete,
        reasonId: removeReason.value,
        reason: notes,
      });

      if (formResponse?.error && formResponse?.message) {
        props.responseHandler(formResponse.message);
        return;
      }

      props.responseHandler("Removal request sent successfully", true);
      setTimeout(() => {
        setList(list.filter((item) => item.id !== propertyIdToDelete));
        setRemoveReason(null);
        setNotes("");
        closeModal.current.click();
      }, 3000);
    } catch (error) {
      props.responseHandler("Failed to send removal request");
    }
  };

  const canDoThis = (accessModule) => {
    return userDetail?.agentAccessLevels
      ? userDetail.agentAccessLevels.find(
          (level) => level.accessLevel === accessModule
        )
      : false;
  };

  useEffect(() => {
    const fetchAllProperties = async () => {
      await loadAllList();
    };

    const fetchRemoveReasons = async () => {
      try {
        const response = await PropertyService.listRemovalReasons();
        if (response?.error && response?.message) {
          props.responseHandler(response.message);
          return;
        }

        setRemoveReasons(
          response.map((reason) => {
            return {
              label: reason.reason,
              value: reason.id,
            };
          })
        );
      } catch (error) {
        props.responseHandler("Failed to load removal reasons");
      }
    };

    fetchAllProperties();
    fetchRemoveReasons();
  }, [loadAllList, props]);

  return (
    <div className="ltn__myaccount-tab-content-inner">
      <div className="row mb-50">
        <div className="col-md-9">
          <div className="input-item">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <button
            className="btn theme-btn-1 btn-effect-1 text-uppercase ltn__z-index-m-1"
            onClick={() => loadAllList(search)}
          >
            Search
          </button>
        </div>
      </div>

      <div className="ltn__my-properties-table table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">My Properties</th>
              <th scope="col" />
              <th scope="col">Date Added</th>
              <th scope="col"></th>
              <th scope="col">Actions</th>
              <th scope="col">Carbon Footprint</th>
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
                    <div className="myProperties-img">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${element?.featuredImage}`}
                        alt="#"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="">
                      <h6 >
                        <Link to={`/agent/property-details/${element?.id}`}>
                          {element?.title}
                        </Link>
                      </h6>
                      <small>
                        <i className="icon-placeholder" /> {element?.address}
                      </small>

                      <small>
                        <div style={{ fontStyle: "italic" }}>
                          Free remaining video call slots:{" "}
                          {element?.productSubscription?.freeRemainingUnits || 0}{" "}
                          / {element?.productSubscription?.freeTotalUnits || 0}
                        </div>
                      </small>
                    </div>
                  </td>

                  <td>
                    {element?.createdAt
                      ? formatCreatedAtTimestamp(
                          element.createdAt,
                          "MMMM D, YYYY"
                        )
                      : "-"}
                  </td>
                  <td>
                    
                    {(userDetail?.id === element?.userId ||
                      canDoThis(AGENT_USER_ACCESS_TYPE_VALUE.EDIT_PROPERTY)) && (
                      <Link to={`/agent/edit-property/${element?.id}`}>
                        Edit
                      </Link>
                    )}
                  </td>
                  <td>
                    {(userDetail?.id === element?.userId ||
                      canDoThis(AGENT_USER_ACCESS_TYPE_VALUE.DELETE_PROPERTY)) && (
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#ltn_delete_property_modal"
                        onClick={() => handleDeleteButtonClick(element?.id)}
                      >
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    )}
                  </td>
                  <td>
                    {/* Carbon Footprint Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <FaPaw
                        style={{
                          fontSize: "20px",
                          marginRight: "5px",
                          color: "green",
                        }}
                      />
                      {carbonFootprints[element.id] ? (
                        carbonFootprints[element.id].loading ? (
                          "Loading..."
                        ) : carbonFootprints[element.id].error ? (
                          <span
                            onClick={() => fetchCarbonFootprint(element.id)}
                            style={{
                              cursor: "pointer",
                              color: "#007bff",
                              textDecoration: "underline",
                            }}
                          >
                            Retry
                          </span>
                        ) : (
                          carbonFootprints[element.id].value
                        )
                      ) : (
                        <span
                          onClick={() => fetchCarbonFootprint(element.id)}
                          style={{
                            cursor: "pointer",
                            color: "#007bff",
                            textDecoration: "underline",
                          }}
                        >
                          view
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="ltn__pagination-area text-center">
          <div className="ltn__pagination">
            <ul>
              <li>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage !== 1) {
                      loadAllList(search, currentPage - 1);
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
                    className={currentPage === i + 1 ? "active" : null}
                  >
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        loadAllList(search, i + 1);
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
                      loadAllList(search, currentPage + 1);
                    }
                  }}
                >
                  <i className="fas fa-angle-double-right" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="ltn__modal-area ltn__add-to-cart-modal-area----">
          <div
            className="modal show"
            id="ltn_delete_property_modal"
            tabIndex={-1}
          >
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
                            <h4>Property Removal Request</h4>
                            <form
                              className="ltn__form-box"
                              onSubmit={handleSubmit}
                            >
                              <Select
                                classNamePrefix="custom-select"
                                options={removeReasons}
                                onChange={(e) => setRemoveReason(e)}
                                value={removeReason}
                                required
                              />
                              <textarea
                                placeholder="Notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                              />
                              <div className="btn-wrapper mt-0">
                                <button
                                  className="theme-btn-1 btn btn-full-width-2"
                                  type="submit"
                                >
                                  Send Request
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
      </div>
    </div>
  );
}


