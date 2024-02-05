import React, { useState } from "react";
import Modal from "react-modal";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onPasswordSubmit,
}) => {
  const [screen, setScreen] = useState(1);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (screen === 2) {
      // Instead of verifying here, call a function passed from the parent component
      onPasswordSubmit(password, setError, () => setScreen(3)); // Pass setError and a callback to move to the next screen
    } else {
      setScreen(screen + 1);
    }
  };

  const handleBack = () => {
    setError(""); // Clear errors when going back
    setScreen(Math.max(1, screen - 1)); // Ensure screen doesn't go below 1
  };

  const handleClose = () => {
    setScreen(1); // Reset to first screen
    setPassword(""); // Reset password
    setError(""); // Clear any errors
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

  // return (
  //   <Modal isOpen={isOpen} onRequestClose={handleClose} style={modalStyle}>
  //     <div style={modalContentStyle}>
  //       {screen === 1 && (
  //         <>
  //           <p style={modalTextStyle}>
  //             The following resources will be permanently deleted:
  //           </p>
  //           <ul style={modalListStyle}>
  //             <li>Properties</li>
  //             <li>Appointments</li>
  //             <li>Timeslots</li>
  //             <li>Subscriptions</li>
  //           </ul>
  //           <button
  //             onClick={handleNext}
  //             className="btn theme-btn-1 btn-effect-1 text-uppercase"
  //           >
  //             Next
  //           </button>
  //           <button
  //             onClick={handleClose}
  //             className="btn theme-btn-1 btn-effect-2 text-uppercase"
  //           >
  //             Cancel
  //           </button>
  //         </>
  //       )}

  //       {screen === 2 && (
  //         <>
  //           <p style={modalTextStyle}>
  //             Please enter your password to confirm account deletion.
  //           </p>
  //           {error && (
  //             <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
  //           )}
  //           <input
  //             type="password"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             className="form-control"
  //             placeholder="Password"
  //             style={{ marginBottom: "20px" }}
  //           />
  //           <button
  //             onClick={handlePasswordVerification}
  //             className="btn theme-btn-1 btn-effect-1 text-uppercase"
  //           >
  //             Verify
  //           </button>
  //           <button
  //             onClick={handleBack}
  //             className="btn theme-btn-1 btn-effect-2 text-uppercase"
  //           >
  //             Back
  //           </button>
  //         </>
  //       )}

  //       {screen === 3 && (
  //         <>
  //           <p style={modalTextStyle}>
  //             Are you sure you want to delete your account? This action cannot
  //             be undone.
  //           </p>
  //           <button
  //             onClick={onConfirm}
  //             className="btn theme-btn-1 btn-effect-1 text-uppercase"
  //           >
  //             Confirm Delete
  //           </button>
  //           <button
  //             onClick={handleClose}
  //             className="btn theme-btn-1 btn-effect-2 text-uppercase"
  //           >
  //             Close
  //           </button>
  //         </>
  //       )}
  //     </div>
  //   </Modal>
  // );
  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose} style={modalStyle}>
      <div style={{ textAlign: "center" }}>
        {screen === 1 && (
          <>
            <p style={{ marginBottom: "20px" }}>
              The following resources will be permanently deleted:
            </p>
            <ul
              style={{
                textAlign: "left",
                listStyleType: "disc",
                listStylePosition: "inside",
                marginBottom: "20px",
              }}
            >
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
            <p style={{ marginBottom: "20px" }}>
              Please enter your password to confirm account deletion.
            </p>
            {error && (
              <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Password"
              style={{ marginBottom: "20px" }}
            />
            <button
              onClick={handleNext}
              className="btn theme-btn-1 btn-effect-1 text-uppercase"
            >
              Verify
            </button>
            <button
              onClick={handleBack}
              className="btn theme-btn-1 btn-effect-2 text-uppercase"
            >
              Back
            </button>
          </>
        )}
        {screen === 3 && (
          <>
            <p style={{ marginBottom: "20px" }}>
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
