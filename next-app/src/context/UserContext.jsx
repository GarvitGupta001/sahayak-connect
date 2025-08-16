"use client";

import { createContext, useState } from "react";

export const UserContext = createContext(undefined);

export function UserProvider({ children }) {
    const [user, setUser] = useState({});

    const [personalDetails, setPersonalDetails] = useState({
        name: "",
        email: "",
        age: "",
        gender: "",
        preferredLanguage: "",
    });

    const [demographics, setDemographics] = useState({
        category: "",
        maritalStatus: "",
        disability: false,
        religion: "",
        caste: "",
    });

    const [education, setEducation] = useState({
        level: "",
        field: "",
        institution: "",
        graduationYear: "",
    });

    const [income, setIncome] = useState({
        annual: "",
        source: "",
        verified: false,
        lastUpdated: "",
    });

    const [location, setLocation] = useState({
        state: "",
        district: "",
        pincode: "",
        address: "",
    });

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
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
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
