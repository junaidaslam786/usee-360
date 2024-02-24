import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox,
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

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
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
  const [mapType, setMapType] = useState("roadmap");
  const [filters, setFilters] = useState({});

  const history = useHistory();

  const searchBoxRef = useRef(null);
  const [markers, setMarkers] = useState([]);

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

    setShowRadius(false);
  };

  const changeMapType = (type) => {
    setMapType(type);
  };

  const onSearchBoxLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const handleFindNowClick = () => {
    const selectedFilters = countSelectedFilters();
    history.push("/property-grid", { filters: selectedFilters });
  };

  const countSelectedFilters = () => {
    let count = 0;
    // Adjust the logic if your filters structure is different
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined) {
        if (typeof value === "object") {
          if (Array.isArray(value) && value.length > 0) {
            count++;
          } else if (!Array.isArray(value) && Object.keys(value).length > 0) {
            count++;
          }
        } else {
          count++;
        }
      }
    });
    return count;
  };
  const radiusOptions = [
    { value: "", label: "--Select Radius--" },
    { value: 500, label: "0.5km" },
    { value: 1000, label: "1km" },
    { value: 3000, label: "3km" },
    { value: 5000, label: "5km" },
    { value: 7500, label: "7.5km" },
    { value: 10000, label: "10km" },
    { value: 15000, label: "15km" },
    { value: 20000, label: "20km" },
    { value: 25000, label: "25km" },
    { value: 30000, label: "30km" },
    { value: 50000, label: "50km" },
    { value: 100000, label: "100km" },
  ];

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
      // console.log(propertyData);
    } catch (err) {
      console.log(err);
      setProperties([]);
    }
  }, [currentLocation, radius]);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    const place = places[0]; // Assuming you want the first result

    if (!place.geometry) return;
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setCurrentLocation(location);
    setMarkers([]);

    // const radiusInMeters = radius * 1000;
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
            // searchByCircle()
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // Only update if there's a significant change in location
          // if (
          //   !currentLocation ||
          //   Math.abs(currentLocation.lat - newLocation.lat) > 0.001 ||
          //   Math.abs(currentLocation.lng - newLocation.lng) > 0.001
          // ) {
          setCurrentLocation(newLocation);
          // }
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
        setProperties(properties);

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
        // Handle error (e.g., show an error message)
      }
    },
    [markers, history] // Ensure dependencies are correctly listed
  );

  const handlePolygonComplete = useCallback(
    (overlay) => {
      if (overlay instanceof window.google.maps.Polygon) {
        const polygon = overlay;

        // Close the polygon path by ensuring the first and last coordinates are the same
        if (polygon[0] !== polygon[polygon.length - 1]) {
          polygon.push(polygon[0]);
        }
        // Add polygon to state for visual feedback (optional)
        // setPolygons([...polygons, polygon]);

        searchPropertiesInPolygon(polygon);

        setPolygons((prevPolygons) => [...prevPolygons, overlay]);

        // Optionally, clear the drawn polygon
        // polygon.setMap(null);
      }
    },
    [searchPropertiesInPolygon, polygons] // Add dependencies to avoid rerenders
  );

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
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
      const polygonPath = polygon
        .getPath()
        .getArray()
        .map((coord) => ({
          lat: coord.lat(),
          lng: coord.lng(),
        }));

      // Trigger search based on the polygon
      searchPropertiesInPolygon(polygonPath);

      // Optionally, clear the drawn polygon
      // polygon.setMap(null);
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

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <>
      <div className="map-container">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            position: "absolute",
            left: "50%",
            top: "25px",
          }}
        >
          <StandaloneSearchBox
            onLoad={onSearchBoxLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for places..."
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `280px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                right: "150px",
                zIndex: 1000,
              }}
            />
          </StandaloneSearchBox>
          <select
            id="radiusSelect"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `150px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              transform: "translateX(-50%)",
              opacity: 0.75,
              zIndex: 1000,
            }}
          >
            {radiusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setShowRadius(!showRadius);
              if (!showRadius) {
                searchByCircle();
              }
            }}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `150px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "3px",
              opacity: 0.75,
              color: "white",
              backgroundColor: "#00c800",
              zIndex: 1000,
            }}
          >
            {showRadius ? "Hide Radius" : "Search by Radius"}
          </button>
          <button
            // className={`open-button ${active ? "" : "closed-button"}`}
            onClick={handleActive}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `150px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "155px",
              opacity: 0.75,
              zIndex: 1000,
              color: "white",
              backgroundColor: active ? "red" : "#00c800",
            }}
          >
            {active ? "Close Search" : "Open Search"}
          </button>
          <button
            onClick={resetMapState}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `150px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "308px",
              opacity: 0.75,
              zIndex: 1000,
              color: "white",
              backgroundColor: "#00c800",
            }}
          >
            Reset Map
          </button>
          <button
            onClick={handleFindNowClick}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `150px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "400px",
              opacity: 0.75,
              zIndex: 1000,
              color: "white",
              backgroundColor: "#00c800",
            }}
          >
            Go To Properties
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            left: "50%",
            bottom: "75px",
          }}
        >
          <button
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `150px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "308px",
              opacity: 0.75,
              zIndex: 1000,
              color: "white",
              backgroundColor: "#00c800",
            }}
            onClick={() => changeMapType("satellite")}
          >
            Satellite
          </button>
          <button
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `150px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "308px",
              opacity: 0.75,
              zIndex: 1000,
              color: "white",
              backgroundColor: "#00c800",
            }}
            onClick={() => changeMapType("hybrid")}
          >
            Hybrid
          </button>
          <button
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `150px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "308px",
              opacity: 0.75,
              zIndex: 1000,
              color: "white",
              backgroundColor: "#00c800",
            }}
            onClick={() => changeMapType("terrain")}
          >
            Terrain
          </button>
        </div>

        <GoogleMap
          ref={mapRef}
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={currentLocation}
          options={{ ...options, mapTypeId: mapType }}
          mapTypeControlOptions={{
            position: window.google.maps.ControlPosition.TOP_LEFT,
          }}
        >
          <Marker
            position={currentLocation}
            icon={{
              url: "/assets/img/icons/map-marker-2.png",
              // scaledSize: new window.google.maps.Size(25, 25),
            }}
          />
          {/* Render drawn polygons */}
          {polygons.map((polygon, index) => (
            <Polygon
              key={index}
              paths={polygon}
              options={{ fillColor: "#FF0000" }}
            />
          ))}
          <DrawingManager
            drawingMode={window.google.maps.drawing.OverlayType.POLYGON}
            onPolygonComplete={handlePolygonComplete}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                position: window.google.maps.ControlPosition.BOTTOM_CENTER,
                drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
              },
              polygonOptions: { fillColor: "#FF0000" },
            }}
          />
          {properties.map((property) => (
            <Marker
              key={property.id} // Ideally, use a unique property ID if available
              position={{
                lat: parseFloat(property.latitude),
                lng: parseFloat(property.longitude),
              }}
              // Optional: Customize the marker icon and other properties
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
    </>
  );
};

export default GoogleMapsSearch;
