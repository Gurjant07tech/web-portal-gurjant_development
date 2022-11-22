import { Col } from "antd";
import styled from "styled-components";

export const StyledColLeft = styled(Col)`
  padding: 0 20px;
  padding-bottom: 4rem;

  h2 {
    color: #fff;
    margin-top: 1rem;
  }
`;

export const StyledColRight = styled(Col)`
  //   background: rgb(247, 247, 247);
  padding: 1rem 2rem;
`;

export const StyledHeading = styled.div`
  color: #2f2e2e;
  font-size: 27px;
`;

export const StyledSpan = styled.span`
  color: #ff4040;
`;

export const StyledNotificationText = styled.p`
  font-size: 16px;
  color: rgb(34, 93, 165);
  cursor: pointer;
`;

export const StyledH2 = styled.h2`
  margin-top: 4rem;
  margin-bottom: 2rem;
`;

export const StyleClosableItemList = styled.ul`
  list-style: none;
  padding-inline-start: 0;
`;

export const StyleClosableItem = styled.li`
  float: left;
  display: inline-block;
  padding: 20px 10px;
  background: #f0f0f0;
  border: 1px solid #e5e5e5;
  margin: 0 10px 40px 0px;
  font-family: Aileron-Regular;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
`;
