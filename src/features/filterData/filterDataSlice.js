import { createSlice } from "@reduxjs/toolkit";

export const filterDataSlice = createSlice({
  name: "filterData",
  initialState: {},
  reducers: {
    setFiltersData: (state, action) => {
      state.filterDataObj = action.payload;
    },
  },
});

export const { setFiltersData } = filterDataSlice.actions;

export default filterDataSlice.reducer;
