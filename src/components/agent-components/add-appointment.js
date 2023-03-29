import React, { useState, useEffect } from "react";
import AsyncCreatableSelect from 'react-select/async-creatable';
import Select from 'react-select';
import axios from "axios";
import Layout from "./layouts/layout";

export default function AddAppointment() {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedAllocatedAgent, setSelectedAllocatedAgent] = useState("");
  const [selectedAllocatedProperties, setSelectedAllocatedProperties] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState();

  const token = JSON.parse(sessionStorage.getItem("agentToken"));

  const loadCustomers = async (searchQuery) => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/list-customer?q=${searchQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseResult = await response.json();
    if (responseResult) {
      setCustomers(responseResult);
      return responseResult;
    }
  };

  const loadUsersToAllocate = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/agent/user/to-allocate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
  };

  const loadPropertiesToAllocate = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/property/to-allocate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
  };

  const checkAvailability = async () => {
    if (!selectedAllocatedAgent || !time || !date) {
      return;
    }

    await axios.post(`${process.env.REACT_APP_API_URL}/agent/user/check-availability`, 
    {
      "userId": selectedAllocatedAgent.value,
      date,
      time,
    }, 
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
        console.log('checkAvailability-response', response);
        if (!response || !response?.data?.success) {
          setErrorHandler("Sorry allotted person not avaiable during the selected timeslot. Please change the timeslot.");
        } 
        return true;
    }).catch(error => {
      console.log('checkAvailability-error', error);
      setErrorHandler("Unable to check availability, please try again later.");
    });
  };

  const loadOptions = (inputValue, callback) => {
    try {
      setTimeout(async () => {
        const response = await loadCustomers(inputValue);
        const options = response.map((customer) => {
          return {
            value: customer.id, 
            label: `${customer.firstName} ${customer.lastName}` 
          }
        })
        callback(options);
      }, 1000);
    } catch(error) {
      console.log('errorInFilterCustomer', error);
    }
  }

  const selectedCustomerHandler = (e) => {
    setSelectedCustomer(e);
    setEmail("");
    setPhone("");

    const currentCustomer = customers.find((customer) => customer.id == e.value);
    if (currentCustomer) {
      setEmail(currentCustomer.email);
      setPhone(currentCustomer.phoneNumber || "");
    } 
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let customerFirstName = "";
    let customerLastName = "";
    let customerEmail = "";
    let customerPhoneNumber = "";
    let customerId = "";
    const customer = customers.find((customer) => customer.id = selectedCustomer.value);
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
      properties: selectedAllocatedProperties.map((property) => property.value),
      appointmentDate: date,
      appointmentTime: time,
      customerId: customerId,
      customerFirstName: customerFirstName,
      customerLastName: customerLastName,
      customerPhone: customerPhoneNumber,
      customerEmail: customerEmail,
      allotedAgent: selectedAllocatedAgent.value
    }

    setLoading(true);
    const formResponse = await axios.post(`${process.env.REACT_APP_API_URL}/agent/appointment/create`, 
      formData, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    }).then((response) => {
      if (response?.status !== 201) {
        setErrorHandler("Unable to create appointment, please try again later");
      }

      console.log('create-appointment-response', response);

      return response.data;
    }).catch(error => {
      console.log('create-appointment-error', error);
      setErrorHandler(error?.response?.data?.errors ? error.response.data.errors : "Unable to create appointment, please try again later");
    });

    setLoading(false);
    if (formResponse) {
      setSuccessHandler("Appointment created successfully");
      setSelectedCustomer("");
      setSelectedAllocatedAgent("");
      setSelectedAllocatedProperties("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
      console.log('create-property-final-response', formResponse);
    }
  }

  const setErrorHandler = (msg, param = "form") => {
    setErrors([{ msg, param }])
    setTimeout(() => {
      setErrors([]);
    }, 3000);
    setSuccess("");
  }

  const setSuccessHandler = (msg) => {
    setSuccess(msg)
    setTimeout(() => {
      setSuccess("");
    }, 3000);
    
    setErrors([]);
  }

  useEffect(() => {
    const fetchUsersToAllocate = async () => {
      const response = await loadUsersToAllocate();
      if (response) {
        setUsers(response.map((userDetail) => {
          return {
            label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
            value: userDetail.userId
          }
        }));
      }
    }

    const fetchPropertiesToAllocate = async () => {
      const response = await loadPropertiesToAllocate();
      if (response) {
        setProperties(response.map((property) => {
          return {
            label: property.title,
            value: property.id
          }
        }));
      }
    }

    fetchUsersToAllocate();
    fetchPropertiesToAllocate();
  }, []);

  useEffect(() => {
    if (selectedAllocatedAgent) {
      const callCheckAvailability = async () => {
        await checkAvailability();
      }

      callCheckAvailability();
    }
  }, [selectedAllocatedAgent, time]);

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
                      isMulti
                      options={properties} 
                      onChange={(e) => setSelectedAllocatedProperties(e)}
                      value={selectedAllocatedProperties}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
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
                <div className="col-md-6">
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
                <div className="col-md-6">
                  <div className="input-item">
                    <label>Customer Name</label>
                    <AsyncCreatableSelect 
                      cacheOptions 
                      loadOptions={loadOptions} 
                      defaultOptions={[]}
                      onChange={selectedCustomerHandler}
                      value={selectedCustomer}
                      placeholder="Type to search"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-item">
                    <label>Customer Email</label>
                    <input type="email" placeholder="Customer Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-item">
                    <label>Customer Phone</label>
                    <input type="text" placeholder="Customer Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-item">
                    <Select 
                      options={users} 
                      onChange={(e) => setSelectedAllocatedAgent(e)}
                      value={selectedAllocatedAgent}
                      required
                    />
                  </div>
                </div>
                <div className="btn-wrapper">
                  {
                    errors ?
                      errors.map(err => {
                        return <div className="alert alert-danger" role="alert" key={err.param}> { err.msg } </div>;
                      }
                    ) : ""
                  }
                  { success ? ( <div className="alert alert-primary" role="alert"> { success } </div> ) : "" }
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
