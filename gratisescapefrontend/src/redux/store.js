import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import notificationReducer from "./notificationSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
  },
});
