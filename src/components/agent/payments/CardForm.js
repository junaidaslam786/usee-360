// // CardForm.js
// import React from 'react';
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import StripeService from '../../../services/agent/stripe-service';

// const cardElementOptions = {
//   style: {
//     base: {
//       fontSize: '16px',
//       color: '#424770',
//       '::placeholder': {
//         color: '#aab7c4',
//       },
//     },
//     invalid: {
//       color: '#9e2146',
//     },
//   },
// };

// const CardForm = ({ userDetails, onSuccessfulPayment }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       console.error('Stripe has not initialized');
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);
//     const { error, token } = await stripe.createToken(cardElement);

//     if (error) {
//       console.error('Error:', error);
//       return;
//     }

//     try {
//       const response = await StripeService.createCustomer(userDetails.email, token.id, userDetails.userId);
//       onSuccessfulPayment(response);
//     } catch (error) {
//       console.error('Error creating Stripe customer:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ padding: '20px', margin: '20px auto', maxWidth: '400px' }}>
//       <CardElement options={cardElementOptions} />
//       <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }} disabled={!stripe}>
//         Submit Payment
//       </button>
//     </form>
//   );
// };

// export default CardForm;

// CardForm.js
// CardForm.js
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#303238',
      fontSize: '16px',
      fontFamily: 'sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#CFD7DF',
      },
    },
    invalid: {
      color: '#e5424d',
      ':focus': {
        color: '#303238',
      },
    },
  },
};

const CardForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle card details submission
  };

  return (
    <div style={{ padding: '20px', background: '#f6f9fc', borderRadius: '4px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', marginBottom: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccd0d5' }}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccd0d5' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <button type="submit" disabled={!stripe} style={{ width: '100%', padding: '12px 0', fontSize: '16px', color: 'white', backgroundColor: '#6772e5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Pay
        </button>
      </form>
    </div>
  );
};

export default CardForm;

