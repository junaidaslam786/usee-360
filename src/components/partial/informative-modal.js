import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const InformativeModal = ({ isOpen, onRequestClose }) => {
  //   const [modalIsOpen, setModalIsOpen] = useState(false);

  //   const closeModal = () => {
  //     setModalIsOpen(false);
  //   };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1000,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
          maxWidth: "500px",
          width: "90%",
          boxSizing: "border-box",
        },
      }}
    >
      <h2 style={{alignItems: 'center', justifyContent: 'center', paddingLeft: '50px'}}>Welcome to Usee-360!</h2>
      <h4 style={{display: 'flex', justifyContent: 'center'}}>
        <i class="fa-solid fa-triangle-exclamation" style={{color: 'red', paddingRight: '5px'}}></i> {"  "} Alert{"  "}
        <i class="fa-solid fa-triangle-exclamation" style={{color: 'red', paddingLeft: '5px'}}></i>
      </h4>
      <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
        <p>
          {" "}
          Dear Customer please conduct all you communications and dealing on
          Usee-360 to protect your rights and avoid any future misunderstanding
          or disputes with agents and real estate.
        </p>
        <button
          onClick={onRequestClose}
          style={{
            padding: "10px 20px",
            margin: "20px 0",
            justifyContent: 'center',
            backgroundColor: "#00a8e8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default InformativeModal;
