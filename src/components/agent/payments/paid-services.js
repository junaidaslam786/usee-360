import React from 'react';

const PaidServices = () => {
  const tableData = [
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
    { id: 'video call', token: 1 },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <p style={{ fontSize: '3.5vmin', color: 'black' }}>Paid Services</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', width: '10vmin' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{row.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{row.token}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                <button style={{ backgroundColor: '#00C800', color: '#fff', padding: '5px 8px', border: 'none', borderRadius: '3px' }}>
                  Button
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
