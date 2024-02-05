import React, { useEffect } from "react";
import Select from "react-select";

const LocationForm = ({
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
  region,
  setRegion,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) => {
  // Function to update address fields based on the place object
  const setAddressFields = (place) => {
    place.address_components.forEach((component) => {
      const componentType = component.types[0];
      switch (componentType) {
        case "postal_code":
          setPostalCode(component.long_name);
          break;
        case "locality":
          setCity(component.long_name);
          break;
        case "country":
          setRegion(component.long_name);
          break;
        default:
          break;
      }
    });

    setLatitude(place.geometry.location.lat());
    setLongitude(place.geometry.location.lng());
  };

  // Initialize Google Maps Autocomplete and Marker
  useEffect(() => {
    const initAutocomplete = () => {
      if (!window.google) {
        console.error("Google Maps API not loaded");
        return;
      }

      const mapElement = document.getElementById("map");
      const autocompleteElement = document.getElementById("autocomplete");

      if (mapElement && autocompleteElement) {
        const map = new window.google.maps.Map(mapElement, {
          center: {
            lat: latitude || 24.466667,
            lng: longitude || 54.366669,
          },
          zoom: 17,
        });

        const marker = new window.google.maps.Marker({
          map,
          position: map.getCenter(),
          draggable: true,
        });

        const autocomplete = new window.google.maps.places.Autocomplete(
          autocompleteElement
        );
        autocomplete.bindTo("bounds", map);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert(`No details available for input: ${place.name}`);
            return;
          }

          setAddress(place.formatted_address);
          setAddressFields(place);

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }

          marker.setPosition(place.geometry.location);
        });

        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: position }, (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                setAddressFields(results[0]);
                setAddress(results[0].formatted_address);
              }
            }
          });
        });
      }
    };

    initAutocomplete();
  }, [latitude, longitude, setAddress, setCity, setPostalCode, setRegion]);

  return (
    <div>
      <h6>Listing Location</h6>
      <div className="row">
        <div className="col-md-12">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              id="autocomplete"
              name="ltn__name"
              placeholder="*Address"
            />
          </div>
        </div>
        <div className="col-lg-12 mb-map">
          <div className="property-details-google-map mb-60">
            <div id="map" className="map" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              value={city}
              name="ltn__name"
              onChange={(event) => setCity(event.target.value)}
              placeholder="City"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              value={postalCode}
              name="ltn__name"
              onChange={(event) => setPostalCode(event.target.value)}
              placeholder="Postal Code"
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              value={region}
              name="ltn__name"
              onChange={(event) => setRegion(event.target.value)}
              placeholder="Region"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
