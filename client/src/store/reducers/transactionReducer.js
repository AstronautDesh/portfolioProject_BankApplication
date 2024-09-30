// src/store/reducers/transactionReducer.js
import {
  SET_ACCOUNT_NUMBER,
  SET_AMOUNT,
  SET_CURRENCY,
  SET_TRANSFER_METHOD,
  SET_MEMO,
  FETCH_RECIPIENT_NAME_SUCCESS,
  FETCH_RECIPIENT_NAME_FAILURE,
  TRANSACTION_SUCCESS,
  TRANSACTION_FAILURE
} from '../actions/transactionActions';

const initialState = {
  accountNumber: '',
  amount: '',
  currency: 'NGR',
  transferMethod: 'instant',
  recipientAccountNumber: '',
  memo: '',
  recipientName: '',
  transactionStatus: '',
  error: ''
};

/**
 * Reducer function to handle transaction-related actions.
 * 
 * @param {Object} state - The current state of the transaction reducer.
 * @param {Object} action - The dispatched action with type and payload.
 * @returns {Object} - The new state after applying the action.
 */
const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_NUMBER:
      return { ...state, accountNumber: action.payload };
    case 'SET_RECIPIENT_ACCOUNT_NUMBER':
      return {
        ...state,
        recipientAccountNumber: action.payload
      };
    case SET_AMOUNT:
      return { ...state, amount: action.payload };
    case SET_CURRENCY:
      return { ...state, currency: action.payload };
    case SET_TRANSFER_METHOD:
      return { ...state, transferMethod: action.payload };
    case SET_MEMO:
      return { ...state, memo: action.payload };
    case FETCH_RECIPIENT_NAME_SUCCESS:
      return { ...state, recipientName: action.payload };
    case FETCH_RECIPIENT_NAME_FAILURE:
      return { ...state, error: action.payload };
    case TRANSACTION_SUCCESS:
      return { ...state, transactionStatus: 'Success' };
    case TRANSACTION_FAILURE:
      return { ...state, transactionStatus: 'Failure', error: action.payload };
    default:
      return state;
  }
};

export default transactionReducer;