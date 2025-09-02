// pages/schemes/[SchemeId].js
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "@/hooks/useUserContext"; // Adjust the path as needed
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";

// A simple utility function to format the text
const formatText = (text) => {
    return text.split(". ").map((sentence, index) => (
        <p key={index} className="text-gray-700 mb-2">
            {sentence.trim()}.
        </p>
    ));
};

export default function SchemePage() {
    const { SchemeId } = useParams();
    const { user } = useUserContext(); // Use the custom user context hook
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!SchemeId) return;

        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/schemes?id=${SchemeId}`);
                if (!response.data.success) {
                    throw new Error(response.data.message);
                }
                setData(response.data.scheme);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [SchemeId]);

    const handleSaveScheme = () => {
        if (user) {
            // Logic to save the scheme data, for example, to a user's saved schemes list
            console.log(
                `Saving scheme ${data.scheme_name} for user ${user.name}`
            );
            alert(`Scheme "${data.scheme_name}" saved successfully!`);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>No scheme found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {data.scheme_name}
            </h1>
            {user && (
                <button
                    onClick={handleSaveScheme}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors mb-4"
                >
                    Save Scheme
                </button>
            )}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    {data.schemeCategory.map((category, index) => (
                        <span
                            key={index}
                            className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </div>
            <div className="p-4 rounded-lg mb-2">
                <div className="prose max-w-none text-gray-700">
                    {formatText(data.details)}
                </div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Benefits
                </h2>
                <div className="prose max-w-none text-gray-700">
                    {formatText(data.benefits)}
                </div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Required Documents
                </h2>
                <div className="prose max-w-none text-gray-700">
                    {data.documents.split(". ").map((item, index) => (
                        <p key={index} className="text-gray-700 mb-1">
                            {item.trim()}.
                        </p>
                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center gap-5">
            <button
                    className="bg-[#168996] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#46868e] transition-colors mb-4"> Download Form </button>
            <button
                    className="bg-[#003158] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#46868e] transition-colors mb-4"> Fill Form with AI</button>
            </div>
        </div>
    );
}
