import React, { useState } from 'react';
import VisitCount from './visitCount';
import DurationAnalytics from './durationAnalytics';
import './propertyVisitsAnalytics.css'

const PropertyVisitAnalytics = () => {
  // Dummy data for demonstration
  const [visitData] = useState([
    { propertyName: 'Property 1', visits: 34 },
    { propertyName: 'Property 2', visits: 29 },
    { propertyName: 'Property 3', visits: 15 },
  ]);

  const [durationData] = useState([
    { propertyName: 'Property 1', averageDuration: 45 },
    { propertyName: 'Property 2', averageDuration: 30 },
    { propertyName: 'Property 3', averageDuration: 25 },
  ]);

  return (
    <div className="property-visit-analytics">
      <VisitCount visitData={visitData} />
      <DurationAnalytics durationData={durationData} />
    </div>
  );
};

export default PropertyVisitAnalytics;
