import React from "react";
import "./SideDrawer.css";
import { css } from "styled-components";
import { StyledButtonLink } from "theme/StyledComponents";
import { Link } from "react-router-dom";
import Logo from "assets/logo.png";


const sideDrawer = (props) => {
  let drawerClasses = ["side-drawer"];

  if (props.show) {
    drawerClasses = ["side-drawer", "open"];
  }

  const closeDrawer = () => {
    props.closeSideDrawer();
  };
  return (
    <>
      <nav className={drawerClasses.join(" ")}>
        <button
          className="toggle-button mt-2 ml-3"
          onClick={() => closeDrawer()}
        >
          <div className="toggle-button-line cross button-line-1" />
          <div className="toggle-button-line cross button-line-2" />
          <div className="toggle-button-line cross button-line-3" />
        </button>
        <ul>
          <li>
            <Link to="/caseload">
              <img alt="Shop Life Logo" src={Logo} />
            </Link>
          </li>
          <li>
            <a href="/caseload">Caseload</a>
          </li>
          <li>
            <a href="/admin">Admin</a>
          </li>
          <li>
            <a href="/my-account">My Account</a>
          </li>
          <li>
            <StyledButtonLink
              to="/add-participant"
              externalCss={css`
                padding: 5px;
                min-width: 200px;
                font-family: Aileron-SemiBold;
                font-weight: 600;
                box-shadow: none;
                border: none;

                @media (max-width: 768px) {
                  color: #fff !important;
                  padding: 5px 10px;
                }
              `}
              href="/add-participant"
              type="primary"
              size="large"
            >
              Enroll Participant
            </StyledButtonLink>
          </li>
        </ul>
      </nav>
    </>
  );
};
export default sideDrawer;
