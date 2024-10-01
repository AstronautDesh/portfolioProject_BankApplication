// src/actions/userActions.js
import axios from 'axios';

import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_IMAGE_UPLOAD_REQUEST,
  USER_IMAGE_UPLOAD_SUCCESS,
  USER_IMAGE_UPLOAD_FAIL,
} from '../constants/userConstants';

// Action Types
//export const USER_SIGNUP_REQUEST = 'USER_SIGNUP_REQUEST';
//export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS';
//export const USER_SIGNUP_FAIL = 'USER_SIGNUP_FAIL';
//export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
//export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
//export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';
//export const USER_LOGOUT = 'USER_LOGOUT';
//export const USER_IMAGE_UPLOAD_REQUEST = 'USER_IMAGE_UPLOAD_REQUEST';
//export const USER_IMAGE_UPLOAD_SUCCESS = 'USER_IMAGE_UPLOAD_SUCCESS';
//export const USER_IMAGE_UPLOAD_FAIL = 'USER_IMAGE_UPLOAD_FAIL';

//export const USER_IMAGE_UPLOAD_REQUEST = "USER_IMAGE_UPLOAD_REQUEST";
//export const USER_IMAGE_UPLOAD_SUCCESS = "USER_IMAGE_UPLOAD_SUCCESS";
//export const USER_IMAGE_UPLOAD_FAIL = "USER_IMAGE_UPLOAD_FAIL";


// Logout action
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('userInfo'); // Clear user info from local storage
  dispatch({ type: USER_LOGOUT }); // Dispatch logout action
};

// Signup action
export const signupUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNUP_REQUEST }); // Dispatch signup request action
    const response = await axios.post('/api/users/signup', userData);
    dispatch({ type: USER_SIGNUP_SUCCESS, payload: response.data }); // Dispatch success action
  } catch (error) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Login action
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST }); // Dispatch login request action

    let loginData;
    if (credentials.pin) {
      loginData = { pin: credentials.pin }; // Login with PIN
    } else if (credentials.accountNumber && credentials.password) {
      loginData = { accountNumber: credentials.accountNumber, password: credentials.password }; // Login with account number and password
    } else {
      throw new Error('Invalid credentials: Provide PIN or Account Number and Password');
    }

    const response = await axios.post('/api/users/login', loginData);
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: response.data,
    });
    localStorage.setItem('userInfo', JSON.stringify(response.data)); // Save user info in localStorage
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Upload user image action
export const uploadUserImage = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_IMAGE_UPLOAD_REQUEST });

    const {
      user: { userInfo },
    } = getState();

    if (!userInfo || !userInfo.user || !userInfo.user._id) {
      throw new Error('User ID is missing from the state');
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    console.log('Sending user ID:', userInfo.user._id);

    const { data } = await axios.post('/api/users/upload-image', formData, config);

    dispatch({ type: USER_IMAGE_UPLOAD_SUCCESS, payload: data });

    // Update userInfo in Redux store
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: { ...userInfo, user: { ...userInfo.user, image: data.image } },
    });

    // Update local storage
    const updatedUserInfo = { ...userInfo, user: { ...userInfo.user, image: data.image } };
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
  } catch (error) {
    console.error('Upload error:', error);
    dispatch({
      type: USER_IMAGE_UPLOAD_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};