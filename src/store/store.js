import { configureStore } from '@reduxjs/toolkit';
import propertySearchReducer from './propertySearchSlice';

const store = configureStore({
  reducer: {
    propertySearch: propertySearchReducer,
  },
});

export default store;
