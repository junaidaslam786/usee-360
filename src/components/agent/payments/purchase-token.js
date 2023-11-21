// PurchaseToken.js
import React, { useState, useEffect } from 'react';
import { useHistory, Link,  } from 'react-router-dom'; // Import useHistory for redirection
import { getUserDetailsFromJwt } from '../../../utils'; 
import StripeService from '../../../services/agent/stripe-service'; 
import UserService from '../../../services/agent/user';

const PurchaseToken = () => {
    const [tokenQuantity, setTokenQuantity] = useState(1); // Default to 1 for initial quantity
    const [customerId, setCustomerId] = useState(null);
    const [config, setConfig] = useState(null);
    const [priceId, setPriceId] = useState(null);
    const history = useHistory(); // Hook for navigation


    useEffect(() => {
        // Fetch user details on component mount
        const fetchUserDetails = async () => {
          try {
            // Assuming you are storing the user ID in local storage or you get it from the auth context
            const userId = getUserDetailsFromJwt();
            const response = await UserService.detail(userId.id);
            // const customerId = response.user.stripeCustomerId;
            console.log(response)
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
            setConfig(configValue);

            const productId = configValue.configValue.stripeProductId;
            const productDetails = await StripeService.fetchStripeProductActivePrices(productId);
            console.log('Fetched product details:', productDetails.prices.data[0].id);
            if (productDetails && !productDetails.error) {
              setPriceId(productDetails.prices.data[0].id); // Set the default price
            } else {
                console.error('Failed to fetch Stripe product details:', productDetails.error);
            }

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
        const pricePerToken = config.configValue ;
        // const totalAmount = tokenQuantity * pricePerToken;
        try {
            const purchaseResponse = await StripeService.createCheckoutSession(
                customerId,
                // 'prod_OxkEHqzEUtR6P5', // The actual product ID
                priceId, // The actual price ID
                tokenQuantity,
                
            );
            if (purchaseResponse && !purchaseResponse.error) {
                // Navigate to the InvoicePage with the response data
                // history.push('/agent/invoice', { invoiceDetails: purchaseResponse });
                window.location.href = purchaseResponse.data.session.url;
            } else {
                // Handle errors
                console.error('Purchase failed:', purchaseResponse.error);
            }
        } catch (error) {
            console.error('Error during purchase:', error);
        }
        // history.push('/agent/invoice');
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
                <button className="btn theme-btn-1 btn-effect-1 text-uppercase" onClick={handlePurchase}>Purchase</button>
                <Link className="btn theme-btn-2 request-now-btn" to="/agent/dashboard">Cancel</Link>
            </div>
        </div>
    );
};

export default PurchaseToken;
