import apiHandler from "api";
import {
  setButtonLoading,
  setDrawerErrorMessage,
  setEnrollParticipantData,
} from "features/common/commonSlice";
import { setWizardErrorObj } from "features/enrollWizard/enrollWizardSlice";
import endpoint from "./endpoint";

export const EnrollParticipant = async (
  participantData,
  authToken,
  dispatch,
  setCurrentWizardStep,
  currentWizardStep
) => {
  dispatch(setButtonLoading(true));
  let wizardErrorObj = {};

  const requiredValues = [
    "firstname",
    "lastname",
    "agency",
    "participanttype",
    "offense",
    "birthdate",
    "mobilephone",
  ];

  let errorCount = 0;

  const {
    firstname: firstName,
    lastname: lastName,
    middlename: middleName,
    mobilephone: mobilePhone,
    agency: agencyId,
    participanttype: participantType,
    timezone: timeZone,
    aka,
    offense,
    email,
    casenumber: caseNumber,
    driverslicense: driversLicense,
    address: address1,
    apartment: address2,
    city,
    state,
    zip,
    occupation,
    birthdate: birthDate,
    gender,
    height,
    weight,
    eyecolor: eyeColor,
    haircolor: hairColor,
    ethnicity,
    id,
  } = participantData;

  requiredValues.map((index) => {
    if (!participantData[index]) {
      errorCount++;
      wizardErrorObj[index] = "This is required field";
    } else {
      if (errorCount > 0) {
        errorCount--;
        delete wizardErrorObj[index];
      }
    }

    if (index === "mobilephone") {
      if (!participantData["mobilephone"]) {
        errorCount++;
        wizardErrorObj["mobilephone"] = "This is required field";
      } else {
        if (
          participantData["mobilephone"] &&
          (participantData["mobilephone"].length > 10 ||
            participantData["mobilephone"].length < 10)
        ) {
          wizardErrorObj["mobilephone"] = "Mobile Phone is invalid";
          errorCount++;
        } else {
          if (errorCount > 0) {
            errorCount--;
            delete wizardErrorObj["mobilephone"];
          }
        }
      }
    }
  });

  if (Object.entries(wizardErrorObj).length > 0) {
    dispatch(setWizardErrorObj(wizardErrorObj));
    dispatch(setButtonLoading(false));
  } else {
    dispatch(setButtonLoading(true));
    await apiHandler({
      url: endpoint.ENROLL_PARTICIPANT,
      method: "POST",
      data: {
        firstName,
        middleName,
        lastName,
        mobilePhone,
        agency: { id: agencyId },
        timeZone,
        aka,
        offense,
        email,
        caseNumber,
        driversLicense,
        address: { address1, address2, city, state, zip },
        occupation,
        birthDate,
        gender,
        height : (height === 0 && null) || '',
        weight: (weight === 0 && null) || '',
        eyeColor,
        hairColor,
        ethnicity,
        participantType,
        id,
      },
      authToken,
    }).then((result) => {
      try {
        console.log('enroll api result', result.data);
        if (result?.data !== null && result?.data?.id) {
          // alert('success');
          dispatch(setEnrollParticipantData(result?.data));
          dispatch(setCurrentWizardStep(currentWizardStep + 1));
          dispatch(setDrawerErrorMessage());
        } else {
          if (result?.data?.message) {
            // dispatch(setDrawerErrorMessage(result?.data?.message));
            dispatch(setCurrentWizardStep(currentWizardStep + 1));
          } else {
            dispatch(setDrawerErrorMessage(result?.data));
          }
        }
        dispatch(setButtonLoading(false));
      } catch (error) {
        dispatch(setButtonLoading(false));
        // console.log('error message', error);
        dispatch(setDrawerErrorMessage(error));
      }
    });
  }
};
