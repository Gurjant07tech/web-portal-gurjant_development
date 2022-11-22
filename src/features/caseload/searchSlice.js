import { createSlice } from "@reduxjs/toolkit";

export const SearchDataSlice = createSlice({
  name: "searchData",
  initialState: {},
  reducers: {
    setTopSearchQueryValue: (state, action) => {
      state.topSearchQueryValue = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchDataObj = action.payload;
    },
  },
});

export const { setSearchData, setTopSearchQueryValue } =
  SearchDataSlice.actions;

export default SearchDataSlice.reducer;
