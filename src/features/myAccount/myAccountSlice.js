import { createSlice } from "@reduxjs/toolkit";

export const myAccountSlice = createSlice({
  name: "myAccount",
  initialState: {
    myAccountFormData: {},
  },
  reducers: {
    saveMyAccountFormData: (state, action) => {
      state.myAccountFormData = action.payload;
    },
  },
});

export const { saveMyAccountFormData } = myAccountSlice.actions;

export default myAccountSlice.reducer;
