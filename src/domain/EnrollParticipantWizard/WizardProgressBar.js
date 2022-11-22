import React from "react";
import { Steps } from "antd";
import { setWizardStep } from "features/enrollWizard/enrollWizardSlice";
import { useDispatch, useSelector } from "react-redux";
import "./WizardProgressBar.css";

const { Step } = Steps;

const WizardProgressBar = () => {
  const currentStep = useSelector(
    (state) => state.enrollWizardData.currentWizardStep
  );
  const dispatch = useDispatch();
  const onChange = (current) => {
    dispatch(setWizardStep(current));
  };
  return (
    <Steps current={currentStep} onChange={onChange}>
      <Step title="Enroll Participant" />
      <Step disabled={currentStep === 0} title="Manage Alert Notifications" />
      <Step
        disabled={currentStep === 0 || currentStep === 1}
        title="Manage Program"
      />
    </Steps>
  );
};

export default WizardProgressBar;
