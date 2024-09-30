 // eslint-disable-next-line
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/actions/userActions";
import { Link } from "react-router-dom";
import SignUpSuccessModal from "../Modal/SignUpSuccessModal";
import "../css/signUpForm.css";

// Define the initial form state
const initialFormState = {
  fullname: "",
  email: "",
  tel: "",
  password: "",
  confirm_password: "",
};

// Create a functional component for SignUpForm
const SignUpForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null); // New state to hold user info
  const errorMessageTimeoutRef = useRef(null);

  const dispatch = useDispatch();
  const { user: newUser = {}, error } = useSelector((state) => state.user || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return alert("Passwords do not match");
    }

    dispatch(signupUser(formData))
      .then(() => {
        setUser(newUser);
        setShowModal(true);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        clearTimeout(errorMessageTimeoutRef.current);
      });
  };

  const handleClose = () => {
    setShowModal(false);
    setUser(null);
    setFormData(initialFormState);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
      const errorMessageTimeout = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      errorMessageTimeoutRef.current = errorMessageTimeout;
    }
  }, [error]);

  return (
    <div className="open_account">
      <div className="form-container">
        <h1>Welcome</h1>
        <h1>Create Account Here</h1>

        <form onSubmit={handleSubmit}>
          {/* Form fields remain the same */}
          <div className="inputbox">
            <input
              type="text"
              name="fullname"
              required
              autoComplete="name"
              onChange={handleChange}
              value={formData.fullname}
              aria-label="Full Name"
            />
            <span>Full Name</span>
          </div>

          <div className="inputbox">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              onChange={handleChange}
              value={formData.email}
              aria-label="Email"
            />
            <span>Email</span>
          </div>

          <div className="inputbox">
            <input
              type="text"
              name="tel"
              required
              onChange={handleChange}
              value={formData.tel}
              aria-label="Phone Number"
            />
            <span>Phone Number</span>
          </div>

          <div className="inputbox">
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              onChange={handleChange}
              value={formData.password}
              aria-label="Password"
            />
            <span>Password</span>
          </div>

          <div className="inputbox">
            <input
              type="password"
              name="confirm_password"
              required
              autoComplete="new-password"
              onChange={handleChange}
              value={formData.confirm_password}
              aria-label="Confirm Password"
            />
            <span>Confirm Password</span>
          </div>

          <div className="submit-btn">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>

        <div className="back-link-container">
          <Link to="/account" className="linktag">
            <h3 className="back">Go Back To Accounts</h3>
          </Link>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <SignUpSuccessModal
          show={showModal}
          handleClose={handleClose}
          user={user}
        />
      </div>
    </div>
  );
};

export default SignUpForm;
