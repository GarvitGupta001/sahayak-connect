"use client";

import { useUserContext } from "@/hooks/useUserContext";

export default function Home() {
    const { personalDetails, demographics, education, income, location } =
        useUserContext();
    return (
        <div className="p-4">
            <div className="space-y-6">
                {/* Personal Details */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">
                        Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Name:</strong> {personalDetails.name}
                        </div>
                        <div>
                            <strong>Email:</strong>{" "}
                            {personalDetails.email || "Not provided"}
                        </div>
                        <div>
                            <strong>Age:</strong> {personalDetails.age}
                        </div>
                        <div>
                            <strong>Gender:</strong> {personalDetails.gender}
                        </div>
                        <div>
                            <strong>Preferred Language:</strong>{" "}
                            {personalDetails.preferredLanguage}
                        </div>
                    </div>
                </div>

                {/* Demographics */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Demographics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Category:</strong> {demographics.category}
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
                    <h3 className="font-semibold text-lg mb-3">Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Education Level:</strong> {education.level}
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
                    <h3 className="font-semibold text-lg mb-3">Income</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Annual Income:</strong>{" "}
                            {income.annual
                                ? `₹${income.annual.toLocaleString()}`
                                : "Not provided"}
                        </div>
                        <div>
                            <strong>Source of Income:</strong> {income.source}
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
                    <h3 className="font-semibold text-lg mb-3">Location</h3>
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
    );
}
