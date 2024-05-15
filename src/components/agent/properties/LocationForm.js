import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places", "drawing"];

const LocationForm = ({
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
  region,
  setRegion,
  latitude = -34.397,
  longitude = 150.644,
  setLatitude,
  setLongitude,
}) => {
  // Google Maps API options
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    // googleMapsApiKey: process.env.GOOGLE_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  // Ensure latitude and longitude are numbers
  const lat = Number(latitude);
  const lng = Number(longitude);

  // const [addressInput, setAddressInput] = useState("");
  const [markerPosition, setMarkerPosition] = useState({ lat, lng });
  const geocoder = useRef(null);
  const autocompleteRef = useRef(null);
  const options = {};

  const onMapLoad = useCallback((map) => {
    setMap(map);
    // Center map on the initial location
    if (markerPosition) {
      map.panTo(markerPosition);
    }
  }, [markerPosition]);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setMarkerPosition({ lat: newLat, lng: newLng });
          setLatitude(newLat);
          setLongitude(newLng);
          if (map) {
            map.panTo({ lat: newLat, lng: newLng });
          }
        },
        () => {
          console.error("Error fetching the current location");
        }
      );
    }
  };

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

    // setLatitude(place.geometry.location.lat());
    // setLongitude(place.geometry.location.lng());
  };

  const onAutocompleteLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
    // autocompleteRef.current.setFields(['address_component', 'geometry', 'name']);
  }, []);

  const onPlaceSelected = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        setLatitude(newLat);
        setLongitude(newLng);
        setMarkerPosition({ lat: newLat, lng: newLng });
        setAddress(place.formatted_address);
        setAddressFields(place);
        if (map) {
          map.panTo({ lat: newLat, lng: newLng });
        }
      } else {
        console.log("No details available for input: '" + place.name + "'");
      }
    }
  }, [setAddress, setLatitude, setLongitude, setAddressFields, map]);

  const onMarkerDragEnd = useCallback((e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setLatitude(newLat);
    setLongitude(newLng);
    setMarkerPosition({ lat: newLat, lng: newLng });

    // Perform reverse geocoding
    if (geocoder.current) {
      geocoder.current.geocode(
        { location: { lat: newLat, lng: newLng } },
        (results, status) => {
          if (status === "OK" && results[0]) {
            setAddress(results[0].formatted_address);
            setAddressFields(results[0]);
            if (map) {
              map.panTo({ lat: newLat, lng: newLng });
            }
          } else {
            console.error("Geocoder failed due to: " + status);
          }
        }
      );
    }
  }, [setAddress, setLatitude, setLongitude, setAddressFields, map]);

  useEffect(() => {
    if (isLoaded) {
      geocoder.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  useEffect(() => {
    setMarkerPosition({ lat: Number(latitude), lng: Number(longitude) });
  }, [latitude, longitude]);

  useEffect(() => {
    fetchCurrentLocation(); // Fetch the current location when the component mounts
  }, []);

  

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h6>Listing Location</h6>
      <div className="row">
        <div className="col-md-12">
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceSelected}
          >
            <input
              ref={autocompleteRef}
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              id="autocomplete3"
              placeholder="*Address"
            />
          </Autocomplete>
        </div>
        <div className="col-lg-12 mb-map">
          <div className="property-details-google-map mb-60">
            <GoogleMap
              id="map"
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={markerPosition}
              zoom={17}
              onLoad={onMapLoad}
              onUnmount={onMapUnmount}
            >
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={onMarkerDragEnd}
              />
            </GoogleMap>
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
