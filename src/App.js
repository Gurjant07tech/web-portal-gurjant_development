import { useEffect } from "react";
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import Caseload from "./containers/Caseload/Caseload";
import Admin from "./containers/Admin/Admin";
import AddParticipant from "containers/EnrollParticipant/EnrollParticipant";
import MyAccount from "containers/MyAccount/MyAccount";
import Login from "containers/Login/Login";
import ProtectedRoute from "hocs/ProtectedRoute/ProtectedRoute";
import Agency from "containers/Agency/Agency";

function App() {


  useEffect(() => {
    // setAgenciesDropDown(authToken, dispatch);
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/login" render={(props) => <Login {...props} />} />
        <ProtectedRoute exact path="/caseload" component={Caseload} />
        <ProtectedRoute exact path="/agency" component={Agency} />
        <ProtectedRoute exact path="/admin" component={Admin} />
        <ProtectedRoute exact path="/add-participant" component={AddParticipant} />
        <ProtectedRoute exact path="/my-account" component={MyAccount} />
        <Route
          path="/*"
          render={(props) => (
            <Redirect {...props} to={{ pathname: "/login" }} />
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
