import React, { useState, useEffect } from "react";

export default function AddProperty() {
  const [categoryFields, setCategoryFields] = useState([]);

  const [title, setTitle] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [price, setPrice] = useState();
  const [unit, setUnit] = useState();
  const [area, setArea] = useState();
  const [bedrooms, setBedrooms] = useState();
  const [description, setDescription] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [postalCode, setPostalCode] = useState();
  const [region, setRegion] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();

  const token = JSON.parse(sessionStorage.getItem("agentToken"));

  const loadCategoryFields = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/category/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
  };

  const createProperty = async (formData) => {
    return fetch(`${process.env.REACT_APP_API_URL}/property/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }).then((data) => data.json());
  };

  useEffect(() => {
    const response = loadCategoryFields();
    if (response) setCategoryFields(response.categoryFields);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createProperty({
      title,
      price,
      description,
      address,
      city,
      postalCode,
      region,
      longitude,
      latitude,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="ltn__myaccount-tab-content-inner">
      <h4 className="title-2">Property Description</h4>
      <div className="row mb-50">
        <div className="col-md-12">
          <div className="input-item">
            <label>
              Property Name - First line of address (for example: 30 Johns Road,
              SM1)
            </label>
            <input
              type="text"
              placeholder="Property Name"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Property Type</label>
            <div className="input-item">
              <select
                className="nice-select"
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option selected hidden disabled>
                  Select Property Type
                </option>
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
              <select
                className="nice-select"
                onChange={(e) => setPropertyCategoryType(e.target.value)}
              >
                <option selected hidden disabled>
                  Select Property Category Type
                </option>
                <option>Rent</option>
                <option>Sale</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Price</label>
            <input
              type="text"
              placeholder="0,00,000"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Unit</label>
            <div className="input-item">
              <select
                className="nice-select"
                onChange={(e) => setUnit(e.target.value)}
              >
                <option selected hidden disabled>
                  Select Unit
                </option>
                <option>sq ft</option>
                <option>sq mt</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>Area</label>
            <input
              type="text"
              placeholder="0"
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-item">
            <label>No. of bedrooms</label>
            <div className="input-item">
              <select
                className="nice-select"
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option selected hidden disabled>
                  Select No. of Bedrooms
                </option>
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
            <textarea
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
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
        <div className="col-md-6">
          <div className="input-item">
            <label>Longitude</label>
            <input
              type="text"
              placeholder="Longitude"
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Latitude</label>
            <input
              type="text"
              placeholder="Latitude"
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Address</label>
            <input
              type="text"
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>City</label>
            <input
              type="text"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Postal Code</label>
            <input
              type="text"
              placeholder="Postal Code"
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <label>Region</label>
            <input
              type="text"
              placeholder="Region"
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="btn theme-btn-1 btn-effect-1 text-uppercase"
      >
        Submit
      </button>
    </form>
  );
}
