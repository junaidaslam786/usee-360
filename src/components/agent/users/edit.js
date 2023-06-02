import React, { useState, useEffect } from "react";
import Select from "react-select";
import { 
    getUserDetailsFromJwt,
} from "../../../utils";
import { AGENT_TYPE, AGENT_TYPES, AGENT_USER_ACCESS_TYPE } from "../../../constants";
import UserService from "../../../services/agent/user";

export default function Edit(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("");
    const [accessLevels, setAccessLevels] = useState([]);
    const [accessLevelTypes, setAccessLevelsTypes] = useState(AGENT_USER_ACCESS_TYPE);
    const [loading, setLoading] = useState();

    const userDetail = getUserDetailsFromJwt();

    const loadAgentUserFields = async (agentUserId) => {
        const formResponse = await UserService.detail(agentUserId);
        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        if (!formResponse) {
            props.responseHandler(["Unable to get user detail, please try again later"]);
            return;
        }

        return formResponse;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const selectedRole = userDetail.agent.agentType === AGENT_TYPE.MANAGER ? AGENT_TYPES[1] : role;

        let formdata = new FormData();
        formdata.append("userId", props.id);
        formdata.append("role", selectedRole.value);

        if (accessLevels && accessLevels.length > 0) {
            for (let i = 0; i < accessLevels.length; i++) {
              formdata.append(`accessLevels[${i}]`, accessLevels[i].value);
            }
        }

        setLoading(true);
        const formResponse = await UserService.update(formdata);
        setLoading(false);

        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        props.responseHandler("User updated successfully", true);
    };

    useEffect(() => {
        if (props?.id) {
            const fetchAgentUserDetails = async () => {
                const response = await loadAgentUserFields(props.id);

                if (response?.id) {
                    setFirstName(response.user.firstName);
                    setLastName(response.user.lastName);
                    setEmail(response.user.email);
                    setPhoneNumber(response.user.phoneNumber);
                    setRole(AGENT_TYPES.find((agentType) => agentType.value === response.agentType));
                    
                    if (response?.user?.agentAccessLevels?.length > 0 && AGENT_USER_ACCESS_TYPE.length > 0) {
                        const newAccessLevels = [];
                        response.user.agentAccessLevels.forEach((level => {
                            newAccessLevels.push(accessLevelTypes.find((access) => access.value == level.accessLevel));
                        }));
                        
                        setAccessLevels(newAccessLevels);
                    }
                }
            };

            fetchAgentUserDetails();
        }
    }, [props.id]);

    useEffect(() => {
        if (userDetail.agent.agentType === AGENT_TYPE.MANAGER) {
            const accessLevelTypes = userDetail?.agentAccessLevels ? AGENT_USER_ACCESS_TYPE.filter((item) =>
                userDetail.agentAccessLevels.some((accessItem) => accessItem.accessLevel === item.value)
            ) : [];

            setAccessLevelsTypes(accessLevelTypes);
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="ltn__myaccount-tab-content-inner mb-50">
            <h4 className="title-2">Edit User</h4>
            <div className="row">
                <div className="col-md-6">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="ltn__name"
                        placeholder="First Name"
                        value={firstName}
                        readOnly
                    />
                </div>
                <div className="col-md-6">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="ltn__name"
                        placeholder="Last Name"
                        value={lastName}
                        readOnly
                    />
                </div>
                <div className="col-md-6">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email*"
                        value={email}
                        readOnly
                    />
                </div>
                <div className="col-md-6">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        readOnly
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
    );
}
