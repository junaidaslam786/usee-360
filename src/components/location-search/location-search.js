import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./location-search.css";
import HomepageService from "../../services/homepage";
import { formatPrice } from "../../utils";
import { useStateIfMounted } from "use-state-if-mounted";

export default function LocationSearch() {
  const [mapstate, setMap] = useStateIfMounted(null);
  const [center, setCenter] = useStateIfMounted({
    lat: 24.466667,
    lng: 54.366669,
  });
  const [centerAddress, setCenterAddress] = useStateIfMounted("");
  const [radius, setRadius] = useState(300);
  const [active, setActive] = useState(true);
  const [circle, setCirle] = useStateIfMounted(null);
  const [polygonState, setPolygonState] = useStateIfMounted(null);
  const [drawingManagerState, setDrawingManagerState] = useStateIfMounted("");
  const [properties, setProperties] = useStateIfMounted([]);
  const [markers, setMarkers] = useStateIfMounted([]);

  let map;
  let newMarkers = [];
  let centerMarker = null;
  let drawingManager;
  let polygon;
  const history = useHistory();

  // Define radius options
  const radiusOptions = [
    { value: 1000, label: "1km" },
    { value: 2000, label: "2km" },
    { value: 3000, label: "3km" },
    { value: 5000, label: "5km" },
  ];

  const handleExit = () => {
    history.push("/services");
  };

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value, 10);
    setRadius(newRadius);
    if (mapstate && center) {
      drawCircle(center, newRadius);
    }
  };

  const handleReset = () => {
    if (polygonState) {
      polygonState.setMap(null);
      setPolygonState(null);
      drawingManagerState.setDrawingMode(
        window.google.maps.drawing.OverlayType.POLYGON
      );

      setProperties([]);
      if (markers.length > 0) {
        markers.map((marker) => {
          marker.setMap(null);
        });
      }
    }
  };

  const searchByPolygon = async (drawnPolygon) => {
    const polygonCoords = drawnPolygon
      .getPath()
      .getArray()
      .map((point) => `${point.lng()} ${point.lat()}`);

    const data = await HomepageService.searchByPolygon({
      coordinates: polygonCoords,
    });
    if (data) {
      setProperties([]);

      if (newMarkers.length > 0) {
        newMarkers.map((marker) => {
          marker.setMap(null);
        });
      }

      newMarkers = [];
      if (data.length > 0) {
        setProperties(data);

        data.map((property) => {
          const position = {
            lat: parseFloat(property.latitude),
            lng: parseFloat(property.longitude),
          };

          const marker = addMarkerOnMap(
            map,
            position,
            "assets/img/icons/property-marker.png",
            { width: 40, height: 40 }
          );

          newMarkers.push(marker);
          marker.addListener("click", function () {
            window.open(
              `${process.env.REACT_APP_PUBLIC_URL}/property-details/${property.id}`,
              "_blank"
            );
          });
        });

        setMarkers(newMarkers);
      }
    }
  };

  const searchByCircle = async () => {
    const reqBody = {
      center: { lat: center.lat, lng: center.lng },
      radius: radius,
    };

    try {
      const data = await HomepageService.searchByCircle(reqBody);

      if (data && data.length > 0) {
        // Clear existing markers
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);

        // Update properties and markers based on the search result
        setProperties(data);
        const newMarkers = data.map((property) => {
          const position = {
            lat: parseFloat(property.latitude),
            lng: parseFloat(property.longitude),
          };

          const marker = addMarkerOnMap(
            mapstate,
            position,
            "assets/img/icons/property-marker.png",
            { width: 40, height: 40 }
          );

          marker.addListener("click", () => {
            window.open(
              `${process.env.REACT_APP_PUBLIC_URL}/property-details/${property.id}`,
              "_blank"
            );
          });

          return marker;
        });

        setMarkers(newMarkers);
      } else {
        // Handle case when no data is returned
        setProperties([]);
        console.log("No properties found within the specified radius.");
      }
    } catch (error) {
      console.error("Error searching properties by circle:", error);
      // Optionally, update the UI to notify the user of the error.
    }
  };

  const handleActive = () => {
    setActive(!active);
  };

  const reverseGeocode = (geocoder, location) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location }, function (results, status) {
        if (status == window.google.maps.GeocoderStatus.OK) {
          resolve(results[0].formatted_address);
        } else {
          reject(status);
        }
      });
    });
  };

  const addMarkerOnMap = (map, position, icon, icondimensions) => {
    const marker = new window.google.maps.Marker({
      position,
      map: map,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: icon,
        scaledSize: new window.google.maps.Size(
          icondimensions.width,
          icondimensions.height
        ), // Optional: set the size of the icon
      },
    });
    return marker;
  };

  const drawCircle = (center, radius) => {
    if (circle) circle.setMap(null);
    if (!mapstate) return;

    const newCircle = new window.google.maps.Circle({
      map: mapstate,
      center: center,
      radius: radius,
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.35,
    });

    mapstate.setOptions({ draggableCursor: "grab" });
    setCirle(newCircle);
    searchByCircle();
  };

  const handleLogoClick = () => {
    history.push("/services/properties");
  };

  // useEffect(() => {
  //   const google = window.google;
  //   const geocoder = new google.maps.Geocoder();

  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const currentLocation = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         //const currentLocation = { lat: 24.466667, lng: 54.366669 };
  //         setCenter(currentLocation);
  //         map.setCenter(currentLocation);
  //         setCenterAddress(await reverseGeocode(geocoder, currentLocation));
  //         centerMarker = addMarkerOnMap(
  //           map,
  //           currentLocation,
  //           "assets/img/icons/map-marker.png",
  //           { width: 30, height: 40.5 }
  //         );
  //         drawCircle(currentLocation, radius);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   }

  //   map = new window.google.maps.Map(document.getElementById("map"), {
  //     center,
  //     zoom: 17,
  //   });
  //   setMap(map);

  //   const autocomplete = new window.google.maps.places.Autocomplete(
  //     document.getElementById("autocomplete")
  //   );

  //   autocomplete.addListener("place_changed", () => {
  //     const place = autocomplete.getPlace();
  //     if (!place.geometry) {
  //       window.alert("No details available for input: '" + place.name + "'");
  //       return;
  //     }

  //     map.setCenter(place.geometry.location);
  //     drawCircle(place.geometry.location, radius);
  //     map.setZoom(17);

  //     if (centerMarker) {
  //       centerMarker.setPosition(place.geometry.location);
  //     }
  //   });

  //   map.addListener("click", function (event) {
  //     const lat = event.latLng.lat();
  //     const lng = event.latLng.lng();
  //     // const infowindow = new google.maps.InfoWindow({
  //     //   content: "Clicked location: " + lat + ", " + lng,
  //     // });
  //     // infowindow.setPosition(event.latLng);
  //     // infowindow.open(map);
  //   });

  //   drawingManager = new google.maps.drawing.DrawingManager({
  //     drawingMode: google.maps.drawing.OverlayType.POLYGON,
  //     drawingControl: true,
  //     drawingControlOptions: {
  //       position: google.maps.ControlPosition.TOP_CENTER,
  //       drawingModes: [
  //         // google.maps.drawing.OverlayType.MARKER,
  //         // google.maps.drawing.OverlayType.CIRCLE,
  //         google.maps.drawing.OverlayType.POLYGON,
  //         // google.maps.drawing.OverlayType.POLYLINE,
  //         // google.maps.drawing.OverlayType.RECTANGLE,
  //       ],
  //     },
  //     polygonOptions: {
  //       fillColor: "#FF0000",
  //       fillOpacity: 0.35,
  //       strokeWeight: 2,
  //       clickable: true,
  //       editable: true,
  //       draggable: true,
  //       zIndex: 1,
  //     },
  //   });

  //   google.maps.event.addListener(
  //     drawingManager,
  //     "polygoncomplete",
  //     function (drawnPolygon) {
  //       if (polygon) {
  //         polygon.setMap(null);
  //         setProperties([]);
  //         if (newMarkers.length > 0) {
  //           newMarkers.map((marker) => {
  //             marker.setMap(null);
  //           });
  //         }
  //       }

  //       google.maps.event.addListener(
  //         drawnPolygon,
  //         "dragend",
  //         function (event) {
  //           searchByPolygon(drawnPolygon);
  //         }
  //       );
  //       polygon = drawnPolygon;
  //       setPolygonState(drawnPolygon);
  //       searchByPolygon(drawnPolygon);
  //       drawingManager.setDrawingMode(null);
  //     }
  //   );

  //   setDrawingManagerState(drawingManager);
  //   drawingManager.setMap(map);
  // }, []);

  useEffect(() => {
    const google = window.google;
    const mapElement = document.getElementById("map");
    const initMap = (location) => {
      const map = new google.maps.Map(mapElement, {
        zoom: 15,
        center: location,
      });
      setMap(map);

      // Add a marker for the user's location
      new google.maps.Marker({
        position: location,
        map: map,
        title: "Your Location",
      });
    };

    // Check if the Geolocation API is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          initMap(pos); // Initialize the map with the user's current location
        },
        () => {
          console.error("The Geolocation service failed.");
          initMap(center); // Fallback to default location
        },
        { enableHighAccuracy: true}
      );
    } else {
      // Browser doesn't support Geolocation
      console.log("Browser doesn't support Geolocation");
      initMap(center); // Fallback to default location
    }
  }, []);

  // Add this useEffect hook after the previous useEffect for initializing the map
