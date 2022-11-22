import { createSlice } from "@reduxjs/toolkit";

export const editLoadDataSlice = createSlice({
  name: "editUserData",
  initialState: {},
  reducers: {
    seteditUserData: (state, action) => {
      state.editDataObj = action.payload;
    },
  },
});

export const { seteditUserData } = editLoadDataSlice.actions;

export default editLoadDataSlice.reducer;
