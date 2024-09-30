// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index';

const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit's configureStore automatically adds thunk middleware
});

export default store;