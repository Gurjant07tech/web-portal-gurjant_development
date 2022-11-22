import { Radio, Space } from "antd";
import { useState } from "react";
import { setFilters } from "features/caseload/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { showLoader } from "features/common/commonSlice";

const FilterRadioGroup = ({ radioData, name, defaultValue }) => {
  const [value, setValue] = useState(1);
  const caseloadFilters = useSelector(
    (state) => state.caseloadFilters.filterObj
  );
  const dispatch = useDispatch();

  const onChange = (e) => {
    const { value } = e.target;
    dispatch(setFilters({ ...caseloadFilters, [name]: [value] }));
    dispatch(showLoader(true));
    setValue(value);
  };

  return (
    <Radio.Group
      onChange={onChange}
      defaultValue={defaultValue}
      value={
        name === 'status' ? caseloadFilters && caseloadFilters[name] && caseloadFilters[name][0] ? caseloadFilters[name][0] : 'active' :  caseloadFilters && caseloadFilters[name] && caseloadFilters[name][0]
      }
    >
      <Space direction="vertical">
        {radioData.map(({ value, name }, index) => {
          return <Radio value={value} key={index}>{name}</Radio>;
        })}
      </Space>
    </Radio.Group>
  );
};

export default FilterRadioGroup;
