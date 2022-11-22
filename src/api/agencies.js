import apiHandler from "api";
import { setAgencies } from "features/common/commonSlice";
import endpoint from "./endpoint";

export const setAgenciesDropDown = async (authToken, dispatch) => {
  const result = await apiHandler({ url: endpoint.AGENCIES, authToken });
  dispatch(setAgencies(result.data));
};
