// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { getLoginToken } from "../../../utils";

// class CallToActonV1 extends Component {
//   render() {
//     return (
//       <div>
//         {
//           !getLoginToken() && (
//             <div className="ltn__call-to-action-area call-to-action-6 before-bg-bottom">
//               <div className="container">
//                 <div className="row">
//                   <div className="col-lg-12">
//                     <div className="call-to-action-inner call-to-action-inner-6 ltn__secondary-bg position-relative text-center---">
//                       <div className="coll-to-info text-color-white">
//                         <h1>Book A Free Demo</h1>
//                         <p>We can help you realize your dream of a new home</p>
//                       </div>
//                       <div className="btn-wrapper go-top">
//                         <Link className="btn btn-effect-3 btn-white" to="/demo">
//                           Book a Demo
//                           <i className="icon-next" />
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )
//         }
//       </div>
//     );
//   }
// }

// export default CallToActonV1;
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getLoginToken } from "../../../utils";

class CallToActonV1 extends Component {
  render() {
    return (
      <div>
        {
          !getLoginToken() && (
            <div className="ltn__call-to-action-area call-to-action-6 before-bg-bottom">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="call-to-action-inner call-to-action-inner-6 ltn__secondary-bg position-relative text-center---">
                      <div className="coll-to-info text-color-white">
                        <h1>Book A Free Demo</h1>
                        <p>We can help you realize your dream of a new home</p>
                      </div>
                      <div className="btn-wrapper go-top">
                        <Link className="btn btn-effect-3 btn-white" to="/demo">
                          Book a Demo
                          <i className="icon-next" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default CallToActonV1;
