import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  formatCreatedAtTimestamp,
  getLoginToken,
} from "../../../utils";
import axios from "axios";
import Modal from 'react-modal';
import ResponseHandler from "../../global-components/respones-handler";

export default function AllocatedProperties(props) {
    const [currentPage, setCurrentPage] = useState();
    const [totalPages, setTotalPages] = useState();
    const [propertyIdToDelete, setPropertyIdToDelete] = useState(0);
    const [list, setList] = useState([]);
    const [errors, setErrors] = useState("");
    const [success, setSuccess] = useState("");
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const token = getLoginToken();
    const loadAllList = async (page = 1) => {
        let response = await fetch(
        `${process.env.REACT_APP_API_URL}/property/list?user=${props.selectedUser}&page=${page}&size=10`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
        );

        response = await response.json();
        if (response?.data) {
            setList(response.data);
            setCurrentPage(parseInt(response.page));
            setTotalPages(parseInt(response.totalPage));
        }
    };

    const handleDeleteConfirm = (id) => {
        setPropertyIdToDelete(id);
        setConfirmDeleteModal(true);
    }

    const handleDeleteModalConfirm = async () => {
        await removeAllocatedProperty();
        setConfirmDeleteModal(false); // Close the modal
    }

    const handleDeleteModalCancel = () => {
        setConfirmDeleteModal(false); // Close the modal
    }

    const removeAllocatedProperty = async (e) => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/property/allocated`, 
            {
                data: {
                    "productId": propertyIdToDelete,
                    "userId": props.selectedUser
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }, 
        )
        .then((response) => {
            if (response?.status !== 200) {
                setErrorHandler("Unable to delete allocated property, please try again later");
            }

            const currentProperties = [...list];
            const deletedPropertyIndex = currentProperties.findIndex((property) => property.id === propertyIdToDelete);
            currentProperties.splice(deletedPropertyIndex, 1);

            setList(currentProperties);

            setSuccessHandler(response.data.message);
            return response.data;
        })
        .catch((error) => {
            console.log("delete-allocated-property-error", error);
            if (error?.response?.data?.errors) {
                setErrorHandler(error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) {
                setErrorHandler(error.response.data.message);
            } else {
                setErrorHandler("Unable to delete allocated property, please try again later");
            }
        });
    };

    const setErrorHandler = (msg, param = "form", fullError = false) => {
        setErrors(fullError ? msg : [{ msg, param }]);
        setTimeout(() => {
            setErrors([]);
        }, 3000);
        setSuccess("");
    };

    const setSuccessHandler = (msg) => {
        setSuccess(msg);
        setTimeout(() => {
         setSuccess("");
        }, 3000);

        setErrors([]);
    };

    useEffect(() => {
        const fetchAllProperties = async () => {
            await loadAllList();
        };

        fetchAllProperties();
    }, [props]);

    return (
        <div className="ltn__myaccount-tab-content-inner">
            <ResponseHandler errors={errors} success={success}/>
            <div className="ltn__my-properties-table table-responsive">
                <table className="table">
                    <tbody>
                        {
                            list && list.length === 0 ? (
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
                                        <td>{ element?.createdAt ? formatCreatedAtTimestamp(element.createdAt, "MMMM D, YYYY") : "-" }</td>
                                        <td>
                                            <button
                                                data-bs-toggle="modal"
                                                data-bs-target="#ltn_delete_property_modal"
                                                onClick={() => handleDeleteConfirm(element.id)}
                                            >
                                                Remove Allocation
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>

                {
                    list && list.length > 0 && (
                        <div className="ltn__pagination-area text-center">
                            <div className="ltn__pagination">
                                <ul>
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage !== 1) {
                                                    loadAllList(currentPage - 1);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-angle-double-left" />
                                        </Link>
                                    </li>
                                    {
                                        Array.from(Array(totalPages), (e, i) => {
                                            return (
                                                <li
                                                    key={i}
                                                    className={currentPage == i + 1 ? "active" : null}
                                                >
                                                    <Link
                                                        to="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            loadAllList(i + 1);
                                                        }}
                                                    >
                                                        {i + 1}
                                                    </Link>
                                                </li>
                                            );
                                        })
                                    }
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage !== totalPages) {
                                                    loadAllList(currentPage + 1);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-angle-double-right" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )
                }
            </div>

            <Modal
                isOpen={confirmDeleteModal}
                onRequestClose={() => setConfirmDeleteModal(false)}
                className="MyModal Cancelled"
                overlayClassName="MyModalOverlay"
                ariaHideApp={false}
            >
                <h2>Confirmation</h2>
                <p>Are you sure you want to remove this property?</p>
                <div className="ButtonContainer">
                    <button className="btn theme-btn-1 modal-btn-custom" onClick={handleDeleteModalConfirm}>Yes</button>
                    <button className="btn theme-btn-2 modal-btn-custom" onClick={handleDeleteModalCancel}>No</button>
                </div>
            </Modal>
        </div>
    );
}
