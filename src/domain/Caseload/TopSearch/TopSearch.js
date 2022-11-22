import { Input, Select } from "antd";
import {
  setSearchData,
  setTopSearchQueryValue,
} from "features/caseload/searchSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./TopSearch.css";
const { Search } = Input;
const { Option } = Select;

const TopSearch = () => {
  const dispatch = useDispatch();
  let [searchPreset, setSearchPreset] = useState("All");

  const selectPreset = (value) => {
    setSearchPreset(value);
  };

  const suffix = (
    <Select
      defaultValue="All"
      onChange={selectPreset}
      className="select-before"
    >
      <Option value="All">All</Option>
      <Option value="fullName">Name</Option>
      <Option value="caseNumber">Case Number</Option>
      <Option value="mobilePhoneUnformatted">Phone Number</Option>
      <Option value="serialNumber">Serial Number</Option>
    </Select>
  );

  const caseloadData = useSelector(
    (state) => state.caseloadData.caseloadDataObj
  );

  const handleSearch = (searchQueryString) => {
    if (searchQueryString.length === 0) {
      dispatch(setTopSearchQueryValue(""));
    } else {
      dispatch(setTopSearchQueryValue(searchQueryString));
    }
    searchInCaseload(searchQueryString);
  };

  // const handleChange = (e) => {
  //   const { value } = e.target;
  //   if (value.length === 0) {
  //     dispatch(setTopSearchQueryValue(""));
  //   } else {
  //     dispatch(setTopSearchQueryValue(value));
  //   }
  //   searchInCaseload(value);
  // };

  const searchInCaseload = (searchQueryString) => {
    let searchResultsArr = [];

    searchResultsArr = caseloadData.filter((data) => {
      if (searchPreset === "All") {
        return Object.keys(data).some((newItem) => {
          return (
            data[newItem]?.toString().toLowerCase() ===
            searchQueryString.toLowerCase()
          );
        });
      } else {
        console.log("search preset", searchPreset);
        if (searchPreset === "fullName") {
          return (
            data["firstName"]?.toString().toLowerCase() ===
              searchQueryString.toLowerCase() ||
            data["lastName"]?.toString().toLowerCase() ===
              searchQueryString.toLowerCase()
          );
        } else {
          if(searchPreset === "serialNumber"){
            const assignedDevices = data['assignedDevices'];
            return assignedDevices.some( device => device['device']['serialNumber']?.toString().toLowerCase() ===  searchQueryString.toLowerCase())
          }
          else{
            return (
              data[searchPreset]?.toString().toLowerCase() ===
              searchQueryString.toLowerCase()
            );
          }
          
        }
      }
    });

    dispatch(setSearchData(searchResultsArr));
  };

  return (
    <div className="topSearch">
      <Search
        // value={topSearchQueryValue}
        placeholder="Search"
        suffix={suffix}
        onSearch={handleSearch}
        // onChange={handleChange}
        enterButton
      />
    </div>
  );
};

export default TopSearch;
