import React, { useState } from "react";
import Modal from "react-modal";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const [screen, setScreen] = useState(1);

  const handleNext = () => setScreen(2);
  const handleClose = () => {
    setScreen(1); // Reset to first screen
    onClose();
  };

  // Modal styles
  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "500px",
      borderRadius: "10px",
      padding: "20px",
      backgroundColor: "#FFF",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  // Button styles
  // const buttonStyle = {
  //   padding: "10px 15px",
  //   margin: "10px 5px",
  //   border: "none",
  //   borderRadius: "5px",
  //   cursor: "pointer",
  //   fontSize: "16px",
  //   fontWeight: "bold",
  //   textTransform: "uppercase",
  //   backgroundColor: "#007bff",
  //   color: "white",
  // };

  // const cancelButtonStyle = {
  //   ...buttonStyle,
  //   backgroundColor: "gray",
  // };

  const modalContentStyle = {
    textAlign: "center",
  };

  const modalTextStyle = {
    marginBottom: "20px",
  };

  const modalListStyle = {
    textAlign: "left",
    listStyleType: "disc",
    listStylePosition: "inside",
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose} style={modalStyle}>
      <div style={modalContentStyle}>
        {screen === 1 && (
          <>
            <p style={modalTextStyle}>
              The following resources will be permanently deleted:
            </p>
            <ul style={modalListStyle}>
              <li>Properties</li>
              <li>Appointments</li>
              <li>Timeslots</li>
              <li>Subscriptions</li>
            </ul>
            <button
              onClick={handleNext}
              className="btn theme-btn-1 btn-effect-1 text-uppercase"
            >
              Next
            </button>
            <button
              onClick={handleClose}
              className="btn theme-btn-1 btn-effect-2 text-uppercase"
            >
              Cancel
            </button>
          </>
        )}

        {screen === 2 && (
          <>
            <p style={modalTextStyle}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <button
              onClick={onConfirm}
              className="btn theme-btn-1 btn-effect-1 text-uppercase"
            >
              Confirm Delete
            </button>
            <button
              onClick={handleClose}
              className="btn theme-btn-1 btn-effect-2 text-uppercase"
            >
              Close
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
