// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { USER_TYPE } from "../../constants";
// import { getLoginToken, getUserDetailsFromJwt } from "../../utils";

// export default function Navbar(props) {
//   const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;
//   const location = useLocation();
//   const userDetail = getUserDetailsFromJwt();

//   return (
//     <div>
//       <header className="ltn__header-area ltn__header-5 ltn__header-transparent--- gradient-color-4---">
//         {/* <div className="ltn__header-top-area section-bg-6 top-area-color-white---">
//           <div className="container">
//             <div className="row">
//               <div className="col-md-7">
//                 <div className="ltn__top-bar-menu">
//                   <ul>
//                     <li>
//                       <a href="mailto:info@usee-360.com">
//                         <i className="icon-mail" /> info@usee-360.com
//                       </a>
//                     </li>
//                     <li>
//                       <a href="tel:+4407808055833">
//                         <i className="icon-call" /> Tel UK: +44 (0)78 080 55833
//                       </a>
//                     </li>
//                     <li>
//                       <a href="tel:+9710501813399">
//                         <i className="icon-call" /> Tel UAE: +971 (0) 50 181 3399
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <div className="col-md-5">
//                 <div className="top-bar-right text-end">
//                   <div className="ltn__top-bar-menu">
//                     <ul>
//                       <li><Social /></li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div> */}
//         <div className="ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white">
//           <div className="container">
//             <div className="row">
//               <div className="col">
//                 <div className="site-logo-wrap">
//                   <div className="site-logo go-top">
//                     <Link to="/">
//                       <img
//                         src={`${publicUrl}assets/img/logo.png`}
//                         alt="Logo"
//                         height="80"
//                       />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//               <div className="col header-menu-column">
//                 <div className="header-menu d-none d-xl-block">
//                   <nav>
//                     <div className="ltn__main-menu go-top headerItems">
//                       <ul>
//                         <li className="listItems">
//                           <Link to="/">Home</Link>
//                           {/* <div className="separator"></div> */}
//                         </li>
//                         <li className=" listItems">
//                           <Link to="/services">Services</Link>
//                           {/* <ul>
//                             <li>
//                               <Link to="/services/properties">
//                                 Usee-360 Properties
//                               </Link>
//                             </li>
//                           </ul> */}
//                         </li>
//                         <li className="menu-icon listItems">
//                           <Link className="pointer_none" to="#">About</Link>
//                           <ul>
//                             <li><Link to="/blogs">Blogs</Link></li>
//                             <li><Link to="/news">News</Link></li>
//                             <li><Link to="/community">Community</Link></li>
//                           </ul>
//                         </li>
//                         {
//                           (!props?.hideBookDemo && !getLoginToken()) ? (
//                             <li className="listItems">
//                               <Link to="/demo">Book a Demo</Link>
//                             </li>
//                           ) : null
//                         }
//                         <li className="listItems">
//                           <Link to="/contact">Contact</Link>
//                         </li>
//                         {/* <li className="listItems">
//                           <Link to="/services">Search</Link>
//                         </li> */}
//                       </ul>
//                     </div>
//                   </nav>
//                 </div>
//               </div>
//               <div className="col ltn__header-options ltn__header-options-2 mb-sm-20">
//                 {/* user-menu */}
//                 <div className="ltn__drop-menu user-menu">
//                   <ul>
//                     {
//                       !userDetail && (
//                         <React.Fragment>
//                           <li
//                             className={
//                               !location.pathname.includes(USER_TYPE.CUSTOMER)
//                                 ? "button-inactive"
//                                 : null
//                             }
//                           >
//                             <Link to="/customer/dashboard">
//                               <i className="icon-user" /> { process.env.REACT_APP_CUSTOMER_ENTITY_LABEL }
//                             </Link>
//                           </li>
//                           <li
//                             className={
//                               !location.pathname.includes(USER_TYPE.AGENT)
//                                 ? "button-inactive"
//                                 : null
//                             }
//                           >
//                             <Link to="/agent/dashboard">
//                               <i className="icon-user" /> { process.env.REACT_APP_AGENT_ENTITY_LABEL }
//                             </Link>
//                           </li>
//                         </React.Fragment>
//                       )
//                     }
                    
