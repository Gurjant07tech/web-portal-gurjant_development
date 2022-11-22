import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "caseloadFilters",
  initialState: {
    participantType: null,
    eventTypeId: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filterObj = action.payload;
    },
  },
});

export const { setFilters } = filterSlice.actions;

export default filterSlice.reducer;
