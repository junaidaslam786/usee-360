import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import Select from "react-select";
import Layout from "./layouts/layout";
import { AGENT_TYPE } from "../../constants";

export default function MyProperties() {
  const [page, setPage] = useState(1);
  const [propertyIdToDelete, setPropertyIdToDelete] = useState(0);
  const [removeReason, setRemoveReason] = useState();
  const [notes, setNotes] = useState("");
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [removeReasons, setRemoveReasons] = useState([]);
  const [agentType, setAgentType] = useState(AGENT_TYPE.AGENT);
  const closeModal = useRef(null);

  const token = JSON.parse(localStorage.getItem("agentToken"));
  const loadAllList = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/property/list?page=${page}&size=10`,
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

  const getUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await response.json();
    setAgentType(jsonData.agent.agentType);
  };

  const loadRemoveReasons = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/property/list-removal-reasons`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await response.json();
  };

  const handleDeleteButtonClick = (id) => {
    setPropertyIdToDelete(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!removeReason) {
      setError("Please select reason");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      setSuccess("Removal request sending in-progress");
      const formResponse = await axios
        .post(
          `${process.env.REACT_APP_API_URL}/property/removal-request`,
          {
            propertyId: propertyIdToDelete,
            reasonId: removeReason.value,
            reason: notes,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response?.status !== 200) {
            setError(
              "Unable to submit removal request property, please try again later"
            );
            setTimeout(() => {
              setError("");
            }, 3000);

            setSuccess("");
          } else {
            setError("");
            setSuccess("Removal request sent successfully");
            setTimeout(() => {
              setList(list.filter((item) => item.id !== propertyIdToDelete));
              setSuccess("");
              setRemoveReason("");
              setNotes("");
              closeModal.current.click();
            }, 3000);
          }

          // console.log("removal-request-property-response", response);

          return response.data;
        })
        .catch((error) => {
          console.log("removal-request-property-error", error);
          setError(
            "Unable to submit removal request property, please try again later"
          );
          setTimeout(() => {
            setError("");
          }, 3000);

          setSuccess("");
        });

      console.log("removal-request-final-response", formResponse);
    }
  };

  useEffect(() => {
    const fetchAllProperties = async () => {
      await loadAllList();
    };

    const fetchRemoveReasons = async () => {
      const response = await loadRemoveReasons();
      if (response)
        setRemoveReasons(
          response.map((reason) => {
            return {
              label: reason.reason,
              value: reason.id,
            };
          })
        );
    };

    fetchAllProperties();
    fetchRemoveReasons();
  }, [page]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      await getUser();
    };

    fetchUserDetails();
  }, []);

  return (
    <Layout>
      <div className="ltn__myaccount-tab-content-inner">
        <div className="ltn__my-properties-table table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">My Properties</th>
                <th scope="col" />
                <th scope="col">Date Added</th>
                {
                  agentType === AGENT_TYPE.AGENT && (
                    <React.Fragment>
                      <th scope="col">Actions</th>
                      <th scope="col">Delete</th>
                    </React.Fragment>
                  )
                }
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
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${element?.featuredImage}`}
                        alt="#"
                      />
                    </td>
                    <td>
                      <div className="ltn__my-properties-info">
                        <h6 className="mb-10 go-top">
                          <Link to={`/agent/property-details/${element.id}`}>
                            {element?.title}
                          </Link>
                        </h6>
                        <small>
                          <i className="icon-placeholder" /> {element?.address}
                        </small>
                      </div>
                    </td>
                    <td>{ element?.createdAt ? moment.utc(element.createdAt).format("MMMM D, YYYY") : "-" }</td>
                    {
                      agentType === AGENT_TYPE.AGENT && (
                        <React.Fragment>
                          <td>
                            <Link to={`/agent/edit-property/${element.id}`}>
                              Edit
                            </Link>
                          </td>
                          <td>
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#ltn_delete_property_modal"
                              onClick={() => handleDeleteButtonClick(element.id)}
                            >
                              <i className="fa-solid fa-trash-can" />
                            </button>
                          </td>
                        </React.Fragment>
                      )
                    }
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                                {error ? (
                                  <div
                                    className="alert alert-danger"
                                    role="alert"
                                  >
                                    {" "}
                                    {error}{" "}
                                  </div>
                                ) : (
                                  ""
                                )}
                                {success ? (
                                  <div
                                    className="alert alert-primary"
                                    role="alert"
                                  >
                                    {" "}
                                    {success}{" "}
                                  </div>
                                ) : (
                                  ""
                                )}
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
    </Layout>
  );
}
