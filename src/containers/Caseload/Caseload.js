import { Button, Drawer, Row, Space, Spin, notification } from "antd";
import apiHandler from "api";
import endpoint from "api/endpoint";
import CaseloadTabs from "domain/Caseload/CaseloadTabs/CaseloadTabs";
import TopSearch from "domain/Caseload/TopSearch/TopSearch";
import WizardProgressBar from "domain/EnrollParticipantWizard/WizardProgressBar";
import WizardStepContent from "domain/EnrollParticipantWizard/WizardStepContent";
import Filters from "domain/Filters/Filters";
import { setCaseloadData } from "features/caseload/caseLoadDataSlice";
import { setFilters } from "features/caseload/filterSlice";
import { setTopSearchQueryValue } from "features/caseload/searchSlice";
import {
  setActiveParticipant,
  setButtonLoading,
  setDrawerErrorMessage,
  setEditParticipantProfile,
  setEnrollParticipantData,
  showEnrollParticipant,
  showLoader,
} from "features/common/commonSlice";
import {
  setWizardErrorObj,
  setWizardStep,
} from "features/enrollWizard/enrollWizardSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  StyleClosableItemList,
  StyledColLeft,
  StyledColRight,
  StyledHeading,
  StyleClosableItem,
} from "./Caseload.styles";
import { EnrollParticipant } from "../../api/enrollParticipant";
import HistoryDrawer from "domain/Caseload/History/HistoryDrawer";
import MessageDrawer from "domain/Caseload/SendMessage/MessageDrawer";
import { setParticipantProfileData } from "features/caseload/participantProfileDataslice";
import moment from "moment";
import { saveEnrollParticipantFormData } from "features/enrollParticipant/enrollParticipantSlice";

export const StyledSpace = styled(Space)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45vh;
  font-size: 20px;
  font-weight: bold;
