import React, { useState, useEffect } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import Select from "react-select";
import axios from "axios";
import Layout from "./layouts/layout";
import ResponseHandler from '../global-components/respones-handler';

export default function AddAppointment() {
  const [customers, setCustomers] = useState([]);
  // const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  // const [selectedAllocatedAgent, setSelectedAllocatedAgent] = useState("");
  const [selectedAllocatedProperties, setSelectedAllocatedProperties] =
    useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState();

  const token = JSON.parse(localStorage.getItem("customerToken"));

  const loadPropertiesToAllocate = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/home/property/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
  };

  // const checkAvailability = async () => {
  //   if (!selectedAllocatedAgent || !time || !date) {
  //     return;
  //   }

  //   await axios.post(`${process.env.REACT_APP_API_URL}/agent/user/check-availability`,
  //   {
  //     "userId": selectedAllocatedAgent.value,
  //     date,
  //     time,
  //   },
  //   {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     }
  //   }).then((response) => {
  //       console.log('checkAvailability-response', response);
  //       if (!response || !response?.data?.success) {
  //         setErrorHandler("Sorry allotted person not avaiable during the selected timeslot. Please change the timeslot.");
  //       }
  //       return true;
  //   }).catch(error => {
  //     console.log('checkAvailability-error', error);
  //     setErrorHandler("Unable to check availability, please try again later.");
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let customerFirstName = "";
    let customerLastName = "";
    let customerEmail = "";
    let customerPhoneNumber = "";
    let customerId = "";
    const customer = customers.find(
      (customer) => (customer.id = selectedCustomer.value)
    );
    if (customer) {
      customerId = customer.id;
      customerFirstName = customer.firstName;
      customerLastName = customer.lastName;
      customerEmail = customer.email;
      customerPhoneNumber = customer.phoneNumber;
    } else if (selectedCustomer?.value) {
      const customerName = selectedCustomer.value.split(" ");
      customerFirstName = customerName[0];
      if (customerName.length >= 2) {
        customerLastName = customerName[1];
      }

      customerEmail = email;
      customerPhoneNumber = phone;
    }

    const formData = {
      property: selectedAllocatedProperties.value,
      appointmentDate: date,
      appointmentTime: time,
      customerId: customerId,
      customerFirstName: customerFirstName,
      customerLastName: customerLastName,
      customerPhone: customerPhoneNumber,
      customerEmail: customerEmail,
      // allotedAgent: selectedAllocatedAgent.value
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

        console.log("create-appointment-response", response);

      return response.data;
    }).catch(error => {
      console.log('create-appointment-error', error);
      if (error?.response?.data?.errors) {
        setErrorHandler(error.response.data.errors, "error", true);
      } else if (error?.response?.data?.message) { 
        setErrorHandler(error.response.data.message);
      } else {
        setErrorHandler("Unable to create appointment, please try again later");
      }
    });

    setLoading(false);
    if (formResponse) {
      setSuccessHandler("Appointment created successfully");
      // setSelectedAllocatedAgent("");
      setSelectedAllocatedProperties("");
      setDate("");
      setTime("");
      console.log("create-property-final-response", formResponse);
    }
  };

  const setErrorHandler = (msg, param = "form", fullError = false) => {
    setErrors(fullError ? msg : [{ msg, param }])
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
    // const fetchUsersToAllocate = async () => {
    //   const response = await loadUsersToAllocate();
    //   if (response) {
    //     setUsers(response.map((userDetail) => {
    //       return {
    //         label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
    //         value: userDetail.userId
    //       }
    //     }));
    //   }
    // }

    const fetchPropertiesToAllocate = async () => {
      const response = await loadPropertiesToAllocate();
      console.log(response);
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

    // fetchUsersToAllocate();
    fetchPropertiesToAllocate();
  }, []);

  // useEffect(() => {
  //   if (selectedAllocatedAgent) {
  //     const callCheckAvailability = async () => {
  //       await checkAvailability();
  //     }

  //     callCheckAvailability();
  //   }
  // }, [selectedAllocatedAgent, time]);

  function handleButtonClick(event) {
    const now = new Date();

    // Format the date and time values to be used as input values
    const dateValue = now.toISOString().slice(0, 10);
    const timeValue = now.toTimeString().slice(0, 5);
    setDate(dateValue);
    setTime(timeValue);
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
                      isMulti={false}
                      options={properties}
                      onChange={(e) => setSelectedAllocatedProperties(e)}
                      value={selectedAllocatedProperties}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <button className="btn theme-btn-2 request-now-btn positionRevert" onClick={handleButtonClick} >Request Now</button>
                </div>
                <div className="col-md-5">
                  <div className="input-item">
                    <label>Select Date *</label>
                    <input
                      type="date"
                      onChange={(e) => setDate(e.target.value)}
                      value={date}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="input-item">
                    <label>Choose Time *</label>
                    <input
                      type="time"
                      onChange={(e) => setTime(e.target.value)}
                      value={time}
                      required
                    />
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className="input-item">
                    <Select 
                      options={users} 
                      onChange={(e) => setSelectedAllocatedAgent(e)}
                      value={selectedAllocatedAgent}
                      required
                    />
                  </div>
                </div> */}
                <div className="btn-wrapper">
                  <ResponseHandler errors={errors} success={success}/>
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
