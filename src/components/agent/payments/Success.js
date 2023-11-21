import React from 'react';
import { useHistory } from 'react-router-dom';

const SuccessComponent = () => {
  const history = useHistory();

  const handleBackToHome = () => {
    history.push('/agent/wallet'); // Redirects to home page or dashboard
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '75vh',
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#10b981', // Tailwind CSS 'emerald' color
      }}>
        Payment Successful!
      </h1>
      <p style={{
        fontSize: '1.25rem',
        marginBottom: '2rem',
      }}>
        Thank you for your purchase. A confirmation email has been sent to you.
      </p>
      <button
        onClick={handleBackToHome}
        style={{
          backgroundColor: '#10b981', // Tailwind CSS 'emerald' color
          color: 'white',
          fontSize: '1rem',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
          transition: 'all 0.2s ease',
        }}
      >
        Go to Wallet
      </button>
    </div>
  );
};

export default SuccessComponent;