//                     {
//                       userDetail && (
//                         <li
//                           className={
//                             !location.pathname.includes(USER_TYPE.CUSTOMER)
//                               ? "button-inactive"
//                               : null
//                           }
//                         >
//                           <Link className="customPadding" to={ userDetail?.agent ? "/agent/dashboard" : "/customer/dashboard" }>
//                             <span className="userImg">
//                               <img src={`${process.env.REACT_APP_API_URL}/${userDetail.profileImage}`} alt="Dashboard"/>
//                             </span>
//                             { userDetail.name }
//                           </Link>
//                         </li>
//                       )
//                     }
//                   </ul>
//                 </div>
//                 {/* Mobile Menu Button */}
//                 <div className="mobile-menu-toggle d-xl-none">
//                   <a
//                     href="#ltn__utilize-mobile-menu"
//                     className="ltn__utilize-toggle"
//                   >
//                     <svg viewBox="0 0 800 600">
//                       <path
//                         d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200"
//                         id="top"
//                       />
//                       <path d="M300,320 L540,320" id="middle" />
//                       <path
//                         d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190"
//                         id="bottom"
//                         transform="translate(480, 320) scale(1, -1) translate(-480, -318) "
//                       />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//       <div
//         id="ltn__utilize-mobile-menu"
//         className="ltn__utilize ltn__utilize-mobile-menu"
//       >
//         <div className="ltn__utilize-menu-inner ltn__scrollbar">
//           <div className="ltn__utilize-menu-head">
//             <div className="site-logo">
//               <Link to="/">
//                 <img
//                   src={`${publicUrl}assets/img/logo.png`}
//                   alt="Logo"
//                   height="80"
//                 />
//               </Link>
//             </div>
//             <button className="ltn__utilize-close">×</button>
//           </div>
//           <div className="ltn__utilize-menu">
//             <ul>
//               <li>
//                 <Link to="/">Home</Link>
//               </li>
//               <li>
//                 <Link to="/services">Services</Link>
//                 <ul className="sub-menu">
//                   <li>
//                     <Link to="/services/properties">Usee-360 Properties</Link>
//                   </li>
//                 </ul>
//               </li>
//               {
//                 props?.page !== 'register' && (
//                   <li>
//                   <Link to="/demo">Book a Demo</Link>
//                   </li>
//                 )
//               }
//               <li>
//                 <Link to="/blogs">Blogs</Link>
//               </li>
//               <li>
//                 <Link to="/news">News</Link>
//               </li>
//               <li>
//                 <Link to="/community">Community</Link>
//               </li>
//               <li>
//                 <Link to="/contact">Contact</Link>
//               </li>
//             </ul>
//           </div>
//           <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
//             <ul>
              
//               {
//                 !userDetail && (
//                   <React.Fragment>
//                     <li>
//                       <Link to="/customer/dashboard">
//                         <span className="utilize-btn-icon">
//                           <i className="far fa-user" />
//                         </span>
//                         { process.env.REACT_APP_CUSTOMER_ENTITY_LABEL }
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="/agent/dashboard">
//                         <span className="utilize-btn-icon">
//                           <i className="far fa-user" />
//                         </span>
//                         { process.env.REACT_APP_AGENT_ENTITY_LABEL }
//                       </Link>
//                     </li>
//                   </React.Fragment>
//                 )
//               }

//               {
//                 userDetail && (
//                   <li
//                     className={
//                       !location.pathname.includes(USER_TYPE.CUSTOMER)
//                         ? "button-inactive"
//                         : null
//                     }
//                   >
//                     <Link to={ userDetail?.agent ? "/agent/dashboard" : "/customer/dashboard" }>
//                       <i className="icon-user" /> Dashboard
//                     </Link>
//                   </li>
//                 )
//               }
//             </ul>
//           </div>
//           <div className="ltn__social-media-2">
//             <ul>
//               <li>
//                 <a href="#" title="Facebook">
//                   <i className="fab fa-facebook-f" />
//                 </a>
//               </li>
//               <li>
//                 <a href="#" title="Twitter">
//                   <i className="fab fa-twitter" />
//                 </a>
//               </li>
//               <li>
//                 <a href="#" title="Linkedin">
//                   <i className="fab fa-linkedin" />
//                 </a>
//               </li>
//               <li>
//                 <a href="#" title="Instagram">
//                   <i className="fab fa-instagram" />
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { USER_TYPE } from "../../constants";
import { getLoginToken, getUserDetailsFromJwt } from "../../utils";

