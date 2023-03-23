import React from "react";

export default function AddProperty() {
  return (
    <div className="ltn__myaccount-tab-content-inner">
      <h4 className="title-2">Property Description</h4>
      <div className="row mb-50">
        <div className="col-md-12">
          <div className="input-item">
            <label>
              Property Name - First line of address (for example: 30 Johns Road,
              SM1)
            </label>
            <input type="text" placeholder="Property Name" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Property Type</label>
            <div className="input-item">
              <select className="nice-select">
                <option>Apartments</option>
                <option>Condos</option>
                <option>Duplexes</option>
                <option>Houses</option>
                <option>Industrial</option>
                <option>Land</option>
                <option>Offices</option>
                <option>Retail</option>
                <option>Villas</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Property Category Type</label>
            <div className="input-item">
              <select className="nice-select">
                <option>Rent</option>
                <option>Sale</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Price</label>
            <input type="text" placeholder="0,00,000" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Unit</label>
            <div className="input-item">
              <select className="nice-select">
                <option>sq ft</option>
                <option>sq mt</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Area</label>
            <input type="text" placeholder="0" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>No. of bedrooms</label>
            <div className="input-item">
              <select className="nice-select">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="input-item">
            <label>Description</label>
            <textarea placeholder="Description" />
          </div>
        </div>
      </div>
      <h4 className="title-2">Featured Image</h4>
      <div className="row mb-50">
        <div className="col-md-12">
          <div className="input-item">
            <input type="file" className="btn theme-btn-3 mb-10" />
            <br />
            <p>
              <small>
                * At least 1 image is required for a valid submission. Minimum
                size is 500/500px.
              </small>
              <br />
              <small>* Supports JPG, JPEG and PNG formats.</small>
              <br />
              <small>* Images might take longer to be processed.</small>
            </p>
          </div>
        </div>
      </div>
      <h4 className="title-2">Add More Images</h4>
      <div className="row mb-50">
        <div className="col-md-12">
          <div className="input-item">
            <input type="file" className="btn theme-btn-3 mb-10" multiple />
            <br />
            <p>
              <small>
                * At least 1 image is required for a valid submission. Minimum
                size is 500/500px.
              </small>
              <br />
              <small>* Supports JPG, JPEG and PNG formats.</small>
              <br />
              <small>* Images might take longer to be processed.</small>
            </p>
          </div>
        </div>
      </div>
      <h4 className="title-2">Upload VR Tour</h4>
      <div className="row mb-50">
        <div className="col-md-12">
          <div className="input-item">
            <input type="file" className="btn theme-btn-3 mb-10" />
          </div>
        </div>
        <h5 className="mt-10">OR</h5>
        <div className="col-md-12">
          <div className="input-item">
            <input type="text" placeholder="Property VR URL" />
          </div>
        </div>
        <div className="col-md-12 mb-30">
          <label className="checkbox-item">
            Use the images to create a video slideshow instead of using virtual
            tour
            <input type="checkbox" />
            <span className="checkmark" />
          </label>
        </div>
      </div>
      <h4 className="title-2">Upload Documents</h4>
      <div className="row mb-50">
        <div className="col-md-8">
          <div className="input-item">
            <label>Brochure</label>
            <input type="file" className="btn theme-btn-3 mb-10" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="input-item">
            <label>Floor Plan</label>
            <input type="file" className="btn theme-btn-3 mb-10" />
          </div>
        </div>
        <div className="col-md-8 mb-20">
          <div className="input-item">
            <label>More Documents</label>
            <input type="file" className="btn theme-btn-3 mb-10" multiple />
          </div>
        </div>
      </div>
      <h4 className="title-2">Property Location</h4>
      <div className="row mb-30">
        <div className="col-lg-12">
          <div className="property-details-google-map mb-60">
            <iframe
              src="https://www.google.com/maps/embed"
              width="100%"
              height="100%"
              frameBorder={0}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Longitude</label>
            <input type="text" placeholder="Longitude" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Latitude</label>
            <input type="text" placeholder="Latitude" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Address</label>
            <input type="text" placeholder="Address" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>City</label>
            <input type="text" placeholder="City" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Postal Code</label>
            <input type="text" placeholder="Postal Code" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Region</label>
            <input type="text" placeholder="Region" />
          </div>
        </div>
        <div className="col-md-12">
          <div className="input-item">
            <label>Alloted To</label>
            <div className="input-item">
              <select className="nice-select">
                <option>Alex Paul</option>
                <option>James Fauster</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="btn theme-btn-1 btn-effect-1 text-uppercase"
      >
        Submit
      </button>
    </div>
  );
}
