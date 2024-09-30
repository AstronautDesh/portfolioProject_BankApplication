// src/api/transactionApi.js
import axios from 'axios';

export const fetchRecipientName = async (accountNumber) => {
  try {
    console.log("Making API call to fetch recipient name with account number:", accountNumber);
    // Update this URL to match the backend route
    const response = await axios.get(`/api/users/recipient-name/${accountNumber}`); // Ensure the endpoint matches
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipient name:", error);
    throw error;
  }
};

export const submitTransaction = async (transactionDetails) => {
  console.debug('submitTransaction called with:', transactionDetails);
  
  try {
    const response = await axios.post('/api/users/submit-transaction', transactionDetails);
    console.debug('Response received:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status code that falls out of the range of 2xx
      console.error('Error response from server:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};

// Function to fetch transaction data
export const fetchTransactionData = async (accountNumber) => {
  console.log('Fetching transaction data for account:', accountNumber);
  try {
    const response = await axios.get(`/api/users/transactions/${accountNumber}`);
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    console.log('Error response:', error.response);
    throw error;
  }
};