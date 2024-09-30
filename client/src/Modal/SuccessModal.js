import React from 'react';
import '../css/successmodal.css';
const SuccessModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Funds Sent Successfully</h2>
        <p>Your funds have been transferred successfully.</p>
        <button className='modal-btn' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SuccessModal;
