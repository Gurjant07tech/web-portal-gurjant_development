import { Checkbox } from "antd";
import { setFilters } from "features/caseload/filterSlice";
import { showLoader } from "features/common/commonSlice";
import { useDispatch, useSelector } from "react-redux";

const FilterCheckBoxGroup = ({ checkboxData, name }) => {
  const caseloadFilters = useSelector(
    (state) => state.caseloadFilters.filterObj
  );
  const dispatch = useDispatch();

  const setFilter = (e) => {
    dispatch(showLoader(true));
    const { value } = e.target;
    let filters =
      caseloadFilters &&
      caseloadFilters[name] &&
      Object.values(caseloadFilters[name]);
    if (filters?.includes(value)) {
      filters = filters.filter((val) => {
        return (val !== value) && val;
        })
      }
    else {
      if (filters) {
        filters.push(value);
      } else {
        filters = [value];
      }
    }
    dispatch(setFilters({ ...caseloadFilters, [name]: filters }));
  };
  
  return (
    <>
      {checkboxData?.map(({ value, label }, index) => (
        <>
          <Checkbox
            onChange={(e) => setFilter(e)}
            checked={
              caseloadFilters &&
              caseloadFilters[name] &&
              caseloadFilters[name].includes(value)
            }
            key={label}
            value={value}
          >
            {label}
          </Checkbox>
          <br />
        </>
      ))}
    </>
  );
};

export default FilterCheckBoxGroup;
