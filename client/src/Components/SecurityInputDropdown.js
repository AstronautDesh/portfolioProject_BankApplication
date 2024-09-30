// src/Components/SecurityInputDropdown.js

import React, { useState, useCallback, useEffect } from 'react';
import { Dropdown, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/actions/userActions';
import "../css/inputDropdown.css";

const SecurityInputDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for selected security type and input values
  const [type, setType] = useState(''); // Can be 'PIN', 'Password', or 'AccountPassword'
  const [inputValue, setInputValue] = useState(''); // Stores input values like PIN or Password
  const [accountNumber, setAccountNumber] = useState(''); // Stores the account number

  // Get authentication status, error, and user info from Redux store
  const { isAuthenticated, error, userInfo } = useSelector((state) => state.user || {});

  // Handle security type selection
  const handleTypeSelect = useCallback((selectedType) => {
    setType(selectedType);
    setInputValue('');
    setAccountNumber('');
  }, []);

  // Handle input value change for account number or PIN/password
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'inputValue') {
      setInputValue(value.trim());
    } else if (name === 'accountNumber') {
      setAccountNumber(value.trim());
    }
  }, []);

  // Handle form submission for authentication
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (type === 'AccountPassword' && accountNumber && inputValue) {
      // Dispatch login action for Account Number + Password
      dispatch(loginUser({ accountNumber, password: inputValue }));
    } else if (type === 'PIN' && inputValue) {
      // Dispatch login action for PIN
      dispatch(loginUser({ pin: inputValue }));
    } else {
      // Log error if input fields are missing
      console.error(`Please provide the required information for ${type}.`);
    }
  }, [dispatch, type, inputValue, accountNumber]);

  // Get placeholder text based on selected security type
  const getPlaceholder = () => {
    switch (type) {
      case 'PIN':
        return 'Enter your PIN';
      case 'AccountPassword':
        return 'Enter your password';
      default:
        return 'Enter your security info';
    }
  };

  // Redirect to account dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated && userInfo && userInfo._id) {
      console.log('User authenticated, _id:', userInfo._id);
      navigate('/account-dashboard');
    }
  }, [isAuthenticated, userInfo, navigate]);

  return (
    <div className="login-dropdown d-flex flex-column justify-content-center align-items-center">
      <div className="dropdownGrid">
        {/* Security type dropdown */}
        <Dropdown onSelect={handleTypeSelect}>
          <Dropdown.Toggle aria-label="Select Security Type">
            {type || 'Select Security Type'}
          </Dropdown.Toggle>
          <Dropdown.Menu className="bg-success btndrpdwn" role="menu">
            <Dropdown.Item eventKey="PIN" aria-label="PIN">PIN</Dropdown.Item>
            <Dropdown.Item eventKey="AccountPassword" aria-label="Account Number + Password">
              Account Number + Password
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Security input form */}
        <Form onSubmit={handleSubmit} className="formInputGrid">
          {type === 'AccountPassword' && (
            <>
              <Form.Control
                type="text"
                name="accountNumber"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={handleInputChange}
                aria-label="Account Number Input"
                className="formInputGrid"
              />
              <Form.Control
                type="password"
                name="inputValue"
                placeholder={getPlaceholder()}
                value={inputValue}
                onChange={handleInputChange}
                aria-label="Password Input"
                className="formInputGrid"
              />
            </>
          )}
          {type === 'PIN' && (
            <Form.Control
              type="number"
              name="inputValue"
              placeholder={getPlaceholder()}
              value={inputValue}
              onChange={handleInputChange}
              aria-label="PIN Input"
              className="formInputGrid"
            />
          )}
          <Button type="submit" variant="success" className="button mt-3">
            Submit
          </Button>
        </Form>

        {/* Back to Accounts link */}
        <div className="back-link-container">
          <Link to="/account" className="linktag">
            <h3 className="back">Go Back To Accounts</h3>
          </Link>
        </div>
      </div>

      {/* Display error if present */}
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
    </div>
  );
};

export default SecurityInputDropdown;
