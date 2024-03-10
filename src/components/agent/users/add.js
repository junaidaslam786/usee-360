import React, { useState, useEffect } from "react";
import Select from "react-select";
import { 
    getUserDetailsFromJwt,
} from "../../../utils";
import { AGENT_TYPE, AGENT_TYPES, AGENT_USER_ACCESS_TYPE } from "../../../constants";
import UserService from "../../../services/agent/user";
import { useHistory } from "react-router-dom";

export default function Add(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("");
    const [accessLevelTypes, setAccessLevelsTypes] = useState(AGENT_USER_ACCESS_TYPE);
    const [accessLevels, setAccessLevels] = useState([]);
    const [loading, setLoading] = useState();
    const userDetail = getUserDetailsFromJwt();

    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedRole = userDetail.agent.agentType === AGENT_TYPE.MANAGER ? AGENT_TYPES[1] : role;
        let formdata = new FormData();
        formdata.append("firstName", firstName);
        formdata.append("lastName", lastName);
        formdata.append("email", email);
        formdata.append("phoneNumber", phoneNumber);
        formdata.append("role", selectedRole.value);
        formdata.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

        if (accessLevels && accessLevels.length > 0) {
            for (let i = 0; i < accessLevels.length; i++) {
              formdata.append(`accessLevels[${i}]`, accessLevels[i].value);
            }
        }
        
        setLoading(true);
        const formResponse = await UserService.add(formdata);
        setLoading(false);

        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        if (formResponse?.id) {
            props.responseHandler("User created successfully", true);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhoneNumber("");
            setRole(AGENT_TYPES.find((agentType) => agentType.value === AGENT_TYPE.MANAGER));
            setAccessLevels([]);
            history.push('/agent/users');
        }
    };

    useEffect(() => {
        if (userDetail.agent.agentType === AGENT_TYPE.MANAGER) {
            const accessLevelTypes = userDetail?.agentAccessLevels ? AGENT_USER_ACCESS_TYPE.filter((item) =>
                userDetail.agentAccessLevels.some((accessItem) => accessItem.accessLevel === item.value)
            ) : [];

            setAccessLevelsTypes(accessLevelTypes);
        }
    }, []);

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className="ltn__myaccount-tab-content-inner mb-50">
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
                    
                    {
                        userDetail.agent.agentType !== AGENT_TYPE.STAFF && (
                            <div className="col-md-6">
                                <label>Access To</label>
                                <Select 
                                    classNamePrefix="custom-select"
                                    isMulti
                                    options={accessLevelTypes} 
                                    onChange={(e) => setAccessLevels(e)}
                                    value={accessLevels}
                                />
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
        </React.Fragment>
    );
}
