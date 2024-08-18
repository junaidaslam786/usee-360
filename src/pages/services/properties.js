// import React, { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import Navbar from "../../components/global/navbar";
// import PageHeader from "../../components/global/header";
// import SearchForm from "../../components/homepage/section/search-form";
// import ServiceDetails from "../../components/homepage/section/service-details";
// import Service from "../../components/homepage/section/service-v2";
// import CallToActionV1 from "../../components/homepage/section/call-to-action-v1";
// import Footer from "../../components/global/footer";
// import PropertyGrid from "../../components/homepage/property/grid";
// import { useFilters } from "../../components/context/filterContext";


// function PropertiesServicePage() {
//   const { filters, updateFilters } = useFilters();
//   const location = useLocation();
//   const propertiesFromMap = location.state?.properties;

//   useEffect(() => {
//     if (location.state?.filters) {
//       updateFilters(location.state.filters);
//     }
//   }, [location.state?.filters, updateFilters]);

//   return (
//     <div>
//       <Navbar />
//       <PageHeader headertitle="Homes" subheader="Service" />
//       <SearchForm
//         key={JSON.stringify(filters)}
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


import React from "react";
import Navbar from "../../components/global/navbar";
import PageHeader from "../../components/global/header";
import SearchForm from "../../components/homepage/section/search-form";
import ServiceDetails from "../../components/homepage/section/service-details";
import Service from "../../components/homepage/section/service-v2";
import CallToActionV1 from "../../components/homepage/section/call-to-action-v1";
import Footer from "../../components/global/footer";
import PropertyGrid from "../../components/homepage/property/grid";
import { useSelector } from "react-redux";

function PropertiesServicePage() {
  const filters = useSelector((state) => state.propertySearch.filters);

  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Homes" subheader="Service" />
      <SearchForm
        propertyCategory={filters.propertyCategory}
        address={filters.address}
        lat={filters.lat}
        lng={filters.lng}
        priceType={filters.priceType}
      />
      <PropertyGrid />
      <ServiceDetails />
      <Service />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default PropertiesServicePage;
