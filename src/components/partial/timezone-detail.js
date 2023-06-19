import React, { useState, useEffect } from "react";
import Select from "react-select";
import timezoneJson from "../../timezones.json";
import { setUserTimezone } from "../../utils";
import ProfileService from "../../services/profile";

export default function TimezoneDetail(props) {
    const userDefaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [timezone, setTimezone] = useState(userDefaultTimezone);
    const [loading, setLoading] = useState();

    const updateProfileTimezone = async (e) => {
        e.preventDefault();

        setLoading(true);
        const formResponse = await ProfileService.updateTimezone(timezone);
        setLoading(false);
    
        if (formResponse?.error && formResponse?.message) {
            props.responseHandler(formResponse.message);
            return;
        }

        props.responseHandler("Timezone update successfully", true);
        setUserTimezone(timezone);
    };

    useEffect(() => {
        if (props?.user) {
            setTimezone(props.user.timezone);
            setUserTimezone(props.user.timezone);
        }
    }, [props.user]);

    return (
        <div>
            <h4 className="title-2 mt-100">Update Your Timezone</h4>
            <form onSubmit={updateProfileTimezone}>
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
                    {
                        loading ? (
                            <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            </div>
                        ) : (
                            "Update"
                        )
                    }
                    </button>
                </div>
            </form>
        </div>
    );
}
