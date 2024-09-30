import React from 'react'
import { Link } from 'react-router-dom';

function MorePage() {
  return (
    <div className='morepage'>MorePage
      <h1>More Cards For Utilities</h1>


      <div className="back-link-container link-container">
        <Link to="/account-dashboard" className="linktag">
          <h3 className="back">My Dashboard</h3>
        </Link>
        <Link to="/account" className="linktag">
          <h3 className="back">Go Back To Accounts</h3>
        </Link>
      </div>
    </div>
  )
}

export default MorePage;