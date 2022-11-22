import React from "react";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import DownloadIcon from 'assets/caseload/icon-wrapper.svg';

export const CSVButton = styled(CSVLink)`
  float: right;
  background: #0557a2;
  border: 1px solid #0557a2;
  box-sizing: border-box;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  border-radius: 2px;
  display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 5px 16px;
color: #fff;

&:hover{
    color : #fff;
}
`;

const DownloadTableButton = ({ csvData, headers }) => {
  return (
    <CSVButton className="btn btn-primary" data={csvData} headers={headers}>
      <img alt="download" src={DownloadIcon} height={12}/> &nbsp;&nbsp;Download
    </CSVButton>
  );
};

export default DownloadTableButton;
