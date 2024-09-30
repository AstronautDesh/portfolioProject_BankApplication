import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/actions/userActions';
import IconsComponent from '../Components/MenuList';
import { Link } from 'react-router-dom';
import '../css/accountpage.css';

function AccountPage({ isMenuOpen }) {
  // Get access to the Redux dispatch function
  const dispatch = useDispatch();

  // useEffect hook to dispatch logoutUser action when the component mounts
  useEffect(() => {
    // Dispatch the logout action
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <div className='account'>
      <div className='account-grid'>
        <Link to='/open_account' className='linktag'>
          <div className='account-type'>
            <h3>Open Account</h3>
          </div>
        </Link>

        <Link to='/login-dropdown' className='linktag'>
          <div className='internet-banking'>
            <h3>Sign-In To Your Account</h3>
          </div>
        </Link>
      </div>
      <IconsComponent />
    </div>
  );
}

export default AccountPage;
