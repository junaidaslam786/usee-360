import React, { useState } from "react";
import { Container, Row, Col, Dropdown, Button, Form } from "react-bootstrap";
import { CSVLink } from "react-csv";
import AgentAnalyticsService from "../../../services/agent/analytics";

const ReportDownload = () => {
  const [reportType, setReportType] = useState("");
  const [reportData, setReportData] = useState([]);
  const [csvFilename, setCsvFilename] = useState("");
  const [isCSVReady, setIsCSVReady] = useState(false);

  const transformUsersDataForCSV = (userData) => {
    return userData.agents.map((agent) => {
      const user = agent.user;
      const allocations = (user.productAllocations || [])
        .map((a) => a.id)
        .join("; ");
      const accessLevels = (user.agentAccessLevels || [])
        .map((a) => a.accessLevel)
        .join("; ");

      return {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        userType: user.userType,
        profileImage: user.profileImage,
        agentType: agent.agentType,
        companyPosition: agent.companyPosition,
        apiCode: agent.apiCode,
        productAllocations: allocations,
        agentAccessLevels: accessLevels,
        // Add other fields as needed
      };
    });
  };

  const transformPropertiesDataForCSV = (propertyData) => {
    if (!propertyData) return [];
    const transformProperties = (properties) =>
      properties.map((property) => {
        const offers = (property.productOffers || [])
          .map((offer) => offer.id)
          .join("; ");
        const views = (property.productViews || [])
          .map((view) => view.id)
          .join("; ");

        return {
          id: property.id,
          title: property.title,
          price: property.price,
          description: property.description,
          address: property.address,
          status: property.status,
          productOffers: offers,
          productViews: views,
          // Add other fields as needed
        };
      }) || [];

    return [
      ...transformProperties(propertyData.listed),
      ...transformProperties(propertyData.sold),
      ...transformProperties(propertyData.unsold),
    ];
  };

  const transformServicesDataForCSV = (serviceData) => {
    let transformedData = [];
  
    if (serviceData && typeof serviceData === 'object') {
      Object.keys(serviceData).forEach((category) => {
        serviceData[category].forEach((service) => {
          // Assuming similar structure for each service category
          transformedData.push({
            // Add fields based on the actual structure of your service data
            serviceId: service.id,
            featureId: service.featureId,
            createdAt: service.createdAt,
            // Add other fields as needed
          });
        });
      });
    } else {
      console.error("Invalid or missing service data");
    }
  
    return transformedData;
  };
  
  const downloadReport = async () => {
    let data;
    switch (reportType) {
      case "users":
        data = await AgentAnalyticsService.fetchUsersData();
        
        if (data.data && data.data.userData) {
          setReportData(transformUsersDataForCSV(data.data.userData));
        } else {
          console.error("No user data received from service");
        }
        break;
      case "properties":
        data = await AgentAnalyticsService.fetchPropertiesData();
        
        if (data.data && data.data.propertyData) {
          setReportData(transformPropertiesDataForCSV(data.data.propertyData));
        } else {
          console.error("No property data received from service");
        }
        break;
      case "services":
        data = await AgentAnalyticsService.fetchServicesData();
        
        if (data.data && data.data.serviceData) {
          setReportData(transformServicesDataForCSV(data.data.serviceData));
        } else {
          console.error("No service data received from service");
        }
        break;
      default:
        console.error("Invalid report type");
        return;
    }
  
    // Check if data was set and then prepare the CSV file for download
    if (data) {
      setCsvFilename(`${reportType}-report.csv`);
      setIsCSVReady(true); // Data is ready for download
    }
  };
  
  

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form>
            {["users", "properties", "services"].map((type, index) => (
              <Form.Check
                key={index}
                type="radio"
                name="reportType"
                label={`${type.charAt(0).toUpperCase() + type.slice(1)} Reports`}
                value={type}
                onChange={(e) => setReportType(e.target.value)}
              />
            ))}
          </Form>
        </Col>
        <Col md={2}>
          <button className="btn btn-info" onClick={downloadReport} disabled={!reportType}>
            Prepare Report
          </button>
          {isCSVReady && (
            <CSVLink
              data={reportData}
              filename={csvFilename}
              className="btn btn-success mt-2"
              target="_blank"
            >
              Download Report
            </CSVLink>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ReportDownload;
