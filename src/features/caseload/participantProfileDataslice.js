import { createSlice } from "@reduxjs/toolkit";

export const participantProfileDataSlice = createSlice({
  name: "participantProfileData",
  initialState: {},
  reducers: {
    setParticipantProfileData: (state, action) => {
      state.participantProfileData = action.payload;
    },
  },
});

export const { setParticipantProfileData } =
  participantProfileDataSlice.actions;

export default participantProfileDataSlice.reducer;
