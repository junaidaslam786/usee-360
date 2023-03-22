import React from "react";

export default function Dashboard() {
  const publicUrl = `${process.env.PUBLIC_URL}/`;
  
  return (
    <div className="ltn__comment-area mb-50">
      <div className="ltn-author-introducing clearfix">
        <div className="author-img">
          <img
            src={publicUrl + "assets/img/blog/author.jpg"}
            alt="Author Image"
          />
        </div>
        <div className="author-info">
          <h6>Agent of Property</h6>
          <h2>Rosalina D. William</h2>
          <div className="footer-address">
            <ul>
              <li>
                <div className="footer-address-icon">
                  <i className="icon-placeholder" />
                </div>
                <div className="footer-address-info">
                  <p>Brooklyn, New York, United States</p>
                </div>
              </li>
              <li>
                <div className="footer-address-icon">
                  <i className="icon-call" />
                </div>
                <div className="footer-address-info">
                  <p>
                    <a href="tel:+0123-456789">+0123-456789</a>
                  </p>
                </div>
              </li>
              <li>
                <div className="footer-address-icon">
                  <i className="icon-mail" />
                </div>
                <div className="footer-address-info">
                  <p>
                    <a href="mailto:example@example.com">example@example.com</a>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
