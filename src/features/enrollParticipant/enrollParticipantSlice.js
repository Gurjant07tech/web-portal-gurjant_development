import { createSlice } from "@reduxjs/toolkit";

export const enrollParticipantSlice = createSlice({
  name: "enrollParticipant",
  initialState: {
    enrollParticipantFormData: {},
  },
  reducers: {
    saveEnrollParticipantFormData: (state, action) => {
      state.enrollParticipantFormData = action.payload;
    },
  },
});

export const { saveEnrollParticipantFormData } = enrollParticipantSlice.actions;

export default enrollParticipantSlice.reducer;
