// import React, { useContext, useEffect, useState } from "react";
// import DashboardFilter from "./dashboard-filter";
// import {
//   checkAgentDetails,
//   getUserDetailsFromJwt,
//   getUserDetailsFromJwt2,
//   getUserType,
//   removeLoginToken,
// } from "../../../utils";
// import { AGENT_TYPE, AGENT_TYPE_LABEL, USER_TYPE } from "../../../constants";
// import { useHistory } from "react-router-dom";
// import { AuthContext } from "../../auth/AuthContext";
// import { toast } from "react-toastify";
// import InformativeModal from "../informative-modal";

// export default function Dashboard({ type }) {

//   const [showModal, setShowModal] = useState(true);
//   const history = useHistory();
//   const userDetails = getUserDetailsFromJwt();
//   const userType = getUserType();

//   // useEffect(() => {
//   //   // Show the modal only if the logged-in user is a customer
//   //   if (userDetails && userType === USER_TYPE.CUSTOMER) {
//   //     setShowModal(true);
//   //   }
//   // }, [userDetails]);

//   useEffect(() => {
//     // Only proceed if userDetails exist
//     if (userDetails) {
//       // Handle agent-specific logic
//       if (userDetails && userDetails?.agent && userDetails?.agent?.agentType === "agent") {
//         checkAgentDetails()
//           .then((response) => {
//             if (response.user.active === false) {
//               toast("Super admin will approve your account in 24 hours");
//               removeLoginToken();
//               history.push(`/${type}/login`);
//             } else {
//               // Directly go to the dashboard if the agent is active
//               if (history.location.pathname !== `/${type}/dashboard`) {
//                 history.push(`/${type}/dashboard`);
//               }
//             }
//           })
//           .catch((error) => {
//             console.error("Error checking agent details:", error);
//             toast.error("There was a problem checking your account status.");
//           });
//       } else {
//         // Non-agent users go directly to the dashboard
//         if (history.location.pathname !== `/${type}/dashboard`) {
//           history.push(`/${type}/dashboard`);
//         }
//       }
//     } else {
//       // If no userDetails, redirect to login
//       history.push(`/${type}/login`);
//     }
//   }, [userDetails, type, history]);

//   return (
//     <React.Fragment>
//       <div className="ltn__comment-area mb-50">
//         <div className="ltn-author-introducing clearfix">
//           <div className="author-img">
//             <img
//               src={`${process.env.REACT_APP_API_URL}/${userDetails.profileImage}`}
//               alt="Author"
//             />
//           </div>
//           <div className="author-info">
//             <h6>
//               {type === USER_TYPE.CUSTOMER
//                 ? process.env.REACT_APP_CUSTOMER_ENTITY_LABEL
//                 : userDetails &&
//                   userDetails?.agent?.agentType !== AGENT_TYPE.AGENT
//                 ? AGENT_TYPE_LABEL[userDetails.agent.agentType]
//                 : process.env.REACT_APP_AGENT_ENTITY_LABEL}
//             </h6>
//             <h2>{userDetails.name}</h2>
//             <div className="footer-address">
//               <ul>
//                 <li>
//                   <div className="footer-address-icon">
//                     <i className="icon-call" />
//                   </div>
//                   <div className="footer-address-info">
//                     <p>
//                       <a href={`tel:${userDetails.phoneNumber}`}>
//                         {userDetails.phoneNumber}
//                       </a>
//                     </p>
//                   </div>
//                 </li>
//                 <li>
//                   <div className="footer-address-icon">
//                     <i className="icon-mail" />
//                   </div>
//                   <div className="footer-address-info">
//                     <p>
//                       <a href={`mailto:${userDetails.email}`}>
//                         {userDetails.email}
//                       </a>
//                     </p>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//       <DashboardFilter type={type} />

//     </React.Fragment>
//   );
// }

import React, { useEffect, useState } from "react";
import DashboardFilter from "./dashboard-filter";
import {
  checkAgentDetails,
  getUserDetailsFromJwt,
  getUserType,
  removeLoginToken,
} from "../../../utils";
import { AGENT_TYPE, USER_TYPE } from "../../../constants";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard({ type }) {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function fetchUserDetails() {
      const details = getUserDetailsFromJwt();
      if (!details) {
        toast.error("Authentication failed. Redirecting to login.");
        history.push(`/${type}/login`);
      } else {
        setUserDetails(details);
        setIsLoading(false);
      }
    }
    fetchUserDetails();
  }, [type, history]);

  useEffect(() => {
    if (!userDetails) {
      return; // Exit if userDetails are not set
    }

    const handleAgentDetails = async () => {
      try {
        const response = await checkAgentDetails();
        if (!response.user.active) {
          toast.info("Super admin will approve your account in 24 hours");
          removeLoginToken();
          history.push(`/${type}/login`);
        } else if (history.location.pathname !== `/${type}/dashboard`) {
          history.push(`/${type}/dashboard`);
        }
      } catch (error) {
        console.error("Error checking agent details:", error);
        toast.error("There was a problem checking your account status.");
      }
    };

    const userType = getUserType();
    if (
      userType === USER_TYPE.AGENT &&
      userDetails.agentType === AGENT_TYPE.AGENT
    ) {
      handleAgentDetails();
    } else if (
      userType !== USER_TYPE.AGENT &&
      history.location.pathname !== `/${type}/dashboard`
    ) {
      history.push(`/${type}/dashboard`);
    }
  }, [userDetails, type, history]);

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading message while user details are fetched
  }

  if (!userDetails) {
    return <div>Error loading user details.</div>; // Display an error message if userDetails couldn't be fetched
  }

  return (
    <React.Fragment>
      <div className="ltn__comment-area mb-50">
        <div className="ltn-author-introducing clearfix">
          <div className="author-img">
            <img
              src={`${process.env.REACT_APP_API_URL}/${userDetails.profileImage}`}
              alt="Author"
            />
          </div>
          <div className="author-info">
            <h6>
              {type === USER_TYPE.CUSTOMER
                ? process.env.REACT_APP_CUSTOMER_ENTITY_LABEL
                : AGENT_TYPE[userDetails.agentType] ||
                  process.env.REACT_APP_AGENT_ENTITY_LABEL}
            </h6>
            <h2>{userDetails.name}</h2>
            <div className="footer-address">
              <ul>
                <li>
                  <div className="footer-address-icon">
                    <i className="icon-call" />
                  </div>
                  <div className="footer-address-info">
                    <p>
                      <a href={`tel:${userDetails.phoneNumber}`}>
                        {userDetails.phoneNumber}
                      </a>
                    </p>
                  </div>
                </li>
                <li>
                  <div className="footer-address-icon">
                    <i className="icon-mail" />
                  </div>
                  <div className="footer-address-info">
                    <p>
                      <a href={`mailto:${userDetails.email}`}>
                        {userDetails.email}
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <DashboardFilter type={type} />
    </React.Fragment>
  );
}
