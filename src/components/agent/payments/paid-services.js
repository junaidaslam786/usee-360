import React, { useState } from 'react';
import './PaidServices.css'; // Importing the CSS file

const PaidServices = ({ servicesType }) => {
  const [services, setServices] = useState([
    {
      id: servicesType === 'paid' ? 'video call' : 'free call', 
      name: servicesType === 'paid' ? 'Video Call Service' : 'Free Call Service', 
      tokenPrice: servicesType === 'paid' ? 1 : 0, 
      quantity: 1, 
      autoRenew: false
    },
    // Add other services as needed
  ]);

  const handleQuantityChange = (index, quantity) => {
    const updatedServices = services.map((service, idx) => {
      if (idx === index) {
        return { ...service, quantity: quantity };
      }
      return service;
    });
    setServices(updatedServices);
  };

  const handleAutoRenewToggle = (index) => {
    const updatedServices = services.map((service, idx) => {
      if (idx === index) {
        return { ...service, autoRenew: !service.autoRenew };
      }
      return service;
    });
    setServices(updatedServices);
  };

  const handlePurchase = (service) => {
    console.log('Purchasing', service);
    // Implement the purchase logic here
  };

  return (
    <div className={`${servicesType}-services`}>
      <h2>{servicesType.charAt(0).toUpperCase() + servicesType.slice(1)} Services</h2>
      <table>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Name</th>
            <th>Quantity</th>
            <th>Price In Token</th>
            <th>Total Tokens</th>
            <th>Auto Renew</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={service.id}>
              {/* <td>{service.id}</td> */}
              <td>{service.name}</td>
              <td>
                <input
                  type="number"
                  value={service.quantity}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                  min="1"
                />
              </td>
              <td>{service.tokenPrice}</td>
              <td>{service.tokenPrice * service.quantity}</td>
              <td>
                <input
                  type="checkbox"
                  checked={service.autoRenew}
                  onChange={() => handleAutoRenewToggle(index)}
                />
              </td>
              <td>
                <button onClick={() => handlePurchase(service)}>
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaidServices;
