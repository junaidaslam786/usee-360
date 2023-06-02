import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    AGENT_TYPE,
    AGENT_TYPE_LABEL
} from "../../../constants";
import Modal from 'react-modal';
import UserService from "../../../services/agent/user";

export default function List(props) {
    const [currentPage, setCurrentPage] = useState();
    const [totalPages, setTotalPages] = useState();
    const [search, setSearch] = useState();
    const [list, setList] = useState([]);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState();

    const loadAllList = async (search = '', page = 1) => {
        const response = await UserService.list({ page, search });
        if (response?.data) {
            setList(response.data);
            setCurrentPage(parseInt(response.page));
            setTotalPages(parseInt(response.totalPage));
        }
    };

    const handleDeleteConfirm = (id) => {
        setSelectedUser(id);
        setConfirmDeleteModal(true);
    }

    const handleDeleteModalConfirm = async () => {
        await deleteAgentUser();
        setConfirmDeleteModal(false); // Close the modal
    }

    const handleDeleteModalCancel = () => {
        setConfirmDeleteModal(false); // Close the modal
    }

    const deleteAgentUser = async (e) => {
        const formResponse = await UserService.delete(selectedUser);
        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        const currentUsers = [...list];
        const deletedUserIndex = currentUsers.findIndex((agent) => agent.user.id === selectedUser);
        currentUsers.splice(deletedUserIndex, 1);

        setList(currentUsers);
        props.responseHandler(formResponse.message, true);
    };

    useEffect(() => {
        const fetchAllProperties = async () => {
            await loadAllList();
        };

        fetchAllProperties();
    }, []);

    return (
        <React.Fragment>
            <div className="ltn__myaccount-tab-content-inner">
                <div className="row mb-50">
                    <div className="col-md-5">
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
                            onClick={(e) => loadAllList(search)}
                        >
                            Search
                        </button>
                    </div>
                    <div className="col-md-4">
                        <Link 
                            to={`/agent/add-user`}
                            className="btn theme-btn-1 btn-effect-1 text-uppercase ltn__z-index-m-1"
                        >
                            + Add User
                        </Link>
                    </div>
                </div>

                <div className="ltn__my-properties-table table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Users</th>
                                <th scope="col" />
                                <th scope="col">Properties Allotted</th>
                                <th scope="col">Access Level</th>
                                <th scope="col" />
                                <th scope="col">Actions</th>
                                <th scope="col" />
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list && list.length === 0 ? (
                                    <tr>
                                        <td className="no-data">No Data!</td>
                                        <td className="no-data"></td>
                                        <td className="no-data"></td>
                                        <td className="no-data"></td>
                                        <td className="no-data"></td>
                                        <td className="no-data"></td>
                                        <td className="no-data"></td>
                                    </tr>
                                ) : (
                                    list.map((element, i) => (
                                        <tr key={i}>
                                            <td className="ltn__my-properties-img go-top">
                                                <div className="myProperties-img">
                                                    <img
                                                        src={`${process.env.REACT_APP_API_URL}/${element.user.profileImage}`}
                                                        alt="profile image"
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="ltn__my-properties-info">
                                                    <h6 className="mb-10 go-top">
                                                        <Link to={`/agent/user-details/${element.user.id}`}>
                                                            { `${element.user.firstName} ${element.user.lastName}` }
                                                        </Link>
                                                    </h6>
                                                    <small>
                                                        { element?.agentType ? AGENT_TYPE_LABEL[element.agentType] : AGENT_TYPE.MANAGER }
                                                    </small>
                                                </div>
                                            </td>
                                            <td>{ element?.user?.productAllocations?.length ? element.user.productAllocations.length : 0}</td>
                                            <td>
                                                <div className="permission-tags">
                                                    { 
                                                        element?.user?.agentAccessLevels?.length > 0 ? (
                                                            element.user.agentAccessLevels.map((element, i) => (
                                                                <span key={i} className="badge">{element.accessLevel}</span>
                                                            ))
                                                        ) : (
                                                            "-"
                                                        )
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <Link to={`/agent/user-details/${element.user.id}`}>View</Link>
                                            </td>
                                            <td>
                                                <Link to={`/agent/edit-user/${element.user.id}`}>
                                                    Edit
                                                </Link>
                                            </td>
                                            <td>
                                                <button onClick={() => handleDeleteConfirm(element.user.id)}>
                                                    <i className="fa-solid fa-trash-can" />
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
                                                        loadAllList(search, currentPage - 1);
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
                                                                loadAllList(search, i + 1);
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
                    <p>Are you sure you want to delete this user?</p>
                    <div className="ButtonContainer">
                    <button className="btn theme-btn-1 modal-btn-custom" onClick={handleDeleteModalConfirm}>Yes</button>
                    <button className="btn theme-btn-2 modal-btn-custom" onClick={handleDeleteModalCancel}>No</button>
                    </div>
                </Modal>
            </div>
        </React.Fragment>
    );
}
