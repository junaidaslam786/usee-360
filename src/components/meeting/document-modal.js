import React from 'react';
import Modal from 'react-modal';

function DocumentModal({ isOpen, onClose, documentUrl }) {

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={handleCloseModal} 
      contentLabel="Document Modal"
      className="document-modal"
      overlayClassName="document-modal-overlay"
      shouldCloseOnOverlayClick={false}
    >
      <button className="property-close-button" onClick={handleCloseModal}>
        X
      </button>
      {documentUrl && documentUrl.endsWith('.pdf') ? (
        <iframe src={documentUrl} title="PDF Document" width="100%" height="100%" />
      ) : (
        <img src={documentUrl} alt="Document" className="document-modal-div" />
      )}
    </Modal>
  );
}

export default DocumentModal;
