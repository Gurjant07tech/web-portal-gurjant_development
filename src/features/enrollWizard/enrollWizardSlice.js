import { createSlice } from "@reduxjs/toolkit";

export const enrollWizardSlice = createSlice({
  name: "enrollWizard",
  initialState: {},
  reducers: {
    setWizardStep: (state, action) => {
      state.currentWizardStep = action.payload;
    },
    setStepOneComplete: (state, action) => {
      state.setStepOneComplete = action.payload
    },
    setWizardErrorObj: (state, action) => {
      state.wizardErrorObj = action.payload
    },
    saveProgramData: (state, action) => {
      state.programData = action.payload
    }
  },
});

export const { setWizardStep, setStepOneComplete, setWizardErrorObj, saveProgramData } = enrollWizardSlice.actions;

export default enrollWizardSlice.reducer;
