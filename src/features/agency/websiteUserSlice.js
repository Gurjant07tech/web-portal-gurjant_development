import { createSlice } from "@reduxjs/toolkit";

export const websiteLoadDataSlice = createSlice({
  name: "websiteUserData",
  initialState: {},
  reducers: {
    setWebsiteUserData: (state, action) => {
      state.websiteDataObj = action.payload;
    },
  },
});

export const { setWebsiteUserData } = websiteLoadDataSlice.actions;

export default websiteLoadDataSlice.reducer;
