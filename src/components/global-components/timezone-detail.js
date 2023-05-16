import React, { useState, useEffect } from "react";
import axios from "axios";
import ResponseHandler from "./respones-handler";
import Select from "react-select";
import timezoneJson from "../../timezones.json";
import { USER_TYPE } from "../../constants";

export default function TimezoneDetail(props) {
    const userDefaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [timezone, setTimezone] = useState(userDefaultTimezone);
    const [loading, setLoading] = useState();
    const [success, setSuccess] = useState();
    const [errors, setErrors] = useState();
    const token = JSON.parse(localStorage.getItem(props.type === USER_TYPE.CUSTOMER ? "customerToken" : "agentToken"));

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
        setTimezone(jsonData?.timezone ? jsonData.timezone : userDefaultTimezone);
    };

    const updateProfileTimezone = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        let formdata = new FormData();
        formdata.append("timezone", timezone);
        
        await axios.put(`${process.env.REACT_APP_API_URL}/user/update-timezone`, formdata, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            if (response?.status && response.status !== 200) {
                setErrorHandler(
                  "Unable to update timezone, please try again later"
                );
            } else {
                setSuccessHandler("Timezone update successfully");
                localStorage.setItem("userTimezone", JSON.stringify(timezone));
            }
    
            setLoading(false);
            return response.data;
        })
        .catch((error) => {
            setErrorHandler("Unable to update timezone, please try again later");
            setLoading(false);
        });
    };

    const setErrorHandler = (msg) => {
        setErrors([{ msg, param: "form" }]);
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
        getUser();
    }, []);

    return (
        <div>
            <h4 className="title-2 mt-100">Update Timezone</h4>
            <form onSubmit={updateProfileTimezone}>
                <ResponseHandler errors={errors} success={success} />
                <div className="row">
                    <div className="col-md-12">
                        <Select
                            classNamePrefix="custom-select"
                            options={timezoneJson}
                            onChange={(e) => setTimezone(e.value)}
                            value={timezoneJson.find((tz) => tz.value === timezone)}
                            required
                        />
                    </div>
                </div>
                <div className="btn-wrapper">
                    <button
                    type="submit"
                    className="btn theme-btn-1 btn-effect-1 text-uppercase"
                    >
                    {loading ? (
                        <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        </div>
                    ) : (
                        "Update"
                    )}
                    </button>
                </div>
            </form>
        </div>
    );
}
