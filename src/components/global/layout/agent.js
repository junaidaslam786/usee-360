import React from "react";
import Sidebar from "../sidebar";
import { USER_TYPE } from "../../../constants";
import "./agent.css";

export default function AgentLayout({ ComponentToRender, componentProps }) {
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
                      <Sidebar type={USER_TYPE.AGENT} {...componentProps} />
                    </div>
                  </div>
                  <div className="col-lg-8 custom-class">
                    {ComponentToRender && (
                      <ComponentToRender {...componentProps} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
