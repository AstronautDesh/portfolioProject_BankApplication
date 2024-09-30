// src/api/userAPI.js
import axios from 'axios';

// Function to check user credentials
export const checkUser = async (type, inputValue) => {
  try {
    const response = await axios.post(`/api/users/check-user`, {
      type,
      inputValue,
    });
    return response.data;  // Assuming the backend returns data in this format
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;  // Re-throw error for handling in the calling code
  }
};

// Function to signup a user
export const signup = async (userData) => {
  try {
    const response = await axios.post(`/api/users/signup`, userData);
    return response.data;  // Assuming the backend returns data in this format
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;  // Re-throw error for handling in the calling code
  }
};

// Function to login a user
export const login = async (userData) => {
  try {
    const response = await axios.post(`/api/users/login`, userData);
    return response.data;  // Assuming the backend returns the user data
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;  // Re-throw error for handling in the calling code
  }
};




