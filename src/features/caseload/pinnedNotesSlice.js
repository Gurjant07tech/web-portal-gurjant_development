import { createSlice } from "@reduxjs/toolkit";

export const pinnedNotesSlice = createSlice({
  name: "pinnedNotes",
  initialState: {},
  reducers: {
    setPinnedNotesData: (state, action) => {
      state.pinnedNotesObj = action.payload;
    },
  },
});

export const { setPinnedNotesData } = pinnedNotesSlice.actions;

export default pinnedNotesSlice.reducer;
