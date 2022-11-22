import { createSlice } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: "error",
  initialState: {
    loginFailed: null,
    nameFieldError: null,
  },
  reducers: {
    setError: (state, action) => {
      state.errorObj = action.payload;
    },
  },
});

export const { setError } = errorSlice.actions;

export default errorSlice.reducer;
