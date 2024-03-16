import React, { useState } from "react";
import Modal from "react-modal";
import {
  BEDROOMS,
  BUILDING_AMENITIES_OPTIONS,
  COMMERCIAL_PROPERTY,
  CONDITION_OPTIONS,
  DISPLAY_WINDOW_OPTIONS,
  FIREPLACE_VALUE_OPTIONS,
  FURNISHED_OPTIONS,
  KITCHEN_OPTIONS,
  LAYOUT_OPTIONS,
  PARKING,
  PARKING_OPTION_TYPES,
  POOL_TYPE_OPTIONS,
  PRICE_TYPE,
  PROPERTY_TYPES,
  RESIDENTIAL_PROPERTY,
  ROOM_TYPE_OPTIONS,
  SECURITY_FEATURES_OPTIONS,
  UNITS,
  VIEW_OPTIONS,
  YES_NO_OPTIONS,
} from "../../../constants";
import Select from "react-select";

function FilterModal({ isOpen, onRequestClose, onFiltersChange }) {
  // common features
  const [propertyType, setPropertyType] = useState("");
  const [propertySubType, setPropertySubType] = useState("");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [unit, setUnit] = useState();
  const [area, setArea] = useState();
  const [securityFeatures, setSecurityFeatures] = useState(false);
  const [alaramCameraB, setAlaramCameraB] = useState("");
  const [disabilityAccess, setDisabilityAccess] = useState(false);
  const [publicTransport, setPublicTransport] = useState(false);
  const [yearBuilt, setYearBuilt] = useState("");
  const [condition, setCondition] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState("");

  // commercial features
  const [layout, setLayout] = useState("");
  const [conferenceRoom, setConferenceRoom] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [store, setStore] = useState("");
  const [foodCourt, setFoodCourt] = useState(false);
  const [restRoom, setRestRoom] = useState(false);
  const [pools, setPools] = useState("");
  const [poolType, setPoolType] = useState("");
  const [hotelRoom, setHotelRoom] = useState("");
  const [areaBar, setAreaBar] = useState(0);
  const [loungeArea, setLoungeArea] = useState(0);
  const [capacityOfVip, setCapacityOfVip] = useState(0);
  const [noOfDanceFloor, setNoOfDanceFloor] = useState(0);
  const [noOfPrivateRooms, setNoOfPrivateRooms] = useState(0);
  const [kitchenArea, setKitchenArea] = useState(0);
  const [outdoorSeating, setOutdoorSeating] = useState(false);
  const [outdoorSeatingArea, setOutdoorSeatingArea] = useState(0);
  const [roomSize, setRoomSize] = useState(0);
  const [noOfBeds, setNoOfBeds] = useState(0);
  const [roomType, setRoomType] = useState("");
  const [floorLevel, setFloorLevel] = useState(0);
  const [view, setView] = useState("");
  const [balcony, setBalcony] = useState(false);
  const [displayWindowArea, setDisplayWindowArea] = useState(0);
  const [displayWindow, setDisplayWindow] = useState("");

  const [petFreindliness, setPetFreindliness] = useState(false);
  const [commercialParking, setCommercialParking] = useState(false);
  const [noOfSpacesCommercial, setNoOfSpacesCommercial] = useState(0);

  {
    /** Residential */
  }
  const [residentialFloorLevel, setResidentialFloorLevel] = useState(0);
  const [buildingAmenities, setBuildingAmenities] = useState([]);

  const [fireplace, setFireplace] = useState(false);
  const [woodBurning, setWoodBurning] = useState(false);
  const [noOfFloors, setNoOfFloors] = useState(0);
  const [basement, setBasement] = useState(false);
  const [residentialKitchen, setResidentialKitchen] = useState("");

  const [outdoorSpaces, setOutdoorSpaces] = useState([]);
  const [noOfBathrooms, setNoOfBathrooms] = useState(0);
  const [furnished, setFurnished] = useState(false);
  const [parkingResidential, setParkingResidential] = useState(false);
  const [parkingType, setParkingType] = useState("");
  const [garageSpaces, setGarageSpaces] = useState(0);

  const handleConfirm = () => {
    const newFilters = {
      propertyType,
      propertySubType,
      minPrice,
      maxPrice,
      area,
      unit,
      securityFeatures,
      alaramCameraB,
      disabilityAccess,
      publicTransport,
      yearBuilt,
      condition,
      availabilityDate,
      // commercial features
      layout,
      conferenceRoom,
      capacity,
      kitchen,
      store,
      foodCourt,
      restRoom,
      pools,
      poolType,
      hotelRoom,
      areaBar,
      loungeArea,
      capacityOfVip,
      noOfDanceFloor,
      noOfPrivateRooms,
      kitchenArea,
      outdoorSeating,
      outdoorSeatingArea,
      roomSize,
      noOfBeds,
      roomType,
      floorLevel,
      view,
      balcony,
      displayWindowArea,
      displayWindow,
      // residential
      residentialFloorLevel,
      buildingAmenities,
      fireplace,
      woodBurning,
      noOfFloors,
      basement,
      residentialKitchen,
      petFreindliness,
      commercialParking,
      noOfSpacesCommercial,
      
      outdoorSpaces,
      noOfBathrooms,
      furnished,
      parkingResidential,
      parkingType,
      garageSpaces,
    };

    onFiltersChange(newFilters);
    onRequestClose();
  };

  // const handleCheckboxChange = (e) => {
  //   const { id, checked } = e.target;
  //   switch (id) {
  //     case "parking":
  //       setParkingChecked(checked);
  //       break;
  //     case "disability-access":
  //       setDisabilityAccess(checked);
  //       break;
  //     case "internet-connectivity":
  //       setInternetConnectivity(checked);
  //       break;
  //     case "alarms":
  //       setAlarms(checked);
  //       break;
  //     case "cameras":
  //       setCameras(checked);
  //       break;
  //     case "balcony":
  //       setBalcony(checked);
  //       break;
  //     case "swimming-pool":
  //       setSwimmingPool(checked);
  //       break;
  //     case "patio":
  //       setPatio(checked);
  //       break;
  //     case "garden-space":
  //       setGardenSpace(checked);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const propertyTypeOptions =
    propertyType === "commercial" ? COMMERCIAL_PROPERTY : RESIDENTIAL_PROPERTY;

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
                      (option) => option.value === propertyType
                    )}
                    onChange={(selectedOption) =>
                      setPropertyType(selectedOption.value)
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label htmlFor="property-type">Property Sub Type:</label>
                  <Select
                    classNamePrefix={"custom-select"}
                    options={propertyTypeOptions}
                    value={propertyTypeOptions.find(
                      (option) => option.value === propertySubType
                    )}
                    onChange={(selectedOption) =>
                      setPropertySubType(selectedOption.value)
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
              <div className="col-md-6">
                <div className="input-item">
                  <label>Security Features</label>
                  <Select
                    classNamePrefix="custom-select"
                    options={YES_NO_OPTIONS}
                    onChange={(selectedOption) =>
                      setSecurityFeatures(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    value={YES_NO_OPTIONS.find(
                      (option) => option.value === securityFeatures
                    )}
                  />
                </div>
              </div>
              {securityFeatures === "yes" && (
                <div className="col-md-6">
                  <div className="input-item">
                    <label>Alaram/Camera</label>
                    <Select
                      classNamePrefix="custom-select"
                      options={SECURITY_FEATURES_OPTIONS}
                      onChange={(selectedOption) =>
                        setAlaramCameraB(
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      value={SECURITY_FEATURES_OPTIONS.find(
                        (option) => option.value === alaramCameraB
                      )}
                    />
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div className="input-item">
                  <label>Disability Access</label>
                  <Select
                    classNamePrefix="custom-select"
                    options={YES_NO_OPTIONS}
                    onChange={(selectedOption) =>
                      setDisabilityAccess(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    value={YES_NO_OPTIONS.find(
                      (option) => option.value === disabilityAccess
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Public Transport</label>
                  <Select
                    classNamePrefix="custom-select"
                    options={YES_NO_OPTIONS}
                    onChange={(selectedOption) =>
                      setPublicTransport(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    value={YES_NO_OPTIONS.find(
                      (option) => option.value === publicTransport
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Year Built</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setYearBuilt(e.target.value)}
                    value={yearBuilt}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Condition</label>
                  <Select
                    classNamePrefix="custom-select"
                    options={CONDITION_OPTIONS}
                    onChange={(selectedOption) =>
                      setCondition(selectedOption ? selectedOption.value : "")
                    }
                    value={CONDITION_OPTIONS.find(
                      (option) => option.value === condition
                    )}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-item">
                  <label>Availability Date</label>
                  <input
                    type="date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              {propertyType === "commercial" && (
                <>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Pet Freindliness</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={YES_NO_OPTIONS}
                        onChange={(selectedOption) =>
                          setPetFreindliness(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        value={YES_NO_OPTIONS.find(
                          (option) => option.value === petFreindliness
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Parking Facility</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={YES_NO_OPTIONS}
                        onChange={(selectedOption) =>
                          setCommercialParking(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        value={YES_NO_OPTIONS.find(
                          (option) => option.value === commercialParking
                        )}
                      />
                    </div>
                  </div>
                  {commercialParking === "yes" && (
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Number of Spaces</label>
                        <input
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            setNoOfSpacesCommercial(e.target.value)
                          }
                          value={noOfSpacesCommercial}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {propertyType === "residential" && (
                <>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Outdoor Spaces</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={YES_NO_OPTIONS}
                        onChange={(selectedOption) =>
                          setOutdoorSpaces(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        value={YES_NO_OPTIONS.find(
                          (option) => option.value === outdoorSpaces
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Number of Bathrooms</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setNoOfBathrooms(e.target.value)}
                        value={noOfBathrooms}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Furnished</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={FURNISHED_OPTIONS}
                        onChange={(selectedOption) =>
                          setFurnished(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        value={FURNISHED_OPTIONS.find(
                          (option) => option.value === furnished
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Parking Facility</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={YES_NO_OPTIONS}
                        onChange={(selectedOption) =>
                          setParkingResidential(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        value={YES_NO_OPTIONS.find(
                          (option) => option.value === parkingResidential
                        )}
                      />
                    </div>
                  </div>
                  {parkingResidential === "yes" && (
                    <>
                      <div className="col-md-6">
                        <div className="input-item">
                          <label>Parking Type</label>
                          <Select
                            classNamePrefix="custom-select"
                            options={PARKING_OPTION_TYPES}
                            onChange={(selectedOption) =>
                              setParkingType(
                                selectedOption ? selectedOption.value : ""
                              )
                            }
                            value={PARKING_OPTION_TYPES.find(
                              (option) => option.value === parkingType
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-item">
                          <label>Number of Parking</label>
                          <input
                            type="number"
                            placeholder="0"
                            onChange={(e) => setGarageSpaces(e.target.value)}
                            value={garageSpaces}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              {/* Commercial property features */}
              {propertyType === "commercial" &&
                propertySubType === "office" && (
                  <>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Layout</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={LAYOUT_OPTIONS}
                          onChange={(selectedOption) =>
                            setLayout(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={LAYOUT_OPTIONS.find(
                            (option) => option.value === layout
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Conference Room</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={YES_NO_OPTIONS}
                          onChange={(selectedOption) =>
                            setConferenceRoom(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={YES_NO_OPTIONS.find(
                            (option) => option.value === conferenceRoom
                          )}
                        />
                      </div>
                    </div>
                    {conferenceRoom === "yes" && (
                      <div className="col-md-6">
                        <div className="input-item">
                          <label>Capacity</label>
                          <input
                            type="number"
                            placeholder="0"
                            onChange={(e) => setCapacity(e.target.value)}
                            value={capacity}
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Kitchen</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={KITCHEN_OPTIONS}
                          onChange={(selectedOption) =>
                            setKitchen(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={KITCHEN_OPTIONS.find(
                            (option) => option.value === kitchen
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
              {propertyType === "commercial" &&
                propertySubType === "shopping_center" && (
                  <>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Number of Stores</label>
                        <input
                          type="number"
                          placeholder="0"
                          onChange={(e) => setStore(e.target.value)}
                          value={store}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Food Court</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={YES_NO_OPTIONS}
                          onChange={(selectedOption) =>
                            setFoodCourt(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={YES_NO_OPTIONS.find(
                            (option) => option.value === foodCourt
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Rest Room</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={YES_NO_OPTIONS}
                          onChange={(selectedOption) =>
                            setRestRoom(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={YES_NO_OPTIONS.find(
                            (option) => option.value === restRoom
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
              {propertyType === "commercial" && propertySubType === "hotel" && (
                <>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Number of Pools</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setPools(e.target.value)}
                        value={pools}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Pool Type</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={POOL_TYPE_OPTIONS}
                        onChange={(selectedOption) =>
                          setPoolType(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        value={POOL_TYPE_OPTIONS.find(
                          (option) => option.value === poolType
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Number of Rooms</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setHotelRoom(e.target.value)}
                        value={hotelRoom}
                      />
                    </div>
                  </div>
                </>
              )}
              {propertyType === "commercial" && propertySubType === "club" && (
                <>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Area of Bar</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setAreaBar(e.target.value)}
                        value={areaBar}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Lounge Area</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setLoungeArea(e.target.value)}
                        value={loungeArea}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Capacity of VIP</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setCapacityOfVip(e.target.value)}
                        value={capacityOfVip}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Number of Dance Floor</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setNoOfDanceFloor(e.target.value)}
                        value={noOfDanceFloor}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Number of Private Rooms</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setNoOfPrivateRooms(e.target.value)}
                        value={noOfPrivateRooms}
                      />
                    </div>
                  </div>
                </>
              )}
              {propertyType === "commercial" &&
                propertySubType === "restaurant" && (
                  <>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Kitchen Area</label>
                        <input
                          type="number"
                          placeholder="0"
                          onChange={(e) => setKitchenArea(e.target.value)}
                          value={kitchenArea}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Outdoor Seating</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={YES_NO_OPTIONS}
                          onChange={(selectedOption) =>
                            setOutdoorSeating(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={YES_NO_OPTIONS.find(
                            (option) => option.value === outdoorSeating
                          )}
                        />
                      </div>
                    </div>
                    {outdoorSeating === "yes" && (
                      <div className="col-md-6">
                        <div className="input-item">
                          <label>Outdoor Seating Area</label>
                          <input
                            type="number"
                            placeholder="0"
                            onChange={(e) =>
                              setOutdoorSeatingArea(e.target.value)
                            }
                            value={outdoorSeatingArea}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              {propertyType === "commercial" &&
                propertySubType === "hotel_room" && (
                  <>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Room Size</label>
                        <input
                          type="number"
                          placeholder="0"
                          onChange={(e) => setRoomSize(e.target.value)}
                          value={roomSize}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Number of Beds</label>
                        <input
                          type="number"
                          placeholder="0"
                          onChange={(e) => setNoOfBeds(e.target.value)}
                          value={noOfBeds}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Room Type</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={ROOM_TYPE_OPTIONS}
                          onChange={(selectedOption) =>
                            setRoomType(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={ROOM_TYPE_OPTIONS.find(
                            (option) => option.value === roomType
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Floor Level</label>
                        <input
                          type="number"
                          placeholder="0"
                          onChange={(e) => setFloorLevel(e.target.value)}
                          value={floorLevel}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>View</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={VIEW_OPTIONS}
                          onChange={(selectedOption) =>
                            setView(selectedOption ? selectedOption.value : "")
                          }
                          value={VIEW_OPTIONS.find(
                            (option) => option.value === view
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Balcony</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={YES_NO_OPTIONS}
                          onChange={(selectedOption) =>
                            setBalcony(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={YES_NO_OPTIONS.find(
                            (option) => option.value === balcony
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
              {((propertyType === "commercial" &&
                propertySubType === "retail") ||
                propertySubType === "shop" ||
                propertySubType === "store") && (
                <>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Display Window Area</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setDisplayWindowArea(e.target.value)}
                        value={displayWindowArea}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item">
                      <label>Display Window</label>
                      <Select
                        classNamePrefix="custom-select"
                        options={DISPLAY_WINDOW_OPTIONS}
                        onChange={(selectedOption) =>
                          setDisplayWindow(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        value={DISPLAY_WINDOW_OPTIONS.find(
                          (option) => option.value === displayWindow
                        )}
                      />
                    </div>
                  </div>
                </>
              )}

              {}

              {propertyType === "residential" &&
                (propertySubType === "apartment" ||
                  propertySubType === "studio" ||
                  propertySubType === "room") && (
                  <>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Floor Level</label>
                        <input
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            setResidentialFloorLevel(e.target.value)
                          }
                          value={residentialFloorLevel}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Building Amenities</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={BUILDING_AMENITIES_OPTIONS}
                          onChange={(selectedOption) =>
                            setBuildingAmenities(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={BUILDING_AMENITIES_OPTIONS.find(
                            (option) => option.value === buildingAmenities
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

              {propertyType === "residential" &&
                (propertySubType === "house" ||
                  propertySubType === "bungalow" ||
                  propertySubType === "duplex" ||
                  propertySubType === "triplex" ||
                  propertySubType === "cottage") && (
                  <>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Fireplace</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={YES_NO_OPTIONS}
                          onChange={(selectedOption) =>
                            setFireplace(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={YES_NO_OPTIONS.find(
                            (option) => option.value === fireplace
                          )}
                        />
                      </div>
                    </div>
                    {fireplace === "yes" && (
                      <div className="col-md-6">
                        <div className="input-item">
                          <label>Wood Burning</label>
                          <Select
                            classNamePrefix="custom-select"
                            options={FIREPLACE_VALUE_OPTIONS}
                            onChange={(selectedOption) =>
                              setWoodBurning(
                                selectedOption ? selectedOption.value : ""
                              )
                            }
                            value={FIREPLACE_VALUE_OPTIONS.find(
                              (option) => option.value === woodBurning
                            )}
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Number of Floors</label>
                        <input
                          type="number"
                          placeholder="0"
                          onChange={(e) => setNoOfFloors(e.target.value)}
                          value={noOfFloors}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Basement</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={YES_NO_OPTIONS}
                          onChange={(selectedOption) =>
                            setBasement(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={YES_NO_OPTIONS.find(
                            (option) => option.value === basement
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item">
                        <label>Kitchen</label>
                        <Select
                          classNamePrefix="custom-select"
                          options={KITCHEN_OPTIONS}
                          onChange={(selectedOption) =>
                            setResidentialKitchen(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={KITCHEN_OPTIONS.find(
                            (option) => option.value === residentialKitchen
                          )}
                        />
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
