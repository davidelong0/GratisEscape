import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: true, // attiva Redux DevTools
});

export default store;
