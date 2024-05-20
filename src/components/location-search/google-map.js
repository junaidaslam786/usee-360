
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Circle,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import HomepageService from "../../services/homepage";
import { formatPrice } from "../../utils";
import { useHistory } from "react-router-dom";
import "./location-search.css";
import { RADIUS_OPTIONS } from "../../constants";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const options = {
  disableDefaultUI: false, // Or simply remove this line to use default UI
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: true,
};

const libraries = ["places", "drawing"];

const GoogleMapsSearch = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    libraries,
  });

  const [currentLocation, setCurrentLocation] = useState({
    lat: 24.466667,
    lng: 54.366669,
  });

  const mapRef = useRef(null);
  const [active, setActive] = useState(false);
  const [properties, setProperties] = useState([]);
  const [radius, setRadius] = useState(0);
  const [polygons, setPolygons] = useState([]);
  const [showRadius, setShowRadius] = useState(false);
  const [map, setMap] = useState(null);
  const [streetViewPosition, setStreetViewPosition] = useState(null);
  const [drawingMode, setDrawingMode] = useState(null);

  const history = useHistory();

  const searchBoxRef = useRef(null);
  const searchInputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const [markers, setMarkers] = useState([]);
  const [address, setAddress] = useState("");

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const resetMapState = () => {
    polygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    setPolygons([]);

    markers.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkers([]);
    setProperties([]);
    setAddress("");
    setShowRadius(false);
  };

  const handleGotoProperties = () => {
    history.push({
      pathname: "/services/properties",
      state: { properties: properties, source: "google-maps" },
    });
  };

  const searchByCircle = useCallback(async () => {
    if (!showRadius) return;
    const reqBody = {
      center: currentLocation,
      radius: radius,
    };
    try {
      const data = await HomepageService.searchByCircle(reqBody);
      console.log("data", data);

      const detailPromises = data.map(async (property) => {
        return HomepageService.propertyDetail(property.id);
      });

      const propertiesWithDetails = await Promise.all(detailPromises);

      console.log("propertiesWithDetails", propertiesWithDetails);

      setProperties(propertiesWithDetails);
    } catch (err) {
      console.log(err);
      setProperties([]);
    }
  }, [currentLocation, radius]);

  const onDragEnd = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setCurrentLocation(newLocation);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newLocation }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
        setInputValue(results[0].formatted_address); // Update input value to show new address
      } else {
        console.error("Cannot find address");
      }
    });
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentLocation(newLocation);
        },
        (error) => {
          console.error("Error fetching the location", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleActive = () => {
    setActive(!active);
  };

  const searchPropertiesInPolygon = useCallback(
    async (polygon) => {
      try {
        let coordinates = polygon
          .getPath()
          .getArray()
          .map((point) => `${point.lng()} ${point.lat()}`);

        const properties = await HomepageService.searchByPolygon({
          coordinates: coordinates, // This now correctly matches the backend expectation
        });

        setProperties(properties || []);

        // Clear existing markers
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]); // Reset markers state

        // Add new markers for found properties
        const newMarkers = properties.map((property) => {
          const marker = new window.google.maps.Marker({
            position: { lat: property.latitude, lng: property.longitude },
            map: mapRef.current,
            icon: "/assets/img/icons/property-marker.png", // Adjust path as necessary
            title: property.name || property.id, // Optionally set a title
          });
          marker.addListener("click", () =>
            history.push(`/property-details/${property.id}`)
          );
          return marker;
        });

        setMarkers(newMarkers); // Update state with new markers
      } catch (error) {
        console.error("Failed to search properties by polygon:", error);
        setProperties([]);
        // Handle error (e.g., show an error message)
      }
    },
    [markers, history] // Ensure dependencies are correctly listed
  );

  const handlePolygonComplete = useCallback(
    (overlay) => {
      if (overlay instanceof window.google.maps.Polygon) {
        const polygon = overlay;

        searchPropertiesInPolygon(polygon);
        setPolygons((prevPolygons) => [...prevPolygons, overlay]);
      }
    },
    [searchPropertiesInPolygon, polygons] // Add dependencies to avoid rerenders
  );

  useEffect(() => {
    if (!isLoaded) return; // Ensure the Google script is loaded

    // Initialize Google Places Autocomplete
    const inputElement = searchInputRef.current;
    if (inputElement && inputElement instanceof HTMLInputElement) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputElement
      );
      autocomplete.setFields([
        "address_components",
        "geometry",
        "icon",
        "name",
      ]);

      const handlePlaceSelect = () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        // Update location and input value
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCurrentLocation(location);
        setInputValue(place.name);
        setMarkers([]);

        // Perform a search within the specified radius
        if (mapRef.current) {
          const service = new window.google.maps.places.PlacesService(
            mapRef.current
          );
          service.nearbySearch(
            {
              location,
              radius: radius,
              type: ["properties"], // Example: search for restaurants, adjust types as needed
            },
            (results, status) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                const newMarkers = results.map((result) => ({
                  lat: result.geometry.location.lat(),
                  lng: result.geometry.location.lng(),
                }));
                setMarkers(newMarkers);
              }
            }
          );
        }
      };

      autocomplete.addListener("place_changed", handlePlaceSelect);

      // Clean up
      return () => {
        window.google.maps.event.clearInstanceListeners(inputElement);
      };
    } else {
      console.error(
        "searchInputRef is not attached to a valid HTMLInputElement"
      );
    }
  }, [isLoaded]); // Depend on the isLoaded state to re-run when Google script is loaded

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: drawingMode,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.LEFT_TOP,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: "#FFFF00",
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(mapRef.current);

    const overlayCompleteListener = (e) => {
      if (e.type !== window.google.maps.drawing.OverlayType.POLYGON) return;

      const polygon = e.overlay;
      searchPropertiesInPolygon(polygon);
    };

    window.google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      overlayCompleteListener
    );

    // Cleanup
    return () => {
      window.google.maps.event.clearListeners(
        drawingManager,
        "overlaycomplete"
      );
    };
  }, [isLoaded, mapRef, searchPropertiesInPolygon]);

  useEffect(() => {
    // Only search if showRadius is true and other conditions are met
    if (showRadius && currentLocation.lat && currentLocation.lng && radius) {
      searchByCircle();
    }
  }, [showRadius, currentLocation, radius]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.value = address;
      }, 100); // Adjust delay as necessary
    }
  }, [address]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <ErrorBoundary>
      <div>
        <div className="top-bar">
          <input
            ref={searchInputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for places..."
            style={{
              width: "25%",
              height: "auto",
              marginBottom: 0,
              paddingInline: "5px",
            }}
            className="search-box"
          />

          <button
            onClick={() => {
              const newShowRadius = !showRadius;
              setShowRadius(newShowRadius);
              setDrawingMode(
                newShowRadius
                  ? null
                  : window.google.maps.drawing.OverlayType.POLYGON
              );
              if (!newShowRadius) {
                searchByCircle();
              }
            }}
          >
            {showRadius ? "Hide Radius" : "Search by Radius"}
          </button>

          <select
            id="radiusSelect"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          >
            {RADIUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            className={`open-button ${active ? "" : "closed-button"}`}
            onClick={handleActive}
          >
            {active ? "<-- Close Sidebar" : "Open Sidebar -->"}
          </button>
          <button onClick={resetMapState}>Reset Map</button>
          <button onClick={handleGotoProperties}>Go To Properties</button>
          <button onClick={getCurrentLocation}>Get Current Location</button>
        </div>

        <GoogleMap
          id="map"
          ref={mapRef}
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={currentLocation}
          onLoad={onMapLoad}
          onUnmount={onUnmount}
          options={options}
          mapTypeControlOptions={{
            position: window.google.maps.ControlPosition.TOP_LEFT,
          }}
        >
          <Marker
            position={currentLocation}
            onClick={() => setStreetViewPosition(currentLocation)}
            icon={{
              url: "/assets/img/icons/map-marker-2.png",
            }}
            draggable={true}
            onDragEnd={onDragEnd}
          />

          {polygons.map((polygon, index) => (
            <Polygon
              key={index}
              paths={polygon
                .getPath()
                .getArray()
                .map((latLng) => ({
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                }))}
              options={{ fillColor: "#FF0000" }}
            />
          ))}
          <DrawingManager
            drawingMode={drawingMode}
            onPolygonComplete={handlePolygonComplete}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
                drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
              },
              polygonOptions: { fillColor: "#FF0000" },
            }}
          />
          {properties &&
            Array.isArray(properties) &&
            properties.map((property) => (
              <Marker
                key={property.id}
                position={{
                  lat: parseFloat(property.latitude),
                  lng: parseFloat(property.longitude),
                }}
                icon={{
                  url: "/assets/img/icons/property-marker.png",
                  scaledSize: new window.google.maps.Size(38, 38),
                }}
                onClick={() => history.push(`/property-details/${property.id}`)}
              />
            ))}

          {showRadius && (
            <Circle
              center={currentLocation}
              radius={radius}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
              }}
            />
          )}
        </GoogleMap>
      </div>
      <div className={`sidebarforsearch ${active ? "isActive" : ""}`}>
        <div className="scrollable">
          {properties &&
            properties.length > 0 &&
            properties.map((element, i) => (
              <div key={element.id} className="content-box">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${element?.featuredImage}`}
                  alt="#"
                  className="featured-image-style"
                />
                <div className="content">
                  <h6 className="description mb-2">{element.title}</h6>
                  <span className="location">
                    <i className="flaticon-pin"></i> {element.address}
                  </span>
                </div>
                <div className="product-info-bottom">
                  <div className="product-price">
                    <span>{formatPrice(element.price)}</span>
                  </div>
                  <div className="product-price">
                    <button
                      className="btn theme-btn-2 request-now-btn"
                      onClick={() => {
                        window.open(
                          `${process.env.REACT_APP_PUBLIC_URL}/property-details/${element.id}`,
                          "_blank"
                        );
                      }}
                    >
                      Open Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default GoogleMapsSearch;
