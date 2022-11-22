import { Col, Row } from "antd";
import styled from "styled-components";

const StyledFooterContainer = styled.footer`
  padding: 24px 30px;
  color: #000;
  background: #fff;

  h2 {
    color: #000;
    font-family: Aileron-Regular;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
  }

  p {
    color: #000;
    font-family: Aileron-Bold;
    font-size: 16px;
    line-height: 18px;
  }
`;

const Footer = () => {
  return (
    <StyledFooterContainer>
      <Row>
        <Col md={6} xs={24}>
          <h2>© TRAC Solutions 2022</h2>
          <h2>30 S Wacker Dr Chicago IL 60606</h2>
        </Col>
        <Col md={6} offset={12} xs={24} style={{textAlign : 'right'}}>
          <p>info@tracmonitor.com</p>
          <p>(800) 977-3152</p>
        </Col>
      </Row>
    </StyledFooterContainer>
  );
};

export default Footer;
