import React, {useState} from 'react'
import { Link } from "react-router-dom";
import {
    JOB_TITLE,
    DEFAULT_LICENSE_NO_TEXT,
    DEFAULT_DEED_TITLE_TEXT,
    UPLOAD_DOCUMENT_DEFAULT,
    UPLOAD_DOCUMENT_LANDLORD,
    USER_TYPE,
  } from "../../constants";
  import Select from "react-select";
  import AuthService from "../../services/auth";
  import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import PasswordChecklist from "react-password-checklist";
import { toast } from "react-toastify";
import { Country, City } from "country-state-city";

const SocialRegisterForm = (props) => {
    const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [showTraderORNField, setShowTraderORNField] = useState(false);
  const [companyPosition, setCompanyPosition] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [document, setDocument] = useState();
  const [jobTitlePlaceHolder, setJobTitlePlaceHolder] = useState(
    DEFAULT_LICENSE_NO_TEXT
  );
  const [documentLabel, setDocumentLabel] = useState();
  const [loading, setLoading] = useState(false);
  const [loadOTpForm, setLoadOTpForm] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

//   const registerUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const data = {
//       company_name: companyName,
//       first_name: firstName,
//       last_name: lastName,
//       country: selectedCountry,
//       city: selectedCity,
//       company_position: companyPosition,
//       job_title: jobTitle,
//       license_no: licenseNo,
//       email: email,
//       phone_number: phoneNumber,
//       password: password,
//       document: document,
//     };
//     const response = await AuthService.register(data);
//     if (response.status === 200) {
//       toast.success(response.data.message);
//       setLoading(false);
//       setLoadOTpForm(true);
//       setUser(response.data.user);
//       setToken(response.data.token);
//     } else {
//       toast.error(response.data.message);
//       setLoading(false);
//     }
//   }

  return (
    <div className='ltn__login-area pb-80'>
        <div className='container'>
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1 className="section-title">
                Register
                <br />
                Your {process.env.REACT_APP_AGENT_ENTITY_LABEL} Account
              </h1>
            </div>
          </div>
        </div>
        </div>
    </div>
  )
}

export default SocialRegisterForm