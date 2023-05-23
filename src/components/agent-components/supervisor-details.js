import React, { useState, useEffect } from "react";
import axios from "axios";
import ResponseHandler from "../global-components/respones-handler";

export default function SupervisorDetails() {
    const [supervisorId, setSupervisorId] = useState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loadingSupervisor, setLoadingSupervisor] = useState();
    const [successSupervisor, setSuccessSupervisor] = useState();
    const [errorSupervisor, setErrorSupervisor] = useState();

    const token = JSON.parse(localStorage.getItem("agentToken"));
    const getSupervisor = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/agent/user/supervisor`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const jsonData = await response.json();
        if (jsonData?.userId) {
            setSupervisorId(jsonData.userId);
            setFirstName(jsonData.user.firstName);
            setLastName(jsonData.user.lastName);
            setEmail(jsonData.user.email);
            setPhoneNumber(jsonData.user.phoneNumber);
        }
    };

    const supervisorSubmitHandler = async (e) => {
        e.preventDefault();
        setLoadingSupervisor(true);

        const requestUrl = supervisorId ? "update-supervisor" : "create-supervisor";
        const formResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/agent/user/${requestUrl}`,
            {
                id: supervisorId,
                firstName,
                lastName,
                email,
                phoneNumber
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            if (supervisorId && response?.status !== 200) {
                setErrorHandler(
                    "Unable to update supervisor, please try again later"
                );
            } else if (response?.status !== 201) {
                setErrorHandler(
                    "Unable to create supervisor, please try again later"
                );
            }
    
            // console.log("supervisor-response", response);
    
            return response.data;
        })
        .catch((error) => {
            console.log("supervisor-error", error);
            if (error?.response?.data?.errors) {
                setErrorHandler(error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) {
                setErrorHandler(error.response.data.message);
            } else {
                setErrorHandler(
                    supervisorId ? "Unable to update supervisor, please try again later" : "Unable to create supervisor, please try again later"
                );
            }
        });
    
        setLoadingSupervisor(false);
        if (formResponse) {
            setSuccessHandler(supervisorId ? "Supervisor updated successfully" : "Supervisor created successfully");
        }
    };

    const setErrorHandler = (msg, param = "form", fullError = false) => {
        setErrorSupervisor(fullError ? msg : [{ msg, param }]);
        setTimeout(() => {
        setErrorSupervisor([]);
        }, 3000);
        setSuccessSupervisor("");
    };

    const setSuccessHandler = (msg) => {
        setSuccessSupervisor(msg);
        setTimeout(() => {
        setSuccessSupervisor("");
        }, 3000);

        setErrorSupervisor([]);
    };

    useEffect(() => {
        getSupervisor();
    }, []);

    return (
            <div>
                <h4 className="title-2 mt-100">Supervisor Details</h4>
                <form onSubmit={supervisorSubmitHandler}>
                <ResponseHandler errors={errorSupervisor} success={successSupervisor} />
                <div className="row">
                    <div className="col-md-6">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="ltn__name"
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                            defaultValue={firstName}
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="ltn__name"
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                            defaultValue={lastName}
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email*"
                            readOnly={supervisorId}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            defaultValue={phoneNumber}
                        />
                    </div>
                </div>
                <div className="btn-wrapper">
                    <button
                    type="submit"
                    className="btn theme-btn-1 btn-effect-1 text-uppercase"
                    >
                    {loadingSupervisor ? (
                        <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        </div>
                    ) : (
                        "Update Supervisor Details"
                    )}
                    </button>
                </div>
                </form>
            </div>
    );
}
