import React, { useState } from "react";
import Modal from "react-modal";
import { PARKING, PRICE_TYPE, UNITS } from "../../../constants";
import Select from "react-select";

const propertyOptions = {
  commercial: [
    "Office",
    "Retail",
    "Shopping Center",
    "Shop",
    "Store",
    "Hotel",
    "Club Restaurant",
    "Hotel Room",
  ],
  residential: [
    "Apartments",
    "House",
    "Bungalow",
    "Studio",
    "Room",
    "Duplex",
    "Triplex",
    "Cottage",
  ],
};

function FilterModal({ isOpen, onRequestClose }) {
  //   const [modalIsOpen, setModalIsOpen] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState("commercial");
  const [propertyCategoryType, setPropertyCategoryType] = useState("sale");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [area, setArea] = useState();
  const [unit, setUnit] = useState();
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [bedrooms, setBedrooms] = useState();
  const [bathrooms, setBathrooms] = useState();
  const [parking, setParking] = useState();
  const [carSpace, setCarSpace] = useState();
  const [priceType, setPriceType] = useState();

  const handleChangeCategory = (event) => {
    setPropertyCategory(event.target.value);
  };

  // Generate area options
  const generateAreaOptions = () => {
    const options = [];
    for (let area = 200; area <= 15000; area += 400) {
      options.push({ value: area, label: `${area}+` });
    }
    return options;
  };

  const areaOptions = generateAreaOptions();

  // Generate price options
  const generatePriceOptions = () => {
    const options = [];
    for (let price = 50000; price <= 150000000; price += 5000000) {
      options.push({ value: price, label: `AED ${price.toLocaleString()}` });
    }
    return options;
  };

  const priceOptions = generatePriceOptions();

  // Lock the background scroll when the modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset the overflow when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="MyModal Modal-size-unset"
        overlayClassName="MyModalOverlay"
        style={{
          content: {
            maxWidth: "700px",
            width: "90%",
            margin: "auto",
            overflowY: "auto",
            height: "auto",
            maxHeight: "90vh",
          },
        }}
      >
        <div className="modal-content">
          <div className="modal-header text-center">
            <h2 className="modal-header2">Filters</h2>
            <button className="close" onClick={onRequestClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row mb-custom">
              <div className="col-md-6">
                <div className="input-item">
                  <label>I'm looking to</label>
                  <select
                    className="nice-select"
                    onChange={(e) => setPropertyCategoryType(e.target.value)}
                    defaultValue={"sale"}
                  >
                    <option value={"sale"}>Buy</option>
                    <option value={"rent"}>Rent</option>
                  </select>
                </div>
              </div>
              {propertyCategoryType === "rent" && (
                <div className="col-md-6">
                  <div className="input-item">
                    <label>Price Type</label>
                    <Select
                      classNamePrefix="custom-select"
                      options={PRICE_TYPE} 
                      onChange={(e) => setPriceType(e)}
                      value={priceType}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="col-md-6">
                <div className="input-item">
                  <label htmlFor="property-category">Property Category:</label>
                  <select
                    id="property-category"
                    value={propertyCategory}
                    onChange={handleChangeCategory}
                    className="nice-select"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label htmlFor="property-type">Property Type:</label>
                  <select id="property-type" className="nice-select">
                    {propertyOptions[propertyCategory].map((type, index) => (
                      <option
                        key={index}
                        value={type.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* <hr /> */}
              <h4>Price Range</h4>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Minimum Price</label>
                  <Select
                    classNamePrefix="custom-select"
                    options={priceOptions}
                    value={priceOptions.find(
                      (option) => option.value === minPrice
                    )}
                    onChange={(selectedOption) =>
                      setMinPrice(selectedOption.value)
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Maximum Price</label>
                  <Select
                    classNamePrefix="custom-select"
                    options={priceOptions}
                    value={priceOptions.find(
                      (option) => option.value === maxPrice
                    )}
                    onChange={(selectedOption) =>
                      setMaxPrice(selectedOption.value)
                    }
                  />
                </div>
              </div>
              <h4>Area</h4>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Area *</label>
                  <Select
                    classNamePrefix="custom-select"
                    isMulti
                    options={areaOptions}
                    onChange={setSelectedAreas}
                    value={selectedAreas}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Unit *</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={UNITS}
                      onChange={(e) => setUnit(e)}
                      value={unit}
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Conditionally render checkboxes if property category is commercial */}
              {propertyCategory === "commercial" && (
                <div className="col-md-12">
                  {/* <h4>Additional Features</h4> */}
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="parking"
                    />
                    <label className="form-check-label" htmlFor="parking">
                      Parking
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="disability-access"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="disability-access"
                    >
                      Disability Access
                    </label>
                  </div>
                  <div className="form-check mb-15">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="internet-connectivity"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="internet-connectivity"
                    >
                      Internet Connectivity
                    </label>
                  </div>
                  <h4>Security System</h4>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="alarms"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="internet-connectivity"
                    >
                      Alarms
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="cameras"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="internet-connectivity"
                    >
                      Cameras
                    </label>
                  </div>
                </div>
              )}
              {/* Conditionally render checkboxes and select fields if property category is residentials */}
              {propertyCategory === "residential" && (
                <>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label htmlFor="bedrooms">Bedrooms:</label>
                      <select
                        id="bedrooms"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="nice-select"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label htmlFor="bathrooms">Bathrooms:</label>
                      <select
                        id="bathrooms"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        className="nice-select"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                  </div>
                  <h4>Parking</h4>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Parking::</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={PARKING} // PARKING should be an array of { value, label } objects
                        onChange={(selectedOption) =>
                          setParking(
                            selectedOption ? selectedOption.value : null
                          )
                        }
                        value={PARKING.find(
                          (option) => option.value === parking
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>No of Spaces:</label>
                      <select
                        id="car-spaces"
                        value={carSpace}
                        onChange={(e) => setCarSpace(e.target.value)}
                        className="nice-select"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                  </div>
                  <h4>Outdoor Features</h4>
                  <div className="col-md-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="balcony"
                      />
                      <label className="form-check-label" htmlFor="parking">
                        Balcony
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="swimming-pool"
                      />
                      <label className="form-check-label" htmlFor="parking">
                        Swimming Pool
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="Patio"
                      />
                      <label className="form-check-label" htmlFor="parking">
                        Patio
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="garden-space"
                      />
                      <label className="form-check-label" htmlFor="parking">
                        Garden Space
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-btn">
              <button className="btn theme-btn-1 btn-effect-1 text-uppercase search-btn mt-4">
                Search
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FilterModal;
