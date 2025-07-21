import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasNewMessage: false,
  perRichiesta: {},
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNewMessage: (state, action) => {
      state.hasNewMessage = action.payload;
    },
    setNotificaRichiesta: (state, action) => {
      const { richiestaId, value } = action.payload;
      state.perRichiesta[richiestaId] = value;
    },
    removeRichiestaNotifica: (state, action) => {
      delete state.perRichiesta[action.payload];
    },
    resetNotifiche: (state) => {
      state.perRichiesta = {};
    },
    setNotifichePerRichieste: (state, action) => {
      state.perRichiesta = action.payload;
    },
  },
});

export const {
  setNewMessage,
  setNotificaRichiesta,
  removeRichiestaNotifica,
  resetNotifiche,
  setNotifichePerRichieste,
} = notificationSlice.actions;

export default notificationSlice.reducer;
