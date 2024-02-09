import React from 'react';

const LinearProgressBar = ({ progress }) => {
  // Style for the outer bar
  const containerStyles = {
    height: '20px',
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: '5px',
    margin: '20px 0',
    boxShadow: "inset 0 1px 2px rgba(0,0,0,.1)",
  };

  // Dynamic style for the inner bar
  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: progress < 50 ? '#ff6c6c' : '#4caf50', // Red for less than 50%, green otherwise
    borderRadius: 'inherit',
    textAlign: 'center',
    transition: 'width 0.6s ease',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        {progress}%
      </div>
    </div>
  );
};

export default LinearProgressBar;
