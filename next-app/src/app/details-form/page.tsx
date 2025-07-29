"use client";

import * as React from "react";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  PersonalDetailsForm,
  DemographicsForm,
  EducationForm,
  IncomeForm,
  LocationForm,
} from "@/components/forms";

export default function DetailsForm() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <MobileStepper
        variant="progress"
        steps={6}
        position="static"
        activeStep={activeStep}
        sx={{ maxWidth: "100%" }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
            {activeStep >= 4 ? "Submit" : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
          </Button>
        }
      />
      {activeStep === 0 && <PersonalDetailsForm />}
      {activeStep === 1 && <DemographicsForm />}
      {activeStep === 2 && <EducationForm />}
      {activeStep === 3 && <IncomeForm />}
      {activeStep === 4 && <LocationForm />}
    </>
  );
}
