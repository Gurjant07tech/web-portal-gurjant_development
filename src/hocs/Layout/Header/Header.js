import { Link } from "react-router-dom";
import { css } from "styled-components";
import SideMenu from "components/SideMenu/SideMenu";
import Logo from "assets/logo.png";
import "./header.css";
import { StyledButtonLink } from "theme/StyledComponents";
import { setEditParticipantProfile, setEnrollParticipantData, showEnrollParticipant } from "features/common/commonSlice";
import { useDispatch } from "react-redux";
import { setWizardStep } from "features/enrollWizard/enrollWizardSlice";
import { saveEnrollParticipantFormData } from "features/enrollParticipant/enrollParticipantSlice";
import { setParticipantProfileData } from "features/caseload/participantProfileDataslice";

const Header = (props) => {
  const dispatch = useDispatch();

  const enrollParticipant = () => {
    dispatch(showEnrollParticipant(true));
    dispatch(setEditParticipantProfile(false));
    dispatch(setEnrollParticipantData([]));
    dispatch(saveEnrollParticipantFormData([]));
    dispatch(setParticipantProfileData([]));
    dispatch(setWizardStep(0));
  };

  return (
    <div className="container">
      <header className="toolbar">
        <nav className="toolbar_navigator">
          <div />
          <div className="toggle-btn">
            <SideMenu click={props.drawerToggleClickHandler} />
          </div>
          <div className="toolbar_logo">
            <Link to="/caseload">
              <img alt="Shop Life Logo" src={Logo} />
            </Link>
          </div>
          <div className="toolbar_navigation-items">
            <ul>
              <li>
                <Link to="/caseload">Caseload</Link>
              </li>
              <li>
                <Link to="/agency">Agency</Link>
              </li>
              {/* <li>
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/my-account">My Account</Link>
              </li> */}
              {/* <img
                style={{ marginLeft: 20, cursor: "pointer" }}
                width="40"
                src={LogoutIcon}
                alt="Logout"
                onClick={() => authenticateUser.signout(dispatch, history)}
              /> */}
            </ul>
          </div>
          <StyledButtonLink
            externalCss={css`
              padding: 5px;
              min-width: 200px;
              font-family: Aileron-SemiBold;
              font-weight: 600;
              box-shadow: none;
              border: none;

              @media (max-width: 768px) {
                display: none;
              }
            `}
            type="primary"
            size="large"
            onClick={enrollParticipant}
          >
            Enroll Participant
          </StyledButtonLink>
        </nav>
      </header>
    </div>
  );
};

export default Header;
