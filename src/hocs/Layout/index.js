import { useState } from "react";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import SideDrawer from "../../components/SideMenu/SideDrawer";
import { StyledDivider } from "containers/EnrollParticipant/EnrollParticipant.styles";

const Layout = ({ children }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  return (
    <>
      <Header drawerToggleClickHandler={() => drawerToggleClickHandler()} />
      <StyledDivider />
      <SideDrawer
        closeSideDrawer={() => drawerToggleClickHandler()}
        show={sideDrawerOpen}
      />
      {children}
      <StyledDivider />
      <Footer />
    </>
  );
};

export default Layout;
