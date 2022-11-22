import CountryPhoneInput, { ConfigProvider } from "antd-country-phone-input";
import en from "world_countries_lists/data/en/world.json";

// Usually you only need to import ConfigProvider & CSS once in App.js/App.tsx
// CSS order is important!
// import "antd/dist/antd.css";
import "antd-country-phone-input/dist/index.css";
import 'antd/dist/antd.css';
import 'antd-country-phone-input/dist/index.css';
import styled from "styled-components";
import styleConstants from "theme/styleConstants";
import { useDispatch, useSelector } from "react-redux";
import { saveEnrollParticipantFormData } from "features/enrollParticipant/enrollParticipantSlice";
import { useEffect, useState } from "react";

const StyledInputPhone = styled.div`
  width: ${({ inputwidth }) => inputwidth || styleConstants.FORM_INPUT_WIDTH};
  .ant-input-prefix {
    height: 15px;
    margin-right: 0;
  }
`;

const InputPhone = ({ mobilePhone, inputWidth, countryCode, style }) => {
  const dispatch = useDispatch();
  const { enrollParticipantFormData } = useSelector(
    (state) => state.enrollParticipant
  );

  const [value, setValue] = useState({ short: 'US', phone: mobilePhone, code: 1 });

  useEffect(() => {
  setValue({short : 'US', phone: mobilePhone, code: 1});
  }, [mobilePhone])

  return (
    <ConfigProvider locale={en}>
      <StyledInputPhone inputwidth={inputWidth}>
        <CountryPhoneInput
        style={style}
          value={value}
          onChange={(value) => {
            dispatch(
            saveEnrollParticipantFormData({
              ...enrollParticipantFormData,
              'mobilephone': value.phone,
              'mobileCountryCode': value.code,
            })
          );
          setValue(value);
        }}
        />
      </StyledInputPhone>
    </ConfigProvider>
  );
};

export default InputPhone;
