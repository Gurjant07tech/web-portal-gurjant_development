import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: { authToken: null, userData: null },
  reducers: {
    saveAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    saveUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { saveAuthToken, saveUserData } = loginSlice.actions;

export default loginSlice.reducer;