export default function Navbar(props) {
  const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;
  const location = useLocation();
  const userDetail = getUserDetailsFromJwt();

  return (
    <div>
      <header className="ltn__header-area ltn__header-5 ltn__header-transparent--- gradient-color-4---">
        <div className="ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="site-logo-wrap">
                  <div className="site-logo go-top">
                    <Link to="/">
                      <img
                        src={`${publicUrl}assets/img/logo.png`}
                        alt="Logo"
                        height="80"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col header-menu-column">
                <div className="header-menu d-none d-xl-block">
                  <nav>
                    <div className="ltn__main-menu go-top headerItems">
                      <ul>
                        <li className="listItems">
                          <Link to="/">Home</Link>
                        </li>
                        <li className=" listItems">
                          <Link to="/services">Services</Link>
                        </li>
                        <li className="menu-icon listItems">
                          <Link className="pointer_none" to="#">About</Link>
                          <ul>
                            <li><Link to="/blogs">Blogs</Link></li>
                            <li><Link to="/news">News</Link></li>
                            <li><Link to="/community">Community</Link></li>
                          </ul>
                        </li>
                        {
                          (!props?.hideBookDemo && !getLoginToken()) ? (
                            <li className="listItems">
                              <Link to="/demo">Book a Demo</Link>
                            </li>
                          ) : null
                        }
                        <li className="listItems">
                          <Link to="/contact">Contact</Link>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
              <div className="col ltn__header-options ltn__header-options-2 mb-sm-20">
                <div className="ltn__drop-menu user-menu">
                  <ul>
                    {
                      !userDetail && (
                        <React.Fragment>
                          <li
                            className={
                              !location.pathname.includes(USER_TYPE.CUSTOMER)
                                ? "button-inactive"
                                : null
                            }
                          >
                            <Link to="/customer/dashboard">
                              <i className="icon-user" /> { process.env.REACT_APP_CUSTOMER_ENTITY_LABEL }
                            </Link>
                          </li>
                          <li
                            className={
                              !location.pathname.includes(USER_TYPE.AGENT)
                                ? "button-inactive"
                                : null
                            }
                          >
                            <Link to="/agent/dashboard">
                              <i className="icon-user" /> { process.env.REACT_APP_AGENT_ENTITY_LABEL }
                            </Link>
                          </li>
                        </React.Fragment>
                      )
                    }
                    {
                      userDetail && (
                        <li
                          className={
                            !location.pathname.includes(USER_TYPE.CUSTOMER)
                              ? "button-inactive"
                              : null
                          }
                        >
                          <Link className="customPadding" to={ userDetail?.agent ? "/agent/dashboard" : "/customer/dashboard" }>
                            <span className="userImg">
                              <img src={`${process.env.REACT_APP_API_URL}/${userDetail.profileImage}`} alt="Dashboard"/>
                            </span>
                            { userDetail.name }
                          </Link>
                        </li>
                      )
                    }
                  </ul>
                </div>
                <div className="mobile-menu-toggle d-xl-none">
                  <a
                    href="#ltn__utilize-mobile-menu"
                    className="ltn__utilize-toggle"
                  >
                    <svg viewBox="0 0 800 600">
                      <path
                        d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200"
                        id="top"
                      />
                      <path d="M300,320 L540,320" id="middle" />
                      <path
                        d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190"
                        id="bottom"
                        transform="translate(480, 320) scale(1, -1) translate(-480, -318) "
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div
        id="ltn__utilize-mobile-menu"
        className="ltn__utilize ltn__utilize-mobile-menu"
      >
        <div className="ltn__utilize-menu-inner ltn__scrollbar">
          <div className="ltn__utilize-menu-head">
            <div className="site-logo">
              <Link to="/">
                <img
                  src={`${publicUrl}assets/img/logo.png`}
                  alt="Logo"
                  height="80"
                />
              </Link>
            </div>
            <button className="ltn__utilize-close">×</button>
          </div>
          <div className="ltn__utilize-menu">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/services/properties">Usee-360 Properties</Link>
                  </li>
                </ul>
              </li>
              {
                props?.page !== 'register' && (
                  <li>
                  <Link to="/demo">Book a Demo</Link>
                  </li>
                )
              }
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <Link to="/news">News</Link>
              </li>
              <li>
                <Link to="/community">Community</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
            <ul>
              {
                !userDetail && (
                  <React.Fragment>
                    <li>
                      <Link to="/customer/dashboard">
                        <span className="utilize-btn-icon">
                          <i className="far fa-user" />
                        </span>
                        { process.env.REACT_APP_CUSTOMER_ENTITY_LABEL }
                      </Link>
                    </li>
                    <li>
                      <Link to="/agent/dashboard">
                        <span className="utilize-btn-icon">
                          <i className="far fa-user" />
                        </span>
                        { process.env.REACT_APP_AGENT_ENTITY_LABEL }
                      </Link>
                    </li>
                  </React.Fragment>
                )
              }
              {
                userDetail && (
                  <li
                    className={
                      !location.pathname.includes(USER_TYPE.CUSTOMER)
                        ? "button-inactive"
                        : null
                    }
                  >
                    <Link to={ userDetail?.agent ? "/agent/dashboard" : "/customer/dashboard" }>
                      <i className="icon-user" /> Dashboard
                    </Link>
                  </li>
                )
              }
            </ul>
          </div>
          <div className="ltn__social-media-2">
            <ul>
              <li>
                <a href="#" title="Facebook">
                  <i className="fab fa-facebook-f" />
                </a>
              </li>
              <li>
                <a href="#" title="Twitter">
                  <i className="fab fa-twitter" />
                </a>
              </li>
              <li>
                <a href="#" title="Linkedin">
                  <i className="fab fa-linkedin" />
                </a>
              </li>
              <li>
                <a href="#" title="Instagram">
                  <i className="fab fa-instagram" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
