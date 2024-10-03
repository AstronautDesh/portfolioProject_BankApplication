// Main.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { USER_LOGIN_SUCCESS } from './store/constants/userConstants'; // Add the constants for dispatching
//import Navigate from './Components/Navigate';
import SignUpForm from './Components/SignUpForm';
import AccountDashboard from './Components/AccountDashboard';
import SecurityInputDropdown from './Components/SecurityInputDropdown';
import TransactionPage from './Components/TransactionPage';
import MorePage from './Components/MorePage';
import InboxPage from './Components/InboxPage';
import SendMoney from './Components/SendMoney';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import AccountPage from './Pages/AccountPage';
import ContactPage from './Pages/ContactPage';
import CareerPage from './Pages/CareerPage';
import '../src/Main.css';

function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add useDispatch for Redux

  // Check if the user is logged in on component mount
  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfoFromStorage) {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: userInfoFromStorage,
      });
    }
  }, [dispatch]); // Empty dependency array to run on initial render

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
    navigate('/', { replace: true });
  }

  return (
    <div className="Main-Container">
      <header>
        <h1>Bank Of The SouthWesternLands</h1>
      </header>
      {/* <Navigate isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> */}


      <Routes>
        <Route path="/" element={<HomePage isMenuOpen={isMenuOpen} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/account" element={<AccountPage isMenuOpen={isMenuOpen} />} />
        <Route path="/contact" element={<ContactPage isMenuOpen={isMenuOpen} />} />
        <Route path="/career" element={<CareerPage isMenuOpen={isMenuOpen} />} />
        <Route path="/open_account" element={<SignUpForm />} />
        <Route path="/login-dropdown" element={<SecurityInputDropdown />} />
        <Route path="/account-dashboard" element={<AccountDashboard isMenuOpen={isMenuOpen} userType="pin" userValue="1234" />} />
        <Route path="/send-money" element={<SendMoney />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/transaction-card" element={<TransactionPage isMenuOpen={isMenuOpen} />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default Main;