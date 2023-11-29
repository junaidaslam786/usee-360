import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import StripeService from "../../../services/agent/stripe-service";


const InvoicePage = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { invoiceId } = useParams();

  useEffect(() => {
    console.log('Invoice ID:', invoiceId); // Check if invoiceId is correct
    const fetchInvoiceDetails = async () => {
      try {
        const invoiceDetails = await StripeService.getInvoiceDetails(invoiceId);
        console.log('Invoice Details:', invoiceDetails); // Check the response
        setInvoice(invoiceDetails.invoice);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch invoice details');
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);


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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Formatting the Unix timestamp to a readable date
  const formattedDate = invoice ? new Date(invoice.created * 1000).toLocaleDateString() : '';

  // Extracting line item details
  const lineItem = invoice?.lines?.data[0];
  const quantity = lineItem?.quantity;
  const pricePerUnit = lineItem?.price.unit_amount / 100; // Assuming the amount is in cents
  const totalAmount = invoice?.amount_paid / 100; // Assuming the amount is in cents

  return (
    <div>
      <h1>Invoice</h1>
      <div style={styles.invoiceContainer}>
        <header style={styles.invoiceHeader}>
          <div style={styles.invoiceDetails}>
            <p><b>Date:</b> {formattedDate}</p>
            <p><b>Total Amount Paid:</b> ${totalAmount}</p>
          </div>
        </header>
        <section style={styles.invoiceBody}>
          <table style={styles.invoiceTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Description</th>
                <th style={styles.tableHeader}>Quantity</th>
                <th style={styles.tableHeader}>Price per Unit</th>
                <th style={styles.tableHeader}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableData}>{lineItem?.description}</td>
                <td style={styles.tableData}>{quantity}</td>
                <td style={styles.tableData}>${pricePerUnit}</td>
                <td style={styles.tableData}>${totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default InvoicePage;
