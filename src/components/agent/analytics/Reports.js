// import React, { useState } from 'react';
// import { Container, Row, Col, Dropdown, Button } from 'react-bootstrap';

// const ReportDownload = () => {
//   const [selectedDate, setSelectedDate] = useState({ month: '', day: '', year: '' });
//   const [reportType, setReportType] = useState('');

//   const handleSelect = (type, value) => {
//     setSelectedDate({ ...selectedDate, [type]: value });
//   };

//   const handleReportTypeSelect = (type) => {
//     setReportType(type);
//   };

//   const downloadReport = () => {
//     // Implement logic to download the report based on selectedDate and reportType
//     console.log('Downloading Report:', reportType, selectedDate);
//   };

//   return (
//     <Container>
//       <Row className="justify-content-md-center">
//         <Col md={4}>
//           <Dropdown onSelect={(e) => handleSelect('month', e)}>
//             <Dropdown.Toggle variant="success" id="dropdown-month">
//               {selectedDate.month || 'Select Month'}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               {/* Map through months */}
//             </Dropdown.Menu>
//           </Dropdown>
//         </Col>
//         <Col md={4}>
//           {/* Similar Dropdown for Day */}
//         </Col>
//         <Col md={4}>
//           {/* Similar Dropdown for Year */}
//         </Col>
//       </Row>
//       <Row className="justify-content-md-center">
//         <Col md={6}>
//           <Dropdown onSelect={handleReportTypeSelect}>
//             <Dropdown.Toggle variant="primary" id="dropdown-report-type">
//               {reportType || 'Select Report Type'}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item eventKey="property">Property Reports</Dropdown.Item>
//               <Dropdown.Item eventKey="tokens">Tokens Reports</Dropdown.Item>
//               <Dropdown.Item eventKey="services">Services Reports</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </Col>
//       </Row>
//       <Row className="justify-content-md-center">
//         <Col md={6}>
//           <Button onClick={downloadReport} variant="info">Download Report</Button>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ReportDownload;
import React, { useState } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";

const ReportDownload = () => {
  const [selectedDate, setSelectedDate] = useState({
    month: "",
    day: "",
    year: "",
  });
  const [reportType, setReportType] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleSelect = (type, value) => {
    setSelectedDate({ ...selectedDate, [type]: value });
  };

  const handleReportTypeSelect = (type) => {
    setReportType(type);
  };

  const downloadReport = () => {
    // Implement logic to download the report based on selectedDate and reportType
    console.log("Downloading Report:", reportType, selectedDate);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <Dropdown onSelect={(e) => handleSelect("month", e)}>
            <Dropdown.Toggle variant="success" id="dropdown-month">
              {selectedDate.month || "Select Month"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {months.map((month, index) => (
                <Dropdown.Item key={index} eventKey={month}>
                  {month}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={4}>
          <Dropdown onSelect={(e) => handleSelect("day", e)}>
            <Dropdown.Toggle variant="success" id="dropdown-day">
              {selectedDate.day || "Select Day"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {days.map((day) => (
                <Dropdown.Item key={day} eventKey={day}>
                  {day}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={4}>
          <Dropdown onSelect={(e) => handleSelect("year", e)}>
            <Dropdown.Toggle variant="success" id="dropdown-year">
              {selectedDate.year || "Select Year"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {years.map((year) => (
                <Dropdown.Item key={year} eventKey={year}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="justify-content-md-center align-items-center">
        <Col md={6}>
          {/* Report type selection dropdown */}
          <Dropdown onSelect={handleReportTypeSelect}>
            <Dropdown.Toggle variant="primary" id="dropdown-report-type">
              {reportType || "Select Report Type"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="property">
                Property Reports
              </Dropdown.Item>
              <Dropdown.Item eventKey="tokens">Tokens Reports</Dropdown.Item>
              <Dropdown.Item eventKey="services">
                Services Reports
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={2}>
          <Button onClick={downloadReport} variant="info">
            Download Report
          </Button>
        </Col>
      </Row>
      {/* <Row className="justify-content-md-center">
      </Row> */}
    </Container>
  );
};

export default ReportDownload;
