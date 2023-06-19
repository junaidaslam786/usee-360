import React from "react";
import Sidebar from "../sidebar";
import { USER_TYPE } from "../../../constants";

export default function CustomerLayout({ ComponentToRender, componentProps }) {
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
                                            <Sidebar type={USER_TYPE.CUSTOMER} {...componentProps} />
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
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