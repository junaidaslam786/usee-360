import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Layout from "./layouts/layout";
import ResponseHandler from "../global-components/respones-handler";
import { checkTimeOver } from "../../utils";

export default function AddAppointment() {
  const [properties, setProperties] = useState([]);
  const [selectedAllocatedProperties, setSelectedAllocatedProperties] =
    useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState();

  const token = JSON.parse(localStorage.getItem("customerToken"));

  const loadPropertiesToAllocate = async () => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/home/property/list`, {
        page: 1,
        size: 100
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      property: selectedAllocatedProperties.value,
      appointmentDate: date,
      appointmentTime: time,
    };

    setLoading(true);
    const formResponse = await axios
      .post(
        `${process.env.REACT_APP_API_URL}/customer/appointment/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response?.status !== 201) {
          setErrorHandler(
            "Unable to create appointment, please try again later"
          );
        }

        // console.log("create-appointment-response", response);

        return response.data;
      })
      .catch((error) => {
        console.log("create-appointment-error", error);
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else if (error?.response?.data?.message) {
          setErrorHandler(error.response.data.message);
        } else {
          setErrorHandler(
            "Unable to create appointment, please try again later"
          );
        }
      });

    setLoading(false);
    if (formResponse) {
      setSuccessHandler("Appointment created successfully");
      setSelectedAllocatedProperties("");
      setDate("");
      setTime("");
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

  useEffect(() => {
    const fetchPropertiesToAllocate = async () => {
      const response = await loadPropertiesToAllocate();
      if (response) {
        setProperties(
          response.data.map((property) => {
            return {
              label: property.title,
              value: property.id,
            };
          })
        );
      }
    };

    fetchPropertiesToAllocate();
  }, []);

  const handleButtonClick = (event) => {
    const now = new Date();

    // Format the date and time values to be used as input values
    const dateValue = now.toISOString().slice(0, 10);
    const timeValue = now.toTimeString().slice(0, 5);
    setDate(dateValue);
    setTime(timeValue);

    if (checkTimeOver(dateValue, timeValue)) {
      setErrorHandler(
        "Time is expired. Please select another timeslot"
      );
    }
  }

  const setTimeHandler = (e) => {
    setTime(e);
    if (checkTimeOver(date, e)) {
      setErrorHandler(
        "Time is expired. Please select another timeslot"
      );
    }
  }

  const setDateHandler = (e) => {
    setDate(e);
    if (checkTimeOver(e, time)) {
      setErrorHandler(
        "Time is expired. Please select another timeslot"
      );
    }
  }

  return (
    <Layout>
      <div>
        <h4 className="title-2">Add Quick Appointment</h4>
        <div className="ltn__myaccount-tab-content-inner">
          <div className="ltn__form-box">
            <form onSubmit={handleSubmit}>
              <div className="row mb-50">
                <div className="col-md-12">
                  <div className="input-item">
                    <label>Select Property *</label>
                    <Select
                      classNamePrefix="custom-select"
                      isMulti={false}
                      options={properties}
                      onChange={(e) => setSelectedAllocatedProperties(e)}
                      value={selectedAllocatedProperties}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn theme-btn-2 request-now-btn"
                    onClick={handleButtonClick}
                  >
                    Request Now
                  </button>
                </div>
                <div className="col-md-4">
                  <div className="input-item">
                    <label>Select Date *</label>
                    <input
                      type="date"
                      onChange={(e) => setDateHandler(e.target.value)}
                      value={date}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-item">
                    <label>Choose Time *</label>
                    <input
                      type="time"
                      onChange={(e) => setTimeHandler(e.target.value)}
                      value={time}
                      required
                    />
                  </div>
                </div>
                <div className="btn-wrapper">
                  <ResponseHandler errors={errors} success={success} />
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
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
