// Wallet.js
import React from 'react';

import profileImg from '../../../logo192.png';
import { getUserDetailsFromJwt } from '../../../utils';



const Wallet = ({ totalTokens }) => {
  // Hardcoded transactions array
  const transactions = [
    { id: 1, service: 'Service A', amount: 10, color: '#8a2be2' }, // Example transaction
    { id: 2, service: 'Service B', amount: 50, color: '#ff4500' }, // Example transaction
    { id: 3, service: 'Service C', amount: 75, color: '#808080' }, // Example transaction
  ];

  // const userDetails = getUserDetailsFromJwt();
  // console.log(userDetails)
  const userDetails = JSON.stringify(localStorage.getItem('userDetails'));
  console.log(userDetails);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div>
        <img
          src={profileImg}
          alt="Profile"
          style={{ borderRadius: '50%', width: '100px', height: '100px' }}
        />
        <h2>My Wallet</h2>
        <h3>Total Token</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalTokens}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>Short by</span>
          <span>Last 24h ▼</span>
        </div>
        {transactions.map((transaction) => (
          <div key={transaction.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: transaction.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px',
              }}
            >
              $
            </div>
            <span style={{ flex: 1 }}>{transaction.service}</span>
            <span>{transaction.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;