import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  Button,
  Form,
  Card,
} from "react-bootstrap";
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

    const flattenProperty = (property) => {
      // Flattening productOffers
      const offers = (property.productOffers || [])
        .map((offer) => {
          return `Offer ID: ${offer.id}, Amount: ${offer.amount}, Status: ${
            offer.status
          }, 
                  Reject Reason: ${offer.rejectReason || "N/A"}, 
                  Customer ID: ${offer.customer.id}, 
                  Customer Name: ${offer.customer.firstName} ${
            offer.customer.lastName
          }, 
                  Customer Email: ${offer.customer.email}, 
                  Customer Phone: ${offer.customer.phoneNumber}`;
        })
        .join(" | ");

      // Flattening productViews
      const views = (property.productViews || [])
        .map(
          (view) =>
            `View ID: ${view.id}, Log Type: ${view.log_type}, Created At: ${view.createdAt}`
        )
        .join(" | ");

      // Return a flat object for CSV
      return {
        PropertyID: property.id,
        Title: property.title,
        Price: property.price,
        Description: property.description,
        Address: property.address,
        Status: property.status,
        ProductOffers: offers,
        ProductViews: views,
        // Add any additional fields here
      };
    };

    // Transforming all properties
    return [
      ...propertyData.listed.map(flattenProperty),
      ...propertyData.sold.map(flattenProperty),
      ...propertyData.unsold.map(flattenProperty),
    ];
  };

  const transformServicesDataForCSV = (serviceData) => {
    let transformedData = [];

    if (serviceData && typeof serviceData === "object") {
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

  // New function to reset state when report type changes
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setIsCSVReady(false); // Reset CSV ready state
    setReportData([]); // Reset report data
  };

  const downloadReport = async () => {
    setIsCSVReady(false);
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
      <Card className="mt-4">
        <Card.Header as="h5">Generate Reports</Card.Header>
        <Card.Body>
          <Form>
            <Row className="justify-content-md-center mb-3">
              {["users", "properties", "services"].map((type, index) => (
                <Col md="auto" key={index}>
                  <Form.Check
                    type="radio"
                    name="reportType"
                    label={`${
                      type.charAt(0).toUpperCase() + type.slice(1)
                    } Reports`}
                    value={type}
                    onChange={handleReportTypeChange}
                    className="mb-0"
                  />
                </Col>
              ))}
            </Row>
            <Row className="justify-content-md-center">
              <Col md="auto">
                <Button
                  size="sm"
                  className="btn-custom"
                  onClick={downloadReport}
                  disabled={!reportType || isCSVReady}
                  style={{
                    backgroundColor: "#00C800",
                    borderColor: "#00C800",
                    color: "white",
                  }}
                >
                  Prepare Report
                </Button>
              </Col>
              {isCSVReady && (
                <Col md="auto">
                  <CSVLink
                    data={reportData}
                    filename={csvFilename}
                    className="btn btn-success btn-sm"
                    target="_blank"
                    style={{
                      backgroundColor: "#00C800",
                      borderColor: "#00C800",
                      color: "white",
                    }}
                  >
                    Download Report
                  </CSVLink>
                </Col>
              )}
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportDownload;
