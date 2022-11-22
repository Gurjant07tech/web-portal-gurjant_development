import { createSlice } from "@reduxjs/toolkit";

export const formDataSlice = createSlice({
  name: "formData",
  initialState: { formDataObj: {}, formValidationErrors: {} },
  reducers: {
    saveFormData: (state, action) => {
      state.formDataObj = action.payload;
    },
    setFormValidationErrors: (state, action) => {
      state.formValidationErrors = action.payload;
    },
  },
});

export const { saveFormData, setFormValidationErrors } = formDataSlice.actions;

export default formDataSlice.reducer;
