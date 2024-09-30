// src/reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import transactionReducer from './transactionReducer'; // Import your transaction reducer

const rootReducer = combineReducers({
  user: userReducer,
  transaction: transactionReducer, // Add the transaction reducer
});

export default rootReducer;
