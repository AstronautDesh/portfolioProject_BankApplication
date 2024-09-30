import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLinks = () => {
  return (
    <div className="back-link-container link-container mt-4">
      <Link to="/account-dashboard" className="linktag">
        <h3 className="back">My Dashboard</h3>
      </Link>
      <Link to="/account" className="linktag">
        <h3 className="back">Go Back To Accounts</h3>
      </Link>
    </div>
  );
};

export default NavigationLinks;