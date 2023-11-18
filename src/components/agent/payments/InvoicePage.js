// // InvoicePage.js
// import React from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import { getUserDetailsFromJwt } from '../../../utils'; // Update the import path as needed

// const InvoicePage = () => {
//   const location = useLocation();
//   const userDetails = getUserDetailsFromJwt();

//   // You would also pass the invoice details to this page after the purchase
//   const { invoiceDetails } = location.state || {};

//   return (
//     <div>
//       <h1>Invoice</h1>
//       <p>Trader Name: {userDetails?.name}</p>
//       <p>Trader ID: {userDetails?.id}</p>
//       <p>Email: {userDetails?.email}</p>
//       {/* ...Other details... */}
//       <p>Total Amount Paid: ${invoiceDetails?.totalAmount}</p>
//       {/* Include a Link to go back to the dashboard or another relevant page */}
//       <Link to="/agent/dashboard">Back to Dashboard</Link>
//     </div>
//   );
// };

// export default InvoicePage;

import React from "react";

const InvoicePage = () => {
  const styles = {
    invoiceContainer: {
      maxWidth: "600px",
      border: "1px solid #ddd",
      padding: "20px",
    },
    invoiceHeader: {
      borderBottom: "1px solid #ddd",
      marginBottom: "20px",
      paddingBottom: "10px",
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between'
    },
     date: {
      textAlign: "right",
    },
    invoiceDetails: {
      textAlign: "left",
    },
    invoiceBody: {
      marginBottom: "20px",
    },
    invoiceClient: {
      marginBottom: "20px",
    },
    invoiceTable: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
    },
    tableData: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
    },
    invoiceFooter: {
      textAlign: "right",
      borderTop: "1px solid #ddd",
      paddingTop: "10px",
    },
  };

  return (
    <div>
      <h1>Invoice</h1>
      <div style={styles.invoiceContainer}>
        <header style={styles.invoiceHeader}>
          <div style={styles.invoiceDetails}>
            <p><b>Trader Name:</b> Maamy Khan</p>
            <p><b>Trader ID:</b> 4511541215</p>
          </div>
          <div>
            <p style={styles.date}><b>Invoice Date:</b> 23:23:23</p>
          </div>
        </header>
        <section style={styles.invoiceBody}>
          <table style={styles.invoiceTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Description</th>
                <th style={styles.tableHeader}>Quantity</th>
                <th style={styles.tableHeader}>Price</th>
                <th style={styles.tableHeader}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableData}>A very good item</td>
                <td style={styles.tableData}>7</td>
                <td style={styles.tableData}>78</td>
                <td style={styles.tableData}>545</td>
              </tr>
              <tr>
                <td style={styles.tableData}>A very good item</td>
                <td style={styles.tableData}>7</td>
                <td style={styles.tableData}>78</td>
                <td style={styles.tableData}>545</td>
              </tr>
              <tr>
                <td style={styles.tableData}>A very good item</td>
                <td style={styles.tableData}>7</td>
                <td style={styles.tableData}>78</td>
                <td style={styles.tableData}>545</td>
              </tr>
              <tr>
                <td style={styles.tableData}>A very good item</td>
                <td style={styles.tableData}>7</td>
                <td style={styles.tableData}>78</td>
                <td style={styles.tableData}>545</td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer style={styles.invoiceFooter}>
          <p>Total due: $1 tarzan</p>
        </footer>
      </div>
    </div>
  );
};

export default InvoicePage;
