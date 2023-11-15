// PurchaseToken.js
import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom'; // Import useHistory for redirection
import { getUserDetailsFromJwt } from '../../../utils'; // Update the import path as needed
import StripeService from '../../../services/agent/stripe-service'; // Update the import path as needed

const PurchaseToken = () => {
    const [tokenQuantity, setTokenQuantity] = useState(1); // Default to 1 for initial quantity
    // const [userDetails, setUserDetails] = useState(null); // State to store user details
    const history = useHistory(); // Hook for navigation

    const userDetails = getUserDetailsFromJwt();

    // useEffect(() => {
    //     // Get user details from JWT token stored in localStorage
    //     const userDetailsFromJwt = getUserDetailsFromJwt(localStorage.getItem('token'));
    //     setUserDetails(userDetailsFromJwt);
    // }, []);

    const handleTokenQuantityChange = (event) => {
        setTokenQuantity(event.target.value);
    };

    const handlePurchase = async () => {
        if (!userDetails) {
            console.error('User details are not available.');
            return;
        }

        const pricePerToken = 50; // Example fixed price per token
        const totalAmount = tokenQuantity * pricePerToken;
        try {
            const purchaseResponse = await StripeService.createInvoice(
                userDetails.stripeCustomerId,
                'prod_OxkEHqzEUtR6P5', // The actual product ID
                'price_id', // The actual price ID
                tokenQuantity,
                totalAmount
            );
            if (purchaseResponse && !purchaseResponse.error) {
                // Navigate to the InvoicePage with the response data
                history.push('/agent/invoice', { invoiceDetails: purchaseResponse });
            } else {
                // Handle errors
                console.error('Purchase failed:', purchaseResponse.error);
            }
        } catch (error) {
            console.error('Error during purchase:', error);
        }
    };

    return (
        <div>
            <h2>Purchase Tokens</h2>
            <div>
                <label>Token Quantity:</label>
                <input
                    type="number"
                    value={tokenQuantity}
                    onChange={handleTokenQuantityChange}
                    min="1"
                />
            </div>
            <div>
                <p>Total Amount: ${tokenQuantity * 50}</p>
            </div>
            <div>
                <button className="btn theme-btn-1 btn-effect-1 text-uppercase" onClick={handlePurchase}>Purchase</button>
                <Link className="btn theme-btn-2 request-now-btn" to="/agent/dashboard">Cancel</Link>
            </div>
        </div>
    );
};

export default PurchaseToken;
