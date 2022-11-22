import React from "react";
import { Select, Form } from "antd";
import { StyledSelect } from "../SelectAntd/SelectAntd";

import { saveEnrollParticipantFormData } from "features/enrollParticipant/enrollParticipantSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const SelectSearchAntd = ({
  label,
  optionsArr,
  placeholder,
  defaultValue,
  width,
}) => {
  const dispatch = useDispatch();

  const fieldName = label && label.replace(/\s+/g, "").replace('*', '').toLowerCase();

  const { enrollParticipantFormData } = useSelector(
    (state) => state.enrollParticipant
  );

  function onChange(value) {
    dispatch(
      saveEnrollParticipantFormData({
        ...enrollParticipantFormData,
        [fieldName]: value,
      })
    );
  }

  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  return (
    <Form.Item
      name={label.replace(/\s+/g, "").replace('*', '').toLowerCase()}
      label={label}
      rules={[{ required: true }]}
      initialValue={defaultValue}
    >
      <StyledSelect
        showSearch
        width={width}
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {optionsArr.map((option) => (
          <Option value={option}>{option}</Option>
        ))}
      </StyledSelect>
    </Form.Item>
  );
};

export default SelectSearchAntd;
