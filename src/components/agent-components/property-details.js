import React from "react";
import Layout from "./layouts/layout";

export default function PropertyDetails() {
  let publicUrl = process.env.PUBLIC_URL + "/";

  return (
    <Layout>
      <section>
        <img src={publicUrl + "assets/img/product-3/1.jpg"} alt="#" />
        <div className="row property-desc">
          <div className="col-md-10">
            <h3>New Apartment Nice View</h3>
            <small>
              <i className="icon-placeholder" /> Brooklyn, New York, United
              States
            </small>
          </div>
          <div className="col-md-2">
            <h3>£12000</h3>
          </div>
        </div>
        <div className="row property-details">
          <div className="col-md-7">
            <div className="row mb-5">
              <div className="col-md-4">
                <h5>Type</h5>
                <p>Flat</p>
              </div>
              <div className="col-md-4">
                <h5>Bedrooms</h5>
                <p>3</p>
              </div>
              <div className="col-md-4">
                <h5>Area</h5>
                <p>12 ft</p>
              </div>
            </div>
            <h5>Description:</h5>
            <p>
              Massa tempor nec feugiat nisl pretium. Egestas fringilla phasellus
              faucibus scelerisque eleifend donec Porta nibh venenatis cras sed
              felis eget velit aliquet. Neque volutpat ac tincidunt vitae semper
              quis lectus. Turpis in eu mi bibendum neque egestas congue
              quisque.
            </p>
          </div>
          <div className="col-md-5">
            <button className="btn theme-btn-1 mb-3">View Floor Plan</button>
            <button className="btn theme-btn-3 mb-3">View Brochure</button>
            <button className="btn theme-btn-1 mb-3">View Map</button>
            <button className="btn theme-btn-3 mb-3">View Tour</button>
            <button className="btn theme-btn-1 mb-3">
              Remove From Wishlist
            </button>
            <button className="btn theme-btn-3 mb-3">
              Mortgage Calculator
            </button>
            <button className="btn theme-btn-1 mb-3">Make An Offer</button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
