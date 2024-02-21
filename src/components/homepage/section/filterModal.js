import React, { useState } from "react";
import Modal from "react-modal";
import {
  BEDROOMS,
  COMMERCIAL_PROPERTY,
  PARKING,
  PRICE_TYPE,
  PROPERTY_TYPES,
  RESIDENTIAL_PROPERTY,
  UNITS,
} from "../../../constants";
import Select from "react-select";

function FilterModal({ isOpen, onRequestClose, onFiltersChange }) {
  const [propertyCategoryType, setPropertyCategoryType] =
    useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [unit, setUnit] = useState();
  const [area, setArea] = useState();
  // const [selectedAreas, setSelectedAreas] = useState([]);
  const [bedrooms, setBedrooms] = useState();
  const [bathrooms, setBathrooms] = useState();
  const [parking, setParking] = useState();
  const [carSpace, setCarSpace] = useState();
  // Initializing states for checkboxes
  const [parkingChecked, setParkingChecked] = useState(false);
  const [disabilityAccess, setDisabilityAccess] = useState(false);
  const [internetConnectivity, setInternetConnectivity] = useState(false);
  const [alarms, setAlarms] = useState(false);
  const [cameras, setCameras] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [patio, setPatio] = useState(false);
  const [gardenSpace, setGardenSpace] = useState(false);

  const handleConfirm = () => {
    const newFilters = {
      propertyCategoryType,
      propertyType,
      minPrice,
      maxPrice,
      area,
      unit,
      // selectedAreas,
      bedrooms,
      bathrooms,
      parking,
      carSpace,
     
      // Including checkbox states
      parkingChecked,
      disabilityAccess,
      internetConnectivity,
      alarms,
      cameras,
      balcony,
      swimmingPool,
      patio,
      gardenSpace,
    };

    onFiltersChange(newFilters);
    onRequestClose();
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    switch (id) {
      case "parking":
        setParkingChecked(checked);
        break;
      case "disability-access":
        setDisabilityAccess(checked);
        break;
      case "internet-connectivity":
        setInternetConnectivity(checked);
        break;
      case "alarms":
        setAlarms(checked);
        break;
      case "cameras":
        setCameras(checked);
        break;
      case "balcony":
        setBalcony(checked);
        break;
      case "swimming-pool":
        setSwimmingPool(checked);
        break;
      case "patio":
        setPatio(checked);
        break;
      case "garden-space":
        setGardenSpace(checked);
        break;
      default:
        break;
    }
  };

  const propertyTypeOptions =
    propertyCategoryType === "commercial"
      ? COMMERCIAL_PROPERTY
      : RESIDENTIAL_PROPERTY;

  const handleAreaChange = (selectedOptions) => {
    setArea(selectedOptions);
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
                  <label htmlFor="property-category-type">
                    Property Category:
                  </label>
                  <Select
                    classNamePrefix={"custom-select"}
                    options={PROPERTY_TYPES}
                    value={PROPERTY_TYPES.find(
                      (option) => option.value === propertyCategoryType
                    )}
                    onChange={(selectedOption) =>
                      setPropertyCategoryType(selectedOption.value)
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label htmlFor="property-type">Property Type:</label>
                  <Select
                    classNamePrefix={"custom-select"}
                    options={propertyTypeOptions}
                    value={propertyTypeOptions.find(
                      (option) => option.value === propertyType
                    )}
                    onChange={(selectedOption) =>
                      setPropertyType(selectedOption.value)
                    }
                  />
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
                    options={areaOptions}
                    onChange={handleAreaChange}
                    value={area}
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
              {propertyCategoryType === "commercial" && (
                <div className="col-md-12">
                  {/* <h4>Additional Features</h4> */}
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="parking"
                      checked={parkingChecked}
                      onChange={handleCheckboxChange}
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
                      checked={disabilityAccess}
                      onChange={handleCheckboxChange}
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
                      checked={internetConnectivity}
                      onChange={handleCheckboxChange}
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
                      checked={alarms}
                      onChange={handleCheckboxChange}
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
                      checked={cameras}
                      onChange={handleCheckboxChange}
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
              {propertyCategoryType === "residential" && (
                <>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label htmlFor="bedrooms">Bedrooms:</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={BEDROOMS}
                        onChange={(selectedOption) =>
                          setBedrooms(selectedOption.value)
                        }
                        value={BEDROOMS.find(
                          (option) => option.value === bedrooms
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label htmlFor="bathrooms">Bathrooms:</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={BEDROOMS}
                        onChange={(selectedOption) =>
                          setBathrooms(selectedOption.value)
                        }
                        value={BEDROOMS.find(
                          (option) => option.value === bathrooms
                        )}
                      />
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
                      <Select
                        classNamePrefix="custom-select"
                        options={BEDROOMS}
                        onChange={(selectedOption) =>
                          setCarSpace(selectedOption.value)
                        }
                        value={BEDROOMS.find(
                          (option) => option.value === carSpace
                        )}
                      />
                    </div>
                  </div>
                  <h4>Outdoor Features</h4>
                  <div className="col-md-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="balcony"
                        checked={balcony}
                        onChange={handleCheckboxChange}
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
                        checked={swimmingPool}
                        onChange={handleCheckboxChange}
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
                        checked={patio}
                        onChange={handleCheckboxChange}
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
                        checked={gardenSpace}
                        onChange={handleCheckboxChange}
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
              <button
                className="btn theme-btn-1 btn-effect-1 text-uppercase search-btn mt-4"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FilterModal;
