import Layout from "hocs/Layout";
import { useSelector } from "react-redux";
import { Route, Redirect, useLocation } from "react-router-dom";

function ProtectedRoute({ component: Component, ...rest }) {
  const loginData = useSelector((state) => state.login);
  const { pathname: lastRouteVisited } = useLocation();

  return (
    <Route
      {...rest}
      render={() => {
        return loginData?.authToken ? (
          <Layout>
            <Component />
          </Layout>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: lastRouteVisited,
            }}
          />
        );
      }}
    />
  );
}

export default ProtectedRoute;
