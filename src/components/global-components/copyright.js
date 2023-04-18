import React, { Component } from "react";

class CopyRight extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;

    return (
      <div className="ltn__copyright-area ltn__copyright-2 section-bg-7  plr--5">
        <div className="container-fluid ltn__border-top-2">
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="ltn__copyright-design clearfix">
                <p>
                  All Rights Reserved @ Usee-360 <span className="current-year" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CopyRight;