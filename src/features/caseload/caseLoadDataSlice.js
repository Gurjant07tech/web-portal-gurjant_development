import { createSlice } from "@reduxjs/toolkit";

export const caseLoadDataSlice = createSlice({
  name: "caseloadData",
  initialState: {},
  reducers: {
    setCaseloadData: (state, action) => {
      state.caseloadDataObj = action.payload;
    },
  },
});

export const { setCaseloadData } = caseLoadDataSlice.actions;

export default caseLoadDataSlice.reducer;