`;

const Caseload = () => {
  const { authToken } = useSelector((state) => state.login);

  const filters = useSelector((state) => state.filterData.filterDataObj);

  const selectedFilters = useSelector(
    (state) => state.caseloadFilters.filterObj
  );

  const caseloadFilters = useSelector(
    (state) => state.caseloadFilters.filterObj
  );

  const { topSearchQueryValue } = useSelector((state) => state.searchData);

  const isLoading = useSelector((state) => state.common.showLoader);

  const dispatch = useDispatch();

  const [closableItems, setClosableItems] = useState([]);

  const enrollParticipantVisible = useSelector(
    (state) => state.common.showEnrollParticipant
  );

  const { enrollParticipantFormData } = useSelector(
    (state) => state.enrollParticipant
  );

  let currentStep = useSelector(
    (state) => state.enrollWizardData.currentWizardStep
  );

  const {
    activeParticipantId,
    enrollParticipantData,
    showMessageDrawer,
    showHistoryDrawer,
    assignedDevices,
    buttonLoading,
  } = useSelector((state) => state.common);

  let programData = useSelector((state) => state.enrollWizardData.programData);

  const [currentWizardStep, setCurrentWizardStep] = useState(currentStep);

  const postProgram = async (activate) => {
    dispatch(setButtonLoading(true));
    var tz = moment.tz.guess();
    var date = moment().minute(0).seconds(0).milliseconds(0).tz(tz);

    date = date.toISOString();
    date = date.replace(":00.000Z", "+0000Z");

    if (activate) {
      const programList = { ...programData, activationDate: date };
      await apiHandler({
        url:
          endpoint.ENROLL_PARTICIPANT +
          "/" +
          `${enrollParticipantData.id || activeParticipantId}` +
          "/program",
        method: "POST",
        data: {
          deactivationDate: date,
        },
        authToken: authToken,
      }).then(async (result) => {
        await apiHandler({
          url:
            endpoint.ENROLL_PARTICIPANT +
            "/" +
            `${enrollParticipantData.id || activeParticipantId}` +
            "/program",
          method: "POST",
          data: programList,
          authToken: authToken,
        }).then((result) => {
          dispatch(setEditParticipantProfile(false));
          dispatch(setParticipantProfileData([]));
          dispatch(setEnrollParticipantData([]));
          dispatch(saveEnrollParticipantFormData([]));
          dispatch(setDrawerErrorMessage());
          dispatch(setWizardErrorObj());
          dispatch(showEnrollParticipant(false));
          dispatch(setButtonLoading(false));
          notification.info({
            description: result.data.message,
            placement: "topRight",
            duration: 5,
          });
        });
      });
    } else {
      await apiHandler({
        url:
          endpoint.ENROLL_PARTICIPANT +
          "/" +
          `${enrollParticipantData.id || activeParticipantId}` +
          "/program",
        method: "POST",
        data: programData,
        authToken: authToken,
      }).then((result) => {
        dispatch(setEditParticipantProfile(false));
        dispatch(setParticipantProfileData([]));
        dispatch(setEnrollParticipantData([]));
        dispatch(saveEnrollParticipantFormData([]));
        dispatch(setDrawerErrorMessage());
        dispatch(setWizardErrorObj());
        dispatch(showEnrollParticipant(false));
        dispatch(setButtonLoading(false));
        notification.info({
          description: result.data.message,
          placement: "topRight",
          duration: 5,
        });
      });
    }
  };

  const onClose = () => {
    dispatch(showEnrollParticipant(false));
    dispatch(setEnrollParticipantData([]));
    dispatch(saveEnrollParticipantFormData([]));
    dispatch(setDrawerErrorMessage());
    dispatch(setButtonLoading(false));
  };

  const setFilter = (value, filterType) => {
    dispatch(showLoader(true));

    if (filterType === undefined) {
      filterType = "agencyId";
    }

    let filtersList = caseloadFilters;

    if (filterType === "search") {
      dispatch(setTopSearchQueryValue(""));
      let closeItems = closableItems.filter(
        (obj) => obj.filterType !== "search" && obj
      );
      setClosableItems(closeItems);
      dispatch(showLoader(false));
      return;
    }

    if (filtersList[filterType]?.includes(value)) {
      filtersList = filters[filterType]?.map((item) => {
        return (
          filtersList &&
          filtersList[filterType]?.filter(
            (val) => item.parentAgencyId !== val && val
          )
        );
      });
      filtersList =
        filtersList &&
        filtersList[filterType]?.filter((val) => val !== value && val);
      dispatch(setFilters({ ...caseloadFilters, [filterType]: filtersList }));
    }
  };

  const filterKeys = [
    "agencyId",
    "status",
    "solution",
    "eventTypeId",
    "participantType",
    "search",
  ];

  if (
    topSearchQueryValue !== "" &&
    topSearchQueryValue !== null &&
    topSearchQueryValue !== undefined
  ) {
    closableItems.push({
      value: topSearchQueryValue,
      label: topSearchQueryValue,
      filterType: "search",
    });
  }

  useEffect(() => {
    let queryParams = "?";
    filterKeys?.map((key) => {
      selectedFilters &&
        selectedFilters[key]?.map((filterObj) => {
          if (key !== "status") {
            queryParams += key + "=" + filterObj + "&";
          }
        });
    });

    apiHandler({
      url: `${endpoint.CASELOAD}/${
        (selectedFilters &&
          selectedFilters["status"] &&
          selectedFilters["status"][0]) ||
        "active"
      }${queryParams}`,
      authToken,
    }).then((result) => {
      dispatch(setCaseloadData(result?.data));
      // if (!activeParticipantId) {
      dispatch(setActiveParticipant(result?.data[0]?.id));
      // }
      dispatch(showLoader(false));
    });
    let closableItemsArr = [];
    filterKeys.map((key) => {
      return (
        filters &&
        filters[key]?.map(
          (filterObj) =>
            selectedFilters &&
            selectedFilters[key]?.filter((selectedFilterValue) => {
              if (
                selectedFilterValue === filterObj.value ||
                selectedFilterValue === filterObj.id
              ) {
                closableItemsArr = [...closableItemsArr, filterObj];
              }
            })
        )
      );
    });
    setClosableItems(closableItemsArr);
  }, [selectedFilters]);

  useEffect(() => {
    dispatch(setWizardStep(currentWizardStep));
  }, [currentWizardStep]);

  useEffect(() => {
    setCurrentWizardStep(currentStep);
  }, [currentStep]);

  return (
    <Row>
      <StyledColLeft md={4}>
        <Filters />
      </StyledColLeft>
      <StyledColRight md={20}>
        <StyledHeading>Caseload</StyledHeading>
        <hr />
        <TopSearch />
        <Row>
          <StyleClosableItemList>
            {closableItems
              .filter(
                (v, i, a) =>
                  a.findIndex(
                    (t) => t.label === v.label && t.value === v.value
                  ) === i
              )
              ?.map(({ value, label, name, filterType, id }) => {
                return (
                  <StyleClosableItem>
                    {label || name}{" "}
                    <span onClick={() => setFilter(value || id, filterType)}>
                      x
                    </span>
                  </StyleClosableItem>
                );
              })}
          </StyleClosableItemList>
        </Row>

        {isLoading ? (
          <StyledSpace>
            <Spin size={"large"} />
            Loading...
          </StyledSpace>
        ) : (
          activeParticipantId && <CaseloadTabs />
        )}

        <Drawer
          title="Enrollment Wizard"
          placement="right"
          size="large"
          destroyOnClose
          onClose={onClose}
          visible={enrollParticipantVisible}
        >
          <div className="container">
            <WizardProgressBar />
            <WizardStepContent currentWizardStep={currentWizardStep} />
          </div>
          {enrollParticipantVisible && (
            <div
              style={{
                position: "fixed",
                width: "100%",
                padding: 10,
                display: "flex",
                justifyContent: "flex-end",
                bottom: 0,
                borderTop: "1px solid #c5c5c5",
                left: 0,
                background: "#fff",
              }}
              className="container"
            >
              <Space>
                {currentWizardStep >= 0 && currentWizardStep <= 2 && (
                  <Button
                    style={{ margin: "0 8px" }}
                    onClick={() => {
                      onClose();
                      setCurrentWizardStep(0);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {currentWizardStep === 2 && (
                  <>
                    <Button
                      type="primary"
                      disabled={!programData || assignedDevices?.length === 0}
                      onClick={() => postProgram(false)}
                    >
                      Save for Later
                    </Button>
                    <Button
                      loading={buttonLoading}
                      onClick={() => postProgram(true)}
                      disabled={!programData || assignedDevices?.length === 0}
                      type="primary"
                    >
                      Activate
                    </Button>
                  </>
                )}
                {currentWizardStep < 2 && (
                  <Button
                    type="primary"
                    loading={buttonLoading}
                    onClick={async () => {
                      dispatch(setDrawerErrorMessage(""));
                      if (currentWizardStep === 0) {
                        await EnrollParticipant(
                          enrollParticipantFormData,
                          authToken,
                          dispatch,
                          setCurrentWizardStep,
                          currentWizardStep
                        );
                      } else {
                        setCurrentWizardStep(currentWizardStep + 1);
                      }
                    }}
                    // disabled={(currentStep === 0 && !stepOneComplete) && true}
                  >
                    Save & Continue
                  </Button>
                )}
              </Space>
            </div>
          )}
        </Drawer>

        {showHistoryDrawer && <HistoryDrawer />}
        {showMessageDrawer && <MessageDrawer />}
      </StyledColRight>
    </Row>
  );
};

export default Caseload;
