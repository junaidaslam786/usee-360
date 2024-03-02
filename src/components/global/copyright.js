// import React, { Component } from "react";

// class CopyRight extends Component {
//   render() {
//     return (
//       <div className="ltn__copyright-area ltn__copyright-2 section-bg-7  plr--5">
//         <div className="container-fluid ltn__border-top-2">
//           <div className="row">
//             <div className="col-md-6 col-12">
//               <div className="ltn__copyright-design clearfix">
//                 <p>
//                   All Rights Reserved @ Usee-360{" "}
//                   <span className="current-year" />
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default CopyRight;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./copyright.module.css";

class CopyRight extends Component {
  render() {
    return (
      <div className="ltn__copyright-area ltn__copyright-2 section-bg-7  plr--5">
        <div className="container-fluid ltn__border-top-2">
          <div className="row">
            <div className="col-md-6 col-12 mb-0">
              <p className="mb-0">
                All Rights Reserved @ Usee-360 <span className="current-year" />
              </p>
            </div>
            <div className="col-md-6 col-12">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                className="footer-links-container footer-link-responsive"
              >
                <Link
                  to="/privacy-policy"
                  className="footer-link footer-link-responsive footer-links-container"
                  style={{ margin: "0 10px", color: "white" }}
                >
                  Privacy Policy
                </Link>
                <span> | </span>
                <Link
                  to="/terms-and-conditions"
                  className="footer-link footer-link-responsive footer-links-container"
                  style={{ margin: "0 10px", color: "white" }}
                >
                  Terms and Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CopyRight;
