"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
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
import Loader from "@/components/Loader";

import { useUserContext } from "@/hooks/useUserContext";

export default function DetailsForm() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);

    const {
        user,
        personalDetails,
        setPersonalDetails,
        demographics,
        setDemographics,
        education,
        setEducation,
        income,
        setIncome,
        location,
        setLocation,
    } = useUserContext();

    const handleNext = () => {
        switch (activeStep) {
            case 0:
                localStorage.setItem(
                    "personalDetails",
                    JSON.stringify(personalDetails)
                );
                break;
            case 1:
                localStorage.setItem(
                    "demographics",
                    JSON.stringify(demographics)
                );
                break;
            case 2:
                localStorage.setItem("education", JSON.stringify(education));
                break;
            case 3:
                localStorage.setItem("income", JSON.stringify(income));
                break;
            case 4:
                localStorage.setItem("location", JSON.stringify(location));
                break;
            case 5:
                handleSubmit();
                return;
            default:
                break;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        const allFormData = {
            personalDetails: {
                ...personalDetails,
                age: Number(personalDetails.age),
            },
            demographics,
            education: {
                ...education,
                graduationYear: Number(education.graduationYear),
            },
            income: {
                ...income,
                annual: Number(income.annual),
            },
            location,
        };
        const response = await axios.post(
            `/api/user-details/${user._id}`,
            allFormData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        router.replace("/app/home");
        localStorage.removeItem("personalDetails");
        localStorage.removeItem("demographics");
        localStorage.removeItem("education");
        localStorage.removeItem("income");
        localStorage.removeItem("location");

        alert("Form submitted successfully!");
    };

    const isStepValid = () => {
        switch (activeStep) {
            case 0:
                return (
                    personalDetails.name &&
                    personalDetails.age &&
                    personalDetails.gender &&
                    personalDetails.preferredLanguage
                );
            case 1:
                return demographics.category && demographics.maritalStatus;
            case 2:
                return education.level;
            case 3:
                return income.annual && income.source;
            case 4:
                return location.state;
            default:
                return true;
        }
    };

    useEffect(() => {
        const savedPersonalDetails = localStorage.getItem("personalDetails");
        const savedDemographics = localStorage.getItem("demographics");
        const savedEducation = localStorage.getItem("education");
        const savedIncome = localStorage.getItem("income");
        const savedLocation = localStorage.getItem("location");

        if (savedPersonalDetails) {
            setPersonalDetails(JSON.parse(savedPersonalDetails));
        }
        if (savedDemographics) {
            setDemographics(JSON.parse(savedDemographics));
        }
        if (savedEducation) {
            setEducation(JSON.parse(savedEducation));
        }
        if (savedIncome) {
            setIncome(JSON.parse(savedIncome));
        }
        if (savedLocation) {
            setLocation(JSON.parse(savedLocation));
        }
    }, []);

    useEffect(() => {
        if (!user.profileComplete) {
            setLoading(false);
        } else {
            router.replace("/app/home");
        }
    }, [user.profileComplete]);

    return (
        <div className="h-screen w-screen">
            <MobileStepper
                variant="progress"
                steps={6}
                position="static"
                activeStep={activeStep}
                sx={{ maxWidth: "100%" }}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                    >
                        {activeStep === 4 ? (
                            "Review"
                        ) : activeStep === 5 ? (
                            "Submit"
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                    >
                        <KeyboardArrowLeft />
                    </Button>
                }
            />

            {/* Form Steps */}
            {activeStep === 0 && (
                <PersonalDetailsForm
                    state={personalDetails}
                    setState={setPersonalDetails}
                />
            )}
            {activeStep === 1 && (
                <DemographicsForm
                    state={demographics}
                    setState={setDemographics}
                />
            )}
            {activeStep === 2 && (
                <EducationForm state={education} setState={setEducation} />
            )}
            {activeStep === 3 && (
                <IncomeForm state={income} setState={setIncome} />
            )}
            {activeStep === 4 && (
                <LocationForm state={location} setState={setLocation} />
            )}
            {activeStep === 5 && (
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">
                        Review Your Information
                    </h2>
                    <div className="space-y-6">
                        {/* Personal Details */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">
                                Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <strong>Name:</strong>{" "}
                                    {personalDetails.name}
                                </div>
                                <div>
                                    <strong>Email:</strong>{" "}
                                    {personalDetails.email || "Not provided"}
                                </div>
                                <div>
                                    <strong>Age:</strong> {personalDetails.age}
                                </div>
                                <div>
                                    <strong>Gender:</strong>{" "}
                                    {personalDetails.gender}
                                </div>
                                <div>
                                    <strong>Preferred Language:</strong>{" "}
                                    {personalDetails.preferredLanguage}
                                </div>
                            </div>
                        </div>

                        {/* Demographics */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">
                                Demographics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <strong>Category:</strong>{" "}
                                    {demographics.category}
                                </div>
                                <div>
                                    <strong>Marital Status:</strong>{" "}
                                    {demographics.maritalStatus}
                                </div>
                                <div>
                                    <strong>Disability:</strong>{" "}
                                    {demographics.disability ? "Yes" : "No"}
                                </div>
                                <div>
                                    <strong>Religion:</strong>{" "}
                                    {demographics.religion || "Not provided"}
                                </div>
                                <div>
                                    <strong>Caste:</strong>{" "}
                                    {demographics.caste || "Not provided"}
                                </div>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">
                                Education
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <strong>Education Level:</strong>{" "}
                                    {education.level}
                                </div>
                                <div>
                                    <strong>Field of Study:</strong>{" "}
                                    {education.field || "Not provided"}
                                </div>
                                <div>
                                    <strong>Institution:</strong>{" "}
                                    {education.institution || "Not provided"}
                                </div>
                                <div>
                                    <strong>Graduation Year:</strong>{" "}
                                    {education.graduationYear || "Not provided"}
                                </div>
                            </div>
                        </div>

                        {/* Income */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">
                                Income
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <strong>Annual Income:</strong>{" "}
                                    {income.annual
                                        ? `₹${income.annual.toLocaleString()}`
                                        : "Not provided"}
                                </div>
                                <div>
                                    <strong>Source of Income:</strong>{" "}
                                    {income.source}
                                </div>
                                <div>
                                    <strong>Income Verified:</strong>{" "}
                                    {income.verified ? "Yes" : "No"}
                                </div>
                                <div>
                                    <strong>Last Updated:</strong>{" "}
                                    {income.lastUpdated || "Not provided"}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">
                                Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <strong>State:</strong> {location.state}
                                </div>
                                <div>
                                    <strong>District:</strong>{" "}
                                    {location.district || "Not provided"}
                                </div>
                                <div>
                                    <strong>Pincode:</strong>{" "}
                                    {location.pincode || "Not provided"}
                                </div>
                                <div>
                                    <strong>Address:</strong>{" "}
                                    {location.address || "Not provided"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
