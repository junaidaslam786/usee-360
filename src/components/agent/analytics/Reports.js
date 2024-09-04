import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
} from "react-bootstrap";
import { CSVLink } from "react-csv";
import AgentAnalyticsService from "../../../services/agent/analytics";
import { toast } from "react-toastify";

const ReportDownload = () => {
  const [reportType, setReportType] = useState("");
  const [reportData, setReportData] = useState([]);
  const [csvFilename, setCsvFilename] = useState("");
  const [isCSVReady, setIsCSVReady] = useState(false);

  const transformUsersDataForCSV = (userData) => {
    return userData.agents.map((agent) => {
      const user = agent.user;
  
      // Join the productAllocations and agentAccessLevels
      const allocations = (user.productAllocations || [])
        .map((a) => a.productId)
        .join("\n");
      const accessLevels = (user.agentAccessLevels || [])
        .map((a) => a.accessLevel)
        .join("\n");
  
      // Join the appointments data
      const pendingAppointments = (agent.pendingAppointments || [])
        .map((a) => a.id)
        .join("\n");
      const completedAppointments = (agent.completedAppointments || [])
        .map((a) => a.id)
        .join("\n");
      const cancelledAppointments = (agent.cancelledAppointments || [])
        .map((a) => a.id)
        .join("\n");
      const missedAppointments = (agent.missedAppointments || [])
        .map((a) => a.id)
        .join("\n");
  
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
        pendingAppointments: pendingAppointments,
        completedAppointments: completedAppointments,
        cancelledAppointments: cancelledAppointments,
        missedAppointments: missedAppointments,
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
          }, Reject Reason: ${offer.rejectReason || "N/A"}, 
                  Customer ID: ${offer.customer.id}, 
                  Customer Name: ${offer.customer.firstName} ${offer.customer.lastName}, 
                  Customer Email: ${offer.customer.email}, 
                  Customer Phone: ${offer.customer.phoneNumber}`;
        })
        .join("\n");
  
        const viewsCount = (property.productViews || []).length;
      // Flattening productViews
      // const views = (property.productViews || [])
      //   .map(
      //     (view) =>
      //       `View ID: ${view.id}, Log Type: ${view.log_type}, Created At: ${view.createdAt}`
      //   )
      //   .join("\n");
  
      // Flattening productAllocations
      const allocations = (property.productAllocations || [])
        .map(
          (allocation) =>
            `Allocation ID: ${allocation.id}, User ID: ${allocation.userId}, Created At: ${allocation.createdAt}`
        )
        .join("\n");
  
      // Flattening appointments
      const appointments = (property.appointments || [])
        .map((appointment) => {
          return `Appointment ID: ${appointment.id}, Agent ID: ${appointment.agentId}, Customer ID: ${appointment.customerId}, Status: ${appointment.status}, 
                  Appointment Date: ${appointment.appointmentDate}, 
                  Start Time: ${appointment.startMeetingTime || "N/A"}, 
                  End Time: ${appointment.endMeetingTime || "N/A"}`;
        })
        .join("\n");
  
      // Return a flat object for CSV
      return {
        PropertyID: property.id,
        Title: property.title,
        Price: property.price,
        Description: property.description,
        Address: property.address,
        Status: property.status,
        TotalCalls: property.total_calls || 0,
        MissedCalls: property.missed_calls || 0,
        UpcomingAppointments: property.upcoming_appointments || 0,
        ProductOffers: offers,
        ProductViewsCount: viewsCount,
        // ProductViews: views,
        ProductAllocations: allocations,
        Appointments: appointments,
        CreatedAt: property.createdAt,
        UpdatedAt: property.updatedAt,
      };
    };

    // Transforming all properties
    return [
      ...(propertyData.listed ? propertyData.listed.map(flattenProperty) : []),
      ...(propertyData.sold ? propertyData.sold.map(flattenProperty) : []),
      ...(propertyData.unsold ? propertyData.unsold.map(flattenProperty) : []),
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

  // const downloadReport = async () => {
  //   setIsCSVReady(false);
  //   let data;
  //   switch (reportType) {
  //     case "users":
  //       data = await AgentAnalyticsService.fetchUsersData();

  //       if (data.data && data.data.userData) {
  //         setReportData(transformUsersDataForCSV(data.data.userData));
  //       } else {
  //         console.error("No user data received from service");
  //       }
  //       break;
  //     case "properties":
  //       data = await AgentAnalyticsService.fetchPropertiesData();

  //       if (data.data && data.data.propertyData) {
  //         setReportData(transformPropertiesDataForCSV(data.data.propertyData));
  //       } else {
  //         console.error("No property data received from service");
  //       }
  //       break;
  //     case "services":
  //       data = await AgentAnalyticsService.fetchServicesData();

  //       if (data.data && data.data.serviceData) {
  //         setReportData(transformServicesDataForCSV(data.data.serviceData));
  //       } else {
  //         console.error("No service data received from service");
  //       }
  //       break;
  //     default:
  //       console.error("Invalid report type");
  //       return;
  //   }

  //   // Check if data was set and then prepare the CSV file for download
  //   if (data) {
  //     setCsvFilename(`${reportType}-report.csv`);
  //     setIsCSVReady(true); // Data is ready for download
  //   }
  // };

  const downloadReport = async () => {
    setIsCSVReady(false);
    let data;
    try {
      switch (reportType) {
        case "users":
          data = await AgentAnalyticsService.fetchUsersData();
  
          

          if (data.error) {
            throw new Error(data.message || "Error fetching users data.");
          }
  
          if (data.data && data.data.userData) {
            setReportData(transformUsersDataForCSV(data.data.userData));
          } else {
            throw new Error("No user data received from service");
          }
          break;
        case "properties":
          data = await AgentAnalyticsService.fetchPropertiesData();

          console.log(data);
  
          if (data.error) {
            throw new Error(data.message || "Error fetching properties data.");
          }
  
          if (data.data && data.data.propertyData) {
            setReportData(transformPropertiesDataForCSV(data.data.propertyData));
          } else {
            throw new Error("No property data received from service");
          }
          break;
        case "services":
          data = await AgentAnalyticsService.fetchServicesData();
  
          if (data.error) {
            throw new Error(data.message || "Error fetching services data.");
          }
  
          if (data.data && data.data.serviceData) {
            setReportData(transformServicesDataForCSV(data.data.serviceData));
          } else {
            throw new Error("No service data received from service");
          }
          break;
        default:
          throw new Error("Invalid report type");
      }
  
      // Check if data was set and then prepare the CSV file for download
      if (data) {
        setCsvFilename(`${reportType}-report.csv`);
        setIsCSVReady(true); // Data is ready for download
      }
    } catch (error) {
      toast.error(error.message); // Display the error message using toast
      console.error("Download Report Error:", error.message); // Log error to console
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
