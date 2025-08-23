"use client";

import axios from "axios";
import { createContext, useState, useEffect } from "react";
import Loader from "@/components/Loader";

export const UserContext = createContext(undefined);

export function UserProvider({ children }) {
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);
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

    useEffect(() => {
        const verifyAndFetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            try {
                const verifyResponse = await axios.post("/api/verify-token", {
                    token,
                });
                if (!verifyResponse.data.success) {
                    throw new Error("Token verification failed");
                }
                const decoded = verifyResponse.data.decoded;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const userResponse = await axios.get(
                    `/api/user/${decoded._id}`
                );
                if (!userResponse.data.success) {
                    throw new Error("Failed to fetch user");
                }
                const fetchedUser = userResponse.data.user;
                setUser(fetchedUser);

                if (fetchedUser.profileComplete) {
                    const detailsResponse = await axios.get(
                        `/api/user-details/${fetchedUser._id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    if (detailsResponse.data.success) {
                        setPersonalDetails(
                            detailsResponse.data.personalDetails
                        );
                        setDemographics(detailsResponse.data.demographics);
                        setEducation(detailsResponse.data.education);
                        setIncome(detailsResponse.data.income);
                        setLocation(detailsResponse.data.location);
                    }
                }
            } catch (error) {
                console.error("Authentication failed:", error);
            }
        };
        const handleLoader = async () => {
            setLoading(true)
            await verifyAndFetchUser()
            setLoading(false)
        }
        handleLoader()
    }, []);

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
            {loading ? <Loader /> : children}
        </UserContext.Provider>
    );
}
