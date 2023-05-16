import React, { Component } from "react";

class VideoV3 extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;

    return (
      <div className="ltn__video-popup-area ltn__video-popup-margin">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="ltn__video-bg-img ltn__video-popup-height-600 bg-overlay-black-10-- bg-image"
                data-bs-bg={`${publicUrl}assets/img/bg/15.jpg`}
              >
                <a
                  className="ltn__video-icon-2 ltn__video-icon-2-border border-radius-no ltn__secondary-bg"
                  href={`${publicUrl}assets/video/1.mp4`}
                  data-rel="lightcase:myCollection"
                >
                  <i className="fa fa-play" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoV3;
