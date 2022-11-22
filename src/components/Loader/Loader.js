import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

const StyledSpinContainer = styled.div`
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Loader = () => {
  return (
    <StyledSpinContainer>
      <Spin tip="Loading..." />
    </StyledSpinContainer>
  );
};

export default Loader;
