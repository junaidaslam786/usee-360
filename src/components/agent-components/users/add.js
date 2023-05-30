import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import ResponseHandler from "../../global-components/respones-handler";
import { 
    getLoginToken,
    getUserDetailsFromJwt,
} from "../../../utils";
import { AGENT_TYPE, AGENT_TYPES } from "../../../constants";
import Layout from "../layouts/layout";

export default function Add() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState();
    const [success, setSuccess] = useState();
    const [errors, setErrors] = useState();
    const token = getLoginToken();
    const userDetail = getUserDetailsFromJwt();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const selectedRole = userDetail.agent.agentType === AGENT_TYPE.MANAGER ? AGENT_TYPES[1] : role;
        const formResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/agent/user/create`,
            {
                firstName,
                lastName,
                email,
                phoneNumber,
                role: selectedRole.value,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            if (response?.status !== 201) {
                setErrorHandler("Unable to create user, please try again later");
            }
    
            // console.log("user-response", response);
    
            return response.data;
        })
        .catch((error) => {
            console.log("user-error", error);
            if (error?.response?.data?.errors) {
                setErrorHandler(error.response.data.errors, "error", true);
            } else if (error?.response?.data?.message) {
                setErrorHandler(error.response.data.message);
            } else {
                setErrorHandler("Unable to create user, please try again later");
            }
        });
    
        setLoading(false);
        if (formResponse?.id) {
            setSuccessHandler("User created successfully");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhoneNumber("");
            setRole(AGENT_TYPES.find((agentType) => agentType.value === AGENT_TYPE.MANAGER));
        }
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

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="ltn__myaccount-tab-content-inner mb-50">
                <ResponseHandler errors={errors} success={success}/>
                <h4 className="title-2">Add User</h4>
                <div className="row">
                    <div className="col-md-6">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="ltn__name"
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="ltn__name"
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email*"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                            required
                        />
                    </div>
                    {
                        userDetail.agent.agentType !== AGENT_TYPE.STAFF && (
                            <div className="col-md-6">
                                <label>Role</label>
                                {
                                    userDetail.agent.agentType === AGENT_TYPE.AGENT && (
                                        <Select
                                            classNamePrefix="custom-select"
                                            options={AGENT_TYPES}
                                            onChange={(e) => setRole(e)}
                                            value={role}
                                            required
                                        />
                                    )
                                }

                                {
                                    userDetail.agent.agentType === AGENT_TYPE.MANAGER && ( 
                                        <Select
                                            classNamePrefix="custom-select"
                                            options={[AGENT_TYPES[1]]}
                                            value={AGENT_TYPES[1]}
                                            onChange={(e) => setRole(e)}
                                            required
                                        />
                                    )
                                }
                            </div>
                        )
                    }
                    
                </div>
                <div className="btn-wrapper">
                    <button
                        type="submit"
                        className="btn theme-btn-1 btn-effect-1 text-uppercase"
                    >
                        {
                            loading ? (
                                <div className="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                </div>
                            ) : (
                                "Submit"
                            )
                        }
                    </button>
                </div>
            </form>
        </Layout>
    );
}
