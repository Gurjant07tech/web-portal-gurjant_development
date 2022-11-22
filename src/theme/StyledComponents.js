import styled from "styled-components";
import { Modal } from "antd";

export const StyledAppContainer = styled.div`
  max-width: ${({ maxWidth }) => maxWidth || "1024px"};
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  ${({ externalCss }) => externalCss}
`;

export const StyledFullNameContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledFullNameSpan = styled.span`
  margin-top: 5px;
`;

export const StyledButton = styled.button`
  background: #0557a2;
  border-radius: 6px;
  color: #fff;
  box-shadow: none;
  border: none;
  cursor: pointer;
  ${({ externalCss }) => externalCss}
`;

export const StyledButtonLink = styled.a`
  text-align: center;
  background: #0557a2;
  border-radius: 6px;
  color: #fff;
  box-shadow: none;
  border: none;
  ${({ externalCss }) => externalCss}

  &:hover {
    color: #fff;
  }
`;

export const StyledModal = styled(Modal)`
  border-radius: 10px;
`;