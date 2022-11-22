import { TreeSelect } from "antd";
import { useEffect, useState } from "react";
import "./FilterTreeGroupCustom.css";
import { setFilters } from "features/caseload/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { showLoader } from "features/common/commonSlice";

const FilterTreeGroup = ({ agencies }) => {
  const [value, setValue] = useState();
  const caseloadFilters = useSelector(
    (state) => state.caseloadFilters.filterObj
  );
  const dispatch = useDispatch();

  const treeData = agencies?.map(({ id, parentAgencyId, name }) => ({
    id,
    pId: parentAgencyId,
    value: name,
    title: name,
  }));

  const onSelect = (value) => {
    dispatch(showLoader(true));
    const selectedId = agencies.filter((obj) => (obj.name === value && obj));
    let filters =
      caseloadFilters &&
      caseloadFilters["agencyId"] &&
      Object.values(caseloadFilters["agencyId"]);

    if (filters?.includes(selectedId[0].id)) {
      filters = filters.filter((val) => (val !== selectedId[0].id && val));
    } else {
      if (filters) {
        filters.push(selectedId[0].id);
      } else {
        filters = [selectedId[0].id];
      }
    }

    let filtersList = filters;

    agencies?.map((agency) => {
      filtersList.map((item) => {
        // console.log('nested loop', agency.parentAgencyId, item);
          if(agency.parentAgencyId && agency.parentAgencyId === item){
            filters.push(agency.id);
          }
      })
    });
    dispatch(setFilters({ ...caseloadFilters, agencyId: filters }));
  };

  const onChange = (value) => {
    dispatch(showLoader(true));
    setValue(value);
    let agencyFilters = [];
   
    agencies?.map((agency) => {
      if (
        (value && value?.includes(agency?.name)) &&
        caseloadFilters &&
        caseloadFilters["agencyId"] &&
        caseloadFilters["agencyId"].includes(agency?.id)
      ) {
        agencyFilters.push(agency.id);
      }
    });
    dispatch(setFilters({ ...caseloadFilters, agencyId: agencyFilters }));
  };

  useEffect(() => {
    if(caseloadFilters &&
      caseloadFilters["agencyId"] && caseloadFilters["agencyId"].length === 0){
      setValue([]);
    }
  }, []);

  return (
    <TreeSelect
      multiple={true}
      style={{ width: "100%" }}
      placeholder="Select Agency"
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      value={value}
      treeDataSimpleMode
      treeCheckable
      showSearch
      allowClear
      onChange={onChange}
      onSelect={onSelect}
      showArrow
      treeData={treeData}
    />
  );
};

export default FilterTreeGroup;
