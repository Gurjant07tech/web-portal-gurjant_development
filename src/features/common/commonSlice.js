import { createSlice } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "common",
  initialState: { agencies: [] },
  reducers: {
    setAgencies: (state, action) => {
      state.agencies = action.payload;
    },
    showLoader: (state, action) => {
      state.showLoader = action.payload;
    },
    showEnrollParticipant: (state, action) => {
      state.showEnrollParticipant = action.payload;
    },
    setEnrollParticipantData: (state, action) => {
      state.enrollParticipantData = action.payload;
    },
    setEditParticipantProfile: (state, action) => {
      state.editParticipantProfile = action.payload;
    },
    showHistoryDrawer: (state, action) => {
      state.showHistoryDrawer = action.payload;
    },
    showMessageDrawer: (state, action) => {
      state.showMessageDrawer = action.payload;
    },
    setActiveParticipant: (state, action) => {
      state.activeParticipantId = action.payload;
    },
    setActiveHistoryTab: (state, action) => {
      state.activeHistoryTab = action.payload;
    },
    setDrawerErrorMessage: (state,action) => {
      state.drawerErrorMessage = action.payload;
    },
    setSelectedEvents: (state, action) => {
      state.selectedEvents = action.payload
    },
    setHistoryStartDate: (state, action) => {
      state.historyStartDate = action.payload
    }, 
    setAssignedDevices: (state, action) => {
      state.assignedDevices = action.payload
    },
    setButtonLoading: (state, action) => {
      state.buttonLoading = action.payload
    }
  },
});

export const {
  setAgencies,
  showLoader,
  showEnrollParticipant,
  setEditParticipantProfile,
  setEnrollParticipantData,
  setActiveParticipant,
  showHistoryDrawer,
  showMessageDrawer,
  setActiveHistoryTab,
  setDrawerErrorMessage,
  setSelectedEvents,
  setAssignedDevices,
  setHistoryStartDate,
  setButtonLoading
} = commonSlice.actions;

export default commonSlice.reducer;
