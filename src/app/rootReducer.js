import { combineReducers } from "redux";
import loginReducer from "features/login/loginSlice";
import errorReducer from "features/error/errorSlice";
import commonReducer from "features/common/commonSlice";
import myAccountReducer from "features/myAccount/myAccountSlice";
import enrollParticipantReducer from "features/enrollParticipant/enrollParticipantSlice";
import formDataReducer from "features/formData/formDataSlice";
import filterReducer from "features/caseload/filterSlice";
import filterDataReducer from "features/filterData/filterDataSlice";
import pinnedNotesReducer from "features/caseload/pinnedNotesSlice";
import caseLoadDataReducer from "features/caseload/caseLoadDataSlice";
import SearchDataReducer from "features/caseload/searchSlice";
import enrollWizardReducer from "features/enrollWizard/enrollWizardSlice";
import participantProfileDataReducer from "features/caseload/participantProfileDataslice";
import websiteLoadDataReducer from "features/agency/websiteUserSlice";

export default combineReducers({
  /**Add more reducers here*/
  login: loginReducer,
  error: errorReducer,
  common: commonReducer,
  myAccount: myAccountReducer,
  enrollParticipant: enrollParticipantReducer,
  formData: formDataReducer,
  caseloadFilters: filterReducer,
  filterData: filterDataReducer,
  pinnedNotes: pinnedNotesReducer,
  caseloadData: caseLoadDataReducer,
  searchData: SearchDataReducer,
  enrollWizardData: enrollWizardReducer,
  participantProfileData: participantProfileDataReducer,
  websiteUserData: websiteLoadDataReducer
});
