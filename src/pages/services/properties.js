

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Navbar from "../../components/global/navbar";
// import PageHeader from "../../components/global/header";
// import SearchForm from "../../components/homepage/section/search-form";
// import ServiceDetails from "../../components/homepage/section/service-details";
// import Video from "../../components/homepage/section/video-v3";
// import Service from "../../components/homepage/section/service-v2";
// import CallToActionV1 from "../../components/homepage/section/call-to-action-v1";
// import Footer from "../../components/global/footer";
// import PropertyGrid from "../../components/homepage/property/grid";

// function PropertiesServicePage() {
//   const [filters, setFilters] = useState(() => {
//     // Retrieve filters from localStorage if available
//     const savedFilters = localStorage.getItem("searchFilters");
//     return savedFilters ? JSON.parse(savedFilters) : {};
//   });

//   const location = useLocation();
//   const propertiesFromMap = location.state?.properties;

//   const handleFiltersChange = (newFilters) => {
//     if (Object.keys(newFilters).length === 0) {
//       // If newFilters is empty, clear localStorage and state
//       localStorage.removeItem("searchFilters");
//       setFilters({});
//     } else {
//       const updatedFilters = {
//         ...filters,
//         ...newFilters,
//       };
//       setFilters(updatedFilters);
//       // Save updated filters to localStorage
//       localStorage.setItem("searchFilters", JSON.stringify(updatedFilters));
//     }
//   };

//   useEffect(() => {
//     // If there are filters in the location state, use them; otherwise, keep the existing filters.
//     if (location.state?.filters) {
//       setFilters(location.state.filters);
//     }
//   }, [location.state?.filters]);

//   return (
//     <div>
//       <Navbar />
//       <PageHeader headertitle="Homes" subheader="Service" />
//       <SearchForm
//         key={JSON.stringify(filters)}
//         onFiltersChange={handleFiltersChange}
//         propertyCategory={filters.propertyCategory}
//         address={filters.address}
//         lat={filters.lat}
//         lng={filters.lng}
//         priceType={filters.priceType}
//       />
//       <PropertyGrid filters={filters} mapProperties={propertiesFromMap} />
//       <ServiceDetails />
//       <Service />
//       <CallToActionV1 />
//       <Footer />
//     </div>
//   );
// }

// export default PropertiesServicePage;

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Navbar from "../../components/global/navbar";
// import PageHeader from "../../components/global/header";
// import SearchForm from "../../components/homepage/section/search-form";
// import ServiceDetails from "../../components/homepage/section/service-details";
// import Service from "../../components/homepage/section/service-v2";
// import CallToActionV1 from "../../components/homepage/section/call-to-action-v1";
// import Footer from "../../components/global/footer";
// import PropertyGrid from "../../components/homepage/property/grid";

// function PropertiesServicePage() {
//   const [filters, setFilters] = useState(() => {
//     // Retrieve filters from localStorage if available
//     const savedFilters = localStorage.getItem("searchFilters");
//     return savedFilters ? JSON.parse(savedFilters) : {};
//   });

//   const location = useLocation();
//   const propertiesFromMap = location.state?.properties;

//   const handleFiltersChange = (newFilters) => {
//     if (Object.keys(newFilters).length === 0) {
//       // If newFilters is empty, clear localStorage and state
//       localStorage.removeItem("searchFilters");
//       setFilters({});
//     } else {
//       const updatedFilters = {
//         ...filters,
//         ...newFilters,
//       };
//       setFilters(updatedFilters);
//       // Save updated filters to localStorage
//       localStorage.setItem("searchFilters", JSON.stringify(updatedFilters));
//     }
//   };

//   useEffect(() => {
//     // If there are filters in the location state, use them; otherwise, keep the existing filters.
//     if (location.state?.filters) {
//       setFilters(location.state.filters);
//     }
//   }, [location.state?.filters]);

//   return (
//     <div>
//       <Navbar />
//       <PageHeader headertitle="Homes" subheader="Service" />
//       <SearchForm
//         key={JSON.stringify(filters)}
//         onFiltersChange={handleFiltersChange}
//         propertyCategory={filters.propertyCategory}
//         address={filters.address}
//         lat={filters.lat}
//         lng={filters.lng}
//         priceType={filters.priceType}
//       />
//       <PropertyGrid filters={filters} mapProperties={propertiesFromMap} />
//       <ServiceDetails />
//       <Service />
//       <CallToActionV1 />
//       <Footer />
//     </div>
//   );
// }

// export default PropertiesServicePage;

// properties.js
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/global/navbar";
import PageHeader from "../../components/global/header";
import SearchForm from "../../components/homepage/section/search-form";
import ServiceDetails from "../../components/homepage/section/service-details";
import Service from "../../components/homepage/section/service-v2";
import CallToActionV1 from "../../components/homepage/section/call-to-action-v1";
import Footer from "../../components/global/footer";
import PropertyGrid from "../../components/homepage/property/grid";
import { useFilters } from "../../components/context/filterContext";


function PropertiesServicePage() {
  const { filters, updateFilters } = useFilters();
  const location = useLocation();
  const propertiesFromMap = location.state?.properties;

  useEffect(() => {
    if (location.state?.filters) {
      updateFilters(location.state.filters);
    }
  }, [location.state?.filters]);

  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Homes" subheader="Service" />
      <SearchForm
        key={JSON.stringify(filters)}
        propertyCategory={filters.propertyCategory}
        address={filters.address}
        lat={filters.lat}
        lng={filters.lng}
        priceType={filters.priceType}
      />
      <PropertyGrid filters={filters} mapProperties={propertiesFromMap} />
      <ServiceDetails />
      <Service />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default PropertiesServicePage;
