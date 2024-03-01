import React, { useState } from "react";
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

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    console.log('filters from parent property page',newFilters);
  };

  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Homes" subheader="Service" />
      <SearchForm onFiltersChange={handleFiltersChange} />
      <PropertyGrid  filters={filters} mapProperties={propertiesFromMap}/>
      <ServiceDetails />
      <Video />
      <Service />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default PropertiesServicePage;
