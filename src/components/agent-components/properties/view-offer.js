import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ResponseHandler from '../../global-components/respones-handler';
import { OFFER_STATUS, SNAG_LIST, DEFAULT_CURRENCY } from "../../../constants";
import { useHistory } from 'react-router';

export default function ViewOffer(props) {
    const [list, setList] = useState([]);
    const [offerId, setOfferId] = useState(0);
    const [snagOfferId, setSnagOfferId] = useState(0);
    const [offerRejectReason, setOfferRejectReason] = useState("");
    const [errors, setErrors] = useState([]);
    const [rejectErrors, setRejectErrors] = useState([]);
    const [snagErrors, setSnagErrors] = useState([]);
    const [success, setSuccess] = useState("");
    const [rejectSuccess, setRejectSuccess] = useState("");
    const [snagSuccess, setSnagSuccess] = useState("");
    const [snagListFormData, setSnagListFormData] = useState([]);
    const [agentApprove, setAgentApprove] = useState(false);
    const [snagListLoading, setSnagListLoading] = useState(false);
    const [isApprovedByCustomer, setIsApprovedByCustomer] = useState(false);
    const [isApprovedByAgent, setIsApprovedByAgent] = useState(false);
    
    const closeModal = useRef(null);
    const history = useHistory();

    const token = JSON.parse(localStorage.getItem("agentToken"));

    const updateOfferStatus = async (formData) => {
        const responseHandlerType = formData.status === OFFER_STATUS.REJECTED ? "reject" : "offer";
        const formResponse = await axios.post(`${process.env.REACT_APP_API_URL}/property/agent/update-offer`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (response?.status !== 200) {
                setErrorHandler(responseHandlerType, "Unable to update offer status, please try again later");
            }

            // console.log('update-offer-response', response);

            return response.data;
        }).catch(error => {
            console.log('update-offer-error', error);
            if (error?.response?.data?.errors) {
                setErrorHandler(responseHandlerType, error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) { 
                setErrorHandler(responseHandlerType, error.response.data.message);
            } else {
                setErrorHandler(responseHandlerType, "Unable to update offer status, please try again later");
            }
        });

        if (formResponse?.success && formResponse?.message) {
            setSuccessHandler(responseHandlerType, formResponse.message);
            setTimeout(() => {
                history.go(0);
            }, 1000);
        }
    };

    const acceptOfferHandler = async (offerId) => {
        const formData = {
            offerId,
            status: OFFER_STATUS.ACCEPTED,
            reason: ""
        }
        await updateOfferStatus(formData);
    }

    const rejectOfferHandler = async (e) => {
        e.preventDefault();

        const formData = {
            offerId,
            status: OFFER_STATUS.REJECTED,
            reason: offerRejectReason
        }
        await updateOfferStatus(formData);
    }

    const handleRejectOfferButtonClick = (id) => {
        setOfferId(id);
    };

    const handleSnagListFormSubmit = async (e) => {
        e.preventDefault();
        setSnagListLoading(true);

        const formResponse = await axios.post(`${process.env.REACT_APP_API_URL}/property/agent/snag-list`, {
            offerId: snagOfferId,
            snagList: snagListFormData,
            isApprovedByAgent: agentApprove
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (response?.status !== 200) {
                setErrorHandler('snag', "Unable to update snag list, please try again later");
            }

            console.log('snag-response', response);

            return response.data;
        }).catch(error => {
            console.log('snag-error', error);
            if (error?.response?.data?.errors) {
                setErrorHandler('snag', error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) { 
                setErrorHandler('snag', error.response.data.message);
            } else {
                setErrorHandler('snag', "Unable to update snag list, please try again later");
            }
        });
        setSnagListLoading(false);

        if (formResponse?.id) {
            setSuccessHandler('snag', "Snaglist updated successfully");
            setTimeout(() => {
                history.go(0);
            }, 1000);
        }
    };

    const handleSnagResultChange = (index) => {
        const updatedFormData = [...snagListFormData];
        updatedFormData[index].result = updatedFormData[index]?.result ? !updatedFormData[index].result : true;
        setSnagListFormData(updatedFormData);
    }

    const handleSnagCommentChange = (index, comment) => {
        const updatedFormData = [...snagListFormData];
        updatedFormData[index].comment = comment;
        setSnagListFormData(updatedFormData);
    }

    const agentApproveCheckHandler = () => {
        setAgentApprove(!agentApprove);
    };

    const handleSnagListButtonClick = (id) => {
        setSnagOfferId(id);
    };

    const setErrorHandler = (type = 'offer', msg, param = "form", fullError = false) => {
        if (type === 'snag') {
            setSnagErrors(fullError ? msg : [{ msg, param }])
            setTimeout(() => {
                setSnagErrors([]);
            }, 3000);
            setSnagSuccess("");
        } else if (type === 'reject') {
            setRejectSuccess(fullError ? msg : [{ msg, param }])
            setTimeout(() => {
                setRejectSuccess([]);
            }, 3000);
            setRejectSuccess("");
        } else {
            setErrors(fullError ? msg : [{ msg, param }])
            setTimeout(() => {
                setErrors([]);
            }, 3000);
        }
    };

    const setSuccessHandler = (type = 'offer', msg) => {
        if (type === 'snag') {
            setSnagSuccess(msg);
            setTimeout(() => {
                setSnagSuccess("");
            }, 3000);

            setSnagErrors([]);
        } else if (type === 'reject') {
            setRejectSuccess(msg);
            setTimeout(() => {
                setRejectSuccess("");
            }, 3000);

            setRejectErrors([]);
        } else {
            setSuccess(msg);
            setTimeout(() => {
                setSuccess("");
            }, 3000);
    
            setErrors([]);
        }
    };

    useEffect(() => {
        if (props?.property?.productOffers) {
            setList(props.property.productOffers);
        }
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
                setIsApprovedByCustomer(productSnagList.customerApproved)
            } else {
                setAgentApprove(false);
                setIsApprovedByCustomer(false);
                setIsApprovedByAgent(false);
            }

            const initialSnagListFormData = SNAG_LIST.map((snagList) => {
                if (productSnagList?.productSnagListItems?.length > 0) {
                    productSnagListItem = productSnagList.productSnagListItems.find((item) => item.snagKey === snagList.value);
                }
                
                return {
                    value: snagList.value,
                    result: productSnagListItem?.snagValue ? productSnagListItem.snagValue : false,
                    comment: productSnagListItem?.ac ? productSnagListItem.ac : "",
                    customerComment: productSnagListItem?.cc ? productSnagListItem.cc :"",
                }
            });
            console.log('initialSnagListFormData', initialSnagListFormData);
            setSnagListFormData(initialSnagListFormData);
        }
    }, [snagOfferId]);

    return (
        <div className="ltn__myaccount-tab-content-inner">
            <h4 className="title-2">Offers</h4>
            <ResponseHandler errors={errors} success={success}/>
            <div className="ltn__my-properties-table table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL }</th>
                        <th scope="col"/>
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
                                        { element.user.firstName } { element.user.lastName }
                                    </td>
                                    <td></td>
                                    <td>{DEFAULT_CURRENCY} { element.amount }</td>
                                    <td>{ element.notes }</td>
                                    <td>
                                        { element.status }
                                        { (element.status === OFFER_STATUS.REJECTED && element?.rejectReason) ? ` - Reason: ${element.rejectReason}` : "" }
                                    </td>
                                    <td>
                                    {
                                        element?.status === OFFER_STATUS.PENDING && (
                                            <div>
                                                <button className="acceptBtn" onClick={() => acceptOfferHandler(element.id) }>
                                                    Accept
                                                </button>
                                                <button
                                                    className="rejectBtn"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#ltn_offer_status_modal"
                                                    onClick={() => handleRejectOfferButtonClick(element.id)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )
                                    }
                                    {
                                        element?.status === OFFER_STATUS.ACCEPTED && (
                                            <button
                                                data-bs-toggle="modal"
                                                data-bs-target="#ltn_snag_list_modal"
                                                onClick={() => handleSnagListButtonClick(element.id)}
                                            >
                                                Snag List
                                            </button>
                                        )
                                    }
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="ltn__modal-area ltn__add-to-cart-modal-area----">
                    <div
                        className="modal show"
                        id="ltn_offer_status_modal"
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
                                        <h4>Reject Offer</h4>
                                        <ResponseHandler errors={rejectErrors} success={rejectSuccess}/>
                                        <form
                                            className="ltn__form-box"
                                            onSubmit={rejectOfferHandler}
                                        >
                                            <textarea
                                                placeholder="Reason to reject offer"
                                                value={ offerRejectReason }
                                                onChange={(e) => setOfferRejectReason(e.target.value)}
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
                    <div
                        className="modal show"
                        id="ltn_snag_list_modal"
                        tabIndex={-1}
                    >
                        <div className="modal-dialog modal-dialog-large modal-md" role="document">
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
                                                                    <b>{ isApprovedByCustomer ? "Approved by customer" : "Not yet approved by customer" }</b>
                                                                </div>
                                                                <div className="ltn__my-properties-table table-responsive">
                                                                    <table className="table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th scope="col">Type</th>
                                                                                <th scope="col">Result</th>
                                                                                <th scope="col">{process.env.REACT_APP_AGENT_ENTITY_LABEL} Comments( area / damage etc..)</th>
                                                                                <th scope="col">{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Comments( area / damage etc..)</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                SNAG_LIST && SNAG_LIST.length > 0 && (
                                                                                    SNAG_LIST.map((element, index) => (
                                                                                        (isApprovedByAgent && isApprovedByCustomer) ? (
                                                                                            <tr key={index}>
                                                                                                <td>
                                                                                                    <div className="input-item">
                                                                                                        <label>{ element.label }</label>
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div className="input-item">
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            checked={ snagListFormData[index] ? snagListFormData[index].result : false }
                                                                                                            readOnly
                                                                                                        />
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td>
                                                                                                    { snagListFormData[index]?.comment ? snagListFormData[index].comment : "N/A" }
                                                                                                </td>
                                                                                                <td>
                                                                                                    { snagListFormData[index]?.customerComment ? snagListFormData[index].customerComment : "N/A" }
                                                                                                </td>
                                                                                            </tr>
                                                                                        ) : (
                                                                                            <tr key={index}>
                                                                                                <td>
                                                                                                    <div className="input-item">
                                                                                                        <label>{ element.label }</label>
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div className="input-item">
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            checked={ snagListFormData[index] ? snagListFormData[index].result : false }
                                                                                                            onChange={() => handleSnagResultChange(index) }
                                                                                                        />
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div className="input-item">
                                                                                                        <textarea 
                                                                                                            value={ snagListFormData[index]?.comment ? snagListFormData[index].comment : "" }
                                                                                                            onChange={ (e) => handleSnagCommentChange(index, e.target.value) }
                                                                                                        />
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td>
                                                                                                    { snagListFormData[index]?.customerComment ? snagListFormData[index].customerComment : "N/A" }
                                                                                                </td>
                                                                                            </tr>
                                                                                        )
                                                                                    ))
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                {
                                                                    (isApprovedByAgent && isApprovedByCustomer) ? (
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
                                                                                        <label>Approve Snaglist, if all above points are accepted.</label>
                                                                                        <div className="input-item">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={ agentApprove }
                                                                                                onChange={ agentApproveCheckHandler }
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <ResponseHandler errors={snagErrors} success={snagSuccess}/>
                                                                            <button
                                                                                className="theme-btn-1 btn btn-full-width-2"
                                                                                type="submit"
                                                                            >
                                                                                {snagListLoading ? (
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
                                                                    )
                                                                }
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
