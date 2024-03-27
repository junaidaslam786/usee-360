import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/global/navbar";
import PageHeader from "../../components/global/header";
import SearchForm from "../../components/homepage/section/search-form";
import ServiceDetails from "../../components/homepage/section/service-details";
import Video from "../../components/homepage/section/video-v3";
import Service from "../../components/homepage/section/service-v2";
import CallToActionV1 from "../../components/homepage/section/call-to-action-v1";
import Footer from "../../components/global/footer";
import PropertyGrid from "../../components/homepage/property/grid";

function PropertiesServicePage() {
  const [filters, setFilters] = useState({});

  const location = useLocation();
  const propertiesFromMap = location.state?.properties;
 

 // This function handles updates to filters, including propertyCategory, from the SearchForm
 const handleFiltersChange = (newFilters) => {
  setFilters(prevFilters => ({
    ...prevFilters,
    ...newFilters, // Ensures propertyCategory and other filters are updated
  }));
};

  useEffect(() => {
    // If there are filters in the location state, use them; otherwise, keep the existing filters.
    if (location.state?.filters) {
      setFilters(location.state.filters);
    }
  }, [location.state?.filters]);

  

  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Homes" subheader="Service" />
      <SearchForm
        key={JSON.stringify(filters)}
        onFiltersChange={handleFiltersChange}
        propertyCategory={filters.propertyCategory}
        address={filters.address}
        lat={filters.lat}
        lng={filters.lng}
        priceType={filters.priceType}
      />
      <PropertyGrid filters={filters} mapProperties={propertiesFromMap} />
      <ServiceDetails />
      <Video />
      <Service />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default PropertiesServicePage;
