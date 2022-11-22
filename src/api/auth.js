import apiHandler from "api";
import { setError } from "features/error/errorSlice";
import { saveAuthToken, saveUserData } from "features/login/loginSlice";
import endpoint from "./endpoint";

const authenticateUser = {
  async authenticate(authToken, dispatch) {
    const result = await apiHandler({ url: endpoint.USER, authToken });
    const { data: userData } = result;
    if (!userData) {
      dispatch(setError({ loginFailed: true }));
    } else {
      dispatch(setError({ loginFailed: false }));
      dispatch(saveAuthToken(authToken));
      dispatch(saveUserData(userData));
    }
  },
  signout(dispatch, history) {
    dispatch(saveAuthToken(null));
    history.push("/login");
  },
};

export default authenticateUser;
