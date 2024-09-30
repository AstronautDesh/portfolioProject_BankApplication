// client/src/store/reducers/userReducer.js
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

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Reducer to handle user actions
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Reset error on new request
      };

    case USER_LOGIN_SUCCESS:
      console.log("USER_LOGIN_SUCCESS payload:", action.payload);
      return {
        ...state,
        loading: false,
        userInfo: action.payload.user, // Store user info from login
        isAuthenticated: true, // User is authenticated after successful login
        error: null,
      };

    case USER_LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        userInfo: null, // Reset user info on failure
        isAuthenticated: false,
        error: action.payload, // Set error message
      };

    case USER_SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Reset error on new request
      };

    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload, // Store user info after signup
        isAuthenticated: false, // User is not authenticated immediately after signup
        error: null,
      };

    case USER_SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        userInfo: null,
        isAuthenticated: false,
        error: action.payload, // Set error message
      };

    case USER_LOGOUT:
      return {
        ...state,
        userInfo: null, // Clear user info on logout
        isAuthenticated: false,
        error: null,
      };

    case USER_IMAGE_UPLOAD_REQUEST:
      return { ...state, loading: true }; // Set loading state for image upload

    case USER_IMAGE_UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: {
          ...state.userInfo,
          user: {
            ...state.userInfo.user,
            image: action.payload.image, // Update user's image
          },
        },
      };

    case USER_IMAGE_UPLOAD_FAIL:
      return { ...state, loading: false, error: action.payload }; // Handle image upload failure

    default:
      return state; // Return current state by default
  }
};

export default userReducer;