useEffect(() => {
  if (!mapstate) return; // Ensure the map has been initialized

  const google = window.google; // Ensure Google Maps API is loaded
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'), // Your input element for location search
    { types: ['geocode'] }
  );

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

  const onPlaceChanged = () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, present it on a map.
    if (place.geometry.viewport) {
      mapstate.fitBounds(place.geometry.viewport);
    } else {
      mapstate.setCenter(place.geometry.location);
      mapstate.setZoom(17); // Why 17? Because it looks good.
    }

    // Place a marker on the location searched
    new google.maps.Marker({
      map: mapstate,
      position: place.geometry.location,
    });

    setCenter(place.geometry.location.toJSON()); // Update center state with searched location
  };

  // Bind the onPlaceChanged function to the place_changed event on the autocomplete object
  autocomplete.addListener('place_changed', onPlaceChanged);
}, [mapstate]);


  // useEffect(() => {
  //   const google = window.google;
  //   let map;
  //   let centerMarker;
  //   const geocoder = new google.maps.Geocoder();

  //   // Function to add a marker to the map
  //   const addMarkerOnMap = (map, position, icon, iconDimensions) => {
  //     return new google.maps.Marker({
  //       position,
  //       map,
  //       icon: {
  //         url: icon,
  //         scaledSize: new google.maps.Size(
  //           iconDimensions.width,
  //           iconDimensions.height
  //         ),
  //       },
  //     });
  //   };

  //   // Reverse geocoding to get address from lat and lng
  //   const reverseGeocode = async (location) => {
  //     return new Promise((resolve, reject) => {
  //       geocoder.geocode({ location }, (results, status) => {
  //         if (status === google.maps.GeocoderStatus.OK) {
  //           resolve(results[0].formatted_address);
  //         } else {
  //           reject(status);
  //         }
  //       });
  //     });
  //   };

  //   // Initialize the map
  //   const initializeMap = () => {
  //     map = new google.maps.Map(document.getElementById("map"), {
  //       center,
  //       zoom: 17,
  //     });
  //     setMap(map);

  //     // Setup autocomplete
  //     const autocomplete = new google.maps.places.Autocomplete(
  //       document.getElementById("autocomplete")
  //     );
  //     autocomplete.bindTo("bounds", map);
  //     autocomplete.addListener("place_changed", async () => {
  //       const place = autocomplete.getPlace();
  //       if (!place.geometry) {
  //         alert("No details available for input: '" + place.name + "'");
  //         return;
  //       }
  //       const newCenter = place.geometry.location;
  //       setCenter(newCenter.toJSON()); // Update center state
  //       map.setCenter(newCenter);

  //       // Ensure centerMarker is moved to new center
  //       if (centerMarker) {
  //         centerMarker.setMap(null); // Remove the old marker
  //       }
  //       centerMarker = addMarkerOnMap(
  //         map,
  //         newCenter.toJSON(),
  //         "assets/img/icons/map-marker.png",
  //         { width: 30, height: 40.5 }
  //       );

  //       // Redraw circle at new center with current radius
  //       drawCircle(newCenter.toJSON(), radius);
  //     });

  //     // Configure drawing manager for polygons
  //     const drawingManager = new google.maps.drawing.DrawingManager({
  //       drawingMode: google.maps.drawing.OverlayType.POLYGON,
  //       drawingControl: true,
  //       drawingControlOptions: {
  //         position: google.maps.ControlPosition.TOP_CENTER,
  //         drawingModes: [google.maps.drawing.OverlayType.POLYGON],
  //       },
  //       polygonOptions: {
  //         fillColor: "#FF0000",
  //         fillOpacity: 0.35,
  //         strokeWeight: 2,
  //         clickable: true,
  //         editable: true,
  //         draggable: true,
  //         zIndex: 1,
  //       },
  //     });

  //     drawingManager.setMap(map);
  //     setDrawingManagerState(drawingManager);

  //     // Listener for polygon completion
  //     google.maps.event.addListener(
  //       drawingManager,
  //       "polygoncomplete",
  //       (polygon) => {
  //         setPolygonState(polygon); // Update polygon state
  //         searchByPolygon(polygon); // Trigger search with the drawn polygon
  //         drawingManager.setDrawingMode(null); // Disable drawing mode after polygon is complete
  //       }
  //     );
  //   };

  //   // Attempt to fetch user's current location
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const currentLocation = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         setCenter(currentLocation);
  //         setCenterAddress(await reverseGeocode(currentLocation));
  //         initializeMap();
  //         drawCircle(currentLocation, radius);
  //       },
  //       (error) => {
  //         console.error("Geolocation error: ", error);
  //         initializeMap(); // Initialize map with default center if geolocation fails
  //       }
  //     );
  //   } else {
  //     initializeMap(); // Initialize map with default center if geolocation is not supported
  //   }
  // }, []); // Re-run useEffect when radius changes to redraw circle

  useEffect(() => {
    if (!mapstate || !center || typeof radius !== "number") return;
    drawCircle(center, radius);
  }, [mapstate, center, radius]);

  return (
    <div className="map-container">
      <div className="custom_position2">
        {/* <div className="buttons-container"> */}
        <button
          className={`open-button ${active ? "" : "closed-button"}`}
          onClick={handleActive}
        >
          {active ? "Close Search" : "Open Search"}
        </button>
        <button
          className={`open-button-reset ${active ? "" : "closed-button-reset"}`}
          onClick={handleReset}
        >
          Reset
        </button>
        <button className="exit-button" onClick={handleExit}>
          exit
        </button>
        {/* </div> */}
      </div>

      <div className={`sidebarforsearch ${active ? "isActive" : ""}`}>
        <img
          src={`${process.env.REACT_APP_PUBLIC_URL}/assets/img/logo.png`}
          id="sideabar-logo"
          alt="Logo"
          height="80"
          onClick={handleLogoClick}
          className="cursor_pointer"
        />
        <p>
          You can search the properties in a specific area by drawing shapes on
          maps.{" "}
        </p>
        <br />
        <p>Move center to your desired location</p>
        <input
          type="text"
          value={centerAddress}
          name="ltn__name"
          id="autocomplete"
          onChange={(event) => {
            setCenterAddress(event.target.value);
          }}
          placeholder="Center your location"
        />
        <div className="radius-selector">
          <label htmlFor="radiusSelect">Radius:</label>
          <select
            id="radiusSelect"
            value={radius}
            onChange={handleRadiusChange}
          >
            {radiusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
      <div id="map"></div>
    </div>
  );
}
