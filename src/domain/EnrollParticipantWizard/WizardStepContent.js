import WizardStepOne from "containers/WizardContent/WizardStepOne";
import WizardStepThree from "containers/WizardContent/WizardStepThree";
import WizardStepTwo from "containers/WizardContent/WizardStepTwo";
import React from "react";
import { useSelector } from "react-redux";

const WizardStepContent = () => {
  let currentStep = useSelector(
    (state) => state.enrollWizardData.currentWizardStep
  );
  if (!currentStep) {
    currentStep = 0;
  }
  const renderComponent = () => {
    switch (currentStep) {
      case 0:
        return <WizardStepOne />;
      case 1:
        return <WizardStepTwo />;
      case 2:
        return <WizardStepThree />;
      default:
        return "";
    }
  };
  return renderComponent();
};

export default WizardStepContent;
