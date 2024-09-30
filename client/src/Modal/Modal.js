import React from 'react';
import '../css/modal.css';

const Modal = ({ fullname, accountNumber, pin, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Congratulations <br /> {fullname}!</h2>
        <p>Your account has been created.</p>
        <p>Account Number: {accountNumber}</p>
        <p>PIN: {pin}</p>
        <button className='close' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
