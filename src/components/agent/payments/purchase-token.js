// PurchaseToken.js
import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom'; // Import useHistory for redirection
import { getUserDetailsFromJwt } from '../../../utils'; 
import StripeService from '../../../services/agent/stripe-service'; 
import UserService from '../../../services/agent/user';

const PurchaseToken = () => {
    const [tokenQuantity, setTokenQuantity] = useState(1); // Default to 1 for initial quantity
    const [customerId, setCustomerId] = useState(null);
    const [config, setConfig] = useState(null);
    const history = useHistory(); // Hook for navigation


    useEffect(() => {
        // Fetch user details on component mount
        const fetchUserDetails = async () => {
          try {
            // Assuming you are storing the user ID in local storage or you get it from the auth context
            const userId = getUserDetailsFromJwt();
            const response = await UserService.detail(userId.id);
            // const customerId = response.user.stripeCustomerId;
            console.log(response.user.stripeCustomerId);
            if (!response.error) {
                setCustomerId(response.user.stripeCustomerId);
              
            } else {
              console.error('Failed to fetch user details:', response.error);
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        };
    
        fetchUserDetails();
      }, []);

      useEffect(() => {
        // Call getConfigByKey when the component mounts
        const fetchConfig = async () => {
          try {
            const configKey = 'tokenPrice'; // Replace with the actual key you need
            const configValue = await StripeService.getConfigByKey(configKey);
            console.log('Fetched config value:', configValue);
            setConfig(configValue.configValue);
          } catch (error) {
            console.error('Error fetching configuration:', error);
          }
        };
    
        fetchConfig();
      }, []);

    //   console.log(userDetails.user);

  
    const handleChangePage = () => {
        history.push('/agent/invoice');
    }

    const handleTokenQuantityChange = (event) => {
        setTokenQuantity(event.target.value);
    };

    const handlePurchase = async () => {
        if (!customerId) {
            console.error('Stripe customer ID is not available.');
            return;
        }

        // const pricePerToken = config ? config : 10;
        const pricePerToken = 10;
        const totalAmount = tokenQuantity * pricePerToken;
        try {
            const purchaseResponse = await StripeService.createInvoice(
                customerId,
                // 'prod_OxkEHqzEUtR6P5', // The actual product ID
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
                <p>Price Per Token: 10</p>
            </div>
            <div>
                <button className="btn theme-btn-1 btn-effect-1 text-uppercase" onClick={handleChangePage}>Purchase</button>
                <Link className="btn theme-btn-2 request-now-btn" to="/agent/dashboard">Cancel</Link>
            </div>
        </div>
    );
};

export default PurchaseToken;
