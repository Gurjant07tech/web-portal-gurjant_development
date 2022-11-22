import { useEffect, useState } from "react";
import { StyledFilterHeading } from "./Filters.styles";
import { Collapse } from "antd";
import FilterRadioGroup from "components/FilterRadioGroup/FilterRadioGroup";
import "./FiltersCustom.css";
import FilterCheckBoxGroup from "components/FilterCheckBoxGroup/FilterCheckBoxGroup";
import FilterTreeGroup from "components/FilterTreeGroup/FilterTreeGroup";
import { useDispatch, useSelector } from "react-redux";
import { setFiltersData } from "features/filterData/filterDataSlice";
import apiHandler from "api";
import endpoint from "api/endpoint";
import { useLocation } from 'react-router-dom'

const { Panel } = Collapse;

const Filters = () => {
  const agencies = useSelector((state) => state.common.agencies);
  const { authToken } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [eventTypeIds, setEventTypeIds] = useState([]);

  const status = [
    { name: "All", value: "all", filterType: "status" },
    { name: "Active", value: "active", filterType: "status" },
    { name: "Inactive", value: "inactive", filterType: "status" },
  ];

  const solution = [
    { name: "All", value: "all", filterType: "solution" },
    { name: "TRAC Watch", value: "cam+", filterType: "solution" },
    { name: "GPS", value: "gps", filterType: "solution" },
    { name: "TRAC Breath", value: "breathalyzer", filterType: "solution" },
  ];

  useEffect(() => {
    apiHandler({
      url: `${endpoint.AVAILABLE_EVENT_TYPES}`,
      authToken,
    }).then((result) => {
      const { data } = result;
      setEventTypeIds(
        data.map((event) => {
          return {
            label: event.name,
            value: event.id,
            filterType: "eventTypeId",
          };
        })
      );
    });
    // apiHandler({
    //   url: `${endpoint.AVAILABLE_PROGRAM_TYPES}`,
    //   authToken,
    // }).then((result) => {
    //   setProgramTypes(result.data);
    // });
  }, []);

  const participantType = [
    { label: "Unspecified", value: 1, filterType: "participantType" },
    {
      label: "Condition of Bond",
      value: 2,
      filterType: "participantType",
    },
    {
      label: "Conditional Discharge",
      value: 3,
      filterType: "participantType",
    },
    {
      label: "Count Supervision",
      value: 4,
      filterType: "participantType",
    },
    { label: "Demo", value: 5, filterType: "participantType" },
    { label: "Diversion", value: 6, filterType: "participantType" },
    { label: "Parole", value: 7, filterType: "participantType" },
    { label: "Pre-Trial", value: 8, filterType: "participantType" },
    { label: "Probation", value: 9, filterType: "participantType" },
    { label: "Volunteer", value: 10, filterType: "participantType" },
  ];

  useEffect(() => {
    dispatch(
      setFiltersData({
        status,
        solution,
        eventTypeId: eventTypeIds,
        participantType,
        agencyId: agencies,
      })
    );
  }, [eventTypeIds]);

  // const handleCheckboxChange = (position) => {
  //   dispatch(showLoader(true));
  //   const updatedCheckedState = [
  //     { value: 0 },
  //     { value: 1 },
  //     { value: 2 },
  //     { value: 3 },
  //     { value: 4 },
  //     { value: 5 },
  //   ].map((item, index) => {
  //     if (position === index) {
  //       return {
  //         ...item,
  //         selected: !checkedState[index].selected,
  //       };
  //     } else return item;
  //   });
  //   setCheckedState(updatedCheckedState);
  // };
  const location = useLocation();

  return (
    <div className="filterSidebar">
      <StyledFilterHeading>Filter by</StyledFilterHeading>
      <Collapse defaultActiveKey={["1", "2", "3", "4", "5"]}>
        <Panel className="agencyFilters" header="Agency" key="1">
          <FilterTreeGroup agencies={agencies} />
        </Panel>

        { location.pathname !== "/agency" && (
          <Panel header="Status" key="2">
            <FilterRadioGroup
              defaultValue="active"
              name="status"
              radioData={status}
            />
          </Panel>
        )}
        {/* <Panel header="Solution" key="3">
          <FilterRadioGroup
            defaultValue="all"
            name="solution"
            radioData={solution}
          />
        </Panel> */}
        { location.pathname !== "/agency" && (
          <Panel header="Unresolved Event" key="4">
            <FilterCheckBoxGroup name="eventTypeId" checkboxData={eventTypeIds} />
          </Panel>
        )}
        {/* <Panel header="Participation Type" key="5">
          <FilterCheckBoxGroup
            name="participantType"
            checkboxData={participantType}
          />
        </Panel> */}
      </Collapse>
    </div>
  );
};

export default Filters;
