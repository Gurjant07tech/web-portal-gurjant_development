import styled from "styled-components";
import { Input, Modal } from "antd";

export const StyledPinnedNotesBlock = styled.div`
  border: 1px solid #f0f0f0;
  margin: 10px 0px 20px 20px;
  border-radius: 5px;
`;

export const StyledInnerBlock = styled.div`
  border: 1px solid #f0f0f0;
  margin: 10px 20px;
  border-radius: 5px;
  max-height: 680px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: darkgrey;
  }

  ::-webkit-scrollbar-track {
    background: #e5e5e5;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    background-clip: padding-box;
  }
`;

export const StyledHeading = styled.h2`
  font-family: Aileron-Bold;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 36px;
  color: rgba(0, 0, 0, 0.85);
  padding: 0 10px;
  margin: 15px 0;
`;

export const StyledItem = styled.div`
  padding: 10px 20px;
  box-shadow: inset 0px -1px 0px #f0f0f0;
  font-family: Aileron-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.85);
  p {
    img {
      margin-right: 10px;
      cursor: pointer;
    }
  }
`;

export const StyledCreateNewLink = styled.div`
  margin: 15px;
  padding: 2px 6px;
  color: #0557a2;
  font-size: 14px;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
  border-radius: 2px;
  text-align: center;
`;

export const StyledPinnedNoteSpan = styled.span`
  margin-left: 15px;
  color: #c4c4c4;
  font-weight: 800;
  font-family: Aileron-Bold;
  cursor: pointer;
`;

export const StyledPinnedGreyText = styled.p`
  color: #c4c4c4;
  font-weight: 200;
`;

export const StyledModal = styled(Modal)`
  border-radius: 10px;
`;

export const StyledInputTextArea = styled(Input.TextArea)`
  min-height: 100px !important;
  margin-bottom: 5px;
`;

