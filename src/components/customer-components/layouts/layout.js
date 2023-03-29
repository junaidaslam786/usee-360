import React from "react";
import { useHistory } from "react-router-dom";
import Sidebar from "../sidebar";

function getToken() {
  const tokenString = sessionStorage.getItem("customerToken");
  const userToken = JSON.parse(tokenString);
  return userToken;
}

const Layout = ({ children }) => {
  const token = getToken();
  const history = useHistory();

  if (!token) {
    history.push("/customer/login");
  } else {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    if (decodedJwt.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("customerToken");
      history.push("/customer/login");
    }
  }

  return (
    <div className="liton__wishlist-area pb-70">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__product-tab-area">
              <div className="container">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="ltn__tab-menu-list mb-50">
                      <Sidebar />
                    </div>
                  </div>
                  <div className="col-lg-8">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
