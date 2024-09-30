import React from 'react'
import { Link } from 'react-router-dom';

function InboxPage() {
  return (
    <div className='inboxpage'>Inbox - Page
      <h1>More Cards For Inbox Utilities</h1>


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

export default InboxPage;