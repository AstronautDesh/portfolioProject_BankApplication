import React from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const SignUpSuccessModal = ({ show, handleClose }) => {
  const userInfo = useSelector(state => state.user.userInfo);

  React.useEffect(() => {
    if (show) {
      console.log('SignUpSuccessModal opened');
    }
  }, [show]);

  const onClose = () => {
    console.log('SignUpSuccessModal closed');
    handleClose();
  };

  if (!userInfo || !userInfo.user) {
    return null;
  }

  const { fullname, accountNumber, pin } = userInfo.user;

  return (
    <Modal show={show} onHide={onClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>Signup Successful</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <p>Congratulations <strong>{fullname}</strong>, your account has been created with:</p>
          <p><strong>Account Number:</strong> {accountNumber}</p>
          <p><strong>PIN:</strong> {pin}</p>
          <p>You are advised to change your PIN in the account dashboard to a 4-digit number of your choice.</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpSuccessModal;
