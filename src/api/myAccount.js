import apiHandler from "api";
import endpoint from "./endpoint";

export const postWebsiteUserData = async (userData, authToken, dispatch) => {
  userData = {
    firstName: "Jon",
    middleName: null,
    lastName: "Rogoff",
    timeZone: "US/Central",
    email: "jon@test.com",
    notifyViaEmail: false,
    notifyViaMobilePhoneText: true,
    notifyViaAltPhoneText: false,
    sendDailyReports: false,
    id: 4,
    websiteUserType: {
      id: 5,
      name: "Super User",
    },
    status: "ACTIVE",
    isPhotoValidator: false,
    agencies: [],
    mobilePhone: "(773)-699-7769",
    altPhone: null,
  };

  await apiHandler({
    url: endpoint.USER,
    method: "POST",
    data: userData,
    authToken,
  });
};
