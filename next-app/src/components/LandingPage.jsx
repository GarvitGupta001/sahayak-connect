"use client";

import React from "react";
import Link from "next/link";
import { useUserContext } from "@/hooks/useUserContext";
import "remixicon/fonts/remixicon.css";
import Header from "@/components/Header";

export default function PhoneHome() {
    const { user } = useUserContext();

    return (
        <div className="bg-white text-slate-900">
            <div className="flex flex-col h-[100vh]">
                <Header />
                {/* Hero Section */}
                <section
                    className="w-full h-[100%] bg-no-repeat bg-cover bg-center flex items-center px-4"
                    style={{
                        backgroundImage: "url('/roboPhone.png')",
                        backgroundPosition: "right bottom",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                    }}
                >
                    <div className="grid md:grid-cols-2 gap-10 w-full items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Your Voice. Your Rights. One AI Assistant.
                            </h1>
                            <p className="mb-6 text-lg font-semibold">
                                No forms, no confusion — just speak, and we’ll
                                apply for you.
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <Link
                                    href={
                                        !user
                                            ? "/sign-in"
                                            : user.profileComplete
                                            ? "/app/home"
                                            : "/app/user-details"
                                    }
                                >
                                    <button className="bg-slate-900 text-white px-8 md:px-16 py-3 rounded-full font-semibold hover:scale-105 transition">
                                        Find and Apply Now
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="">
                            <div className="absolute bottom-24 text-blue-900 font-bold text-xl">
                                हिंदी
                            </div>
                            <div className="absolute bottom-[5rem] right-[18rem] text-orange-500 font-bold text-xl">
                                घऱां
                            </div>
                            <div className="absolute bottom-[10rem] right-[15rem] text-blue-900 font-bold text-xl">
                                سنڌي
                            </div>
                            <div className="absolute bottom-24 right-[30rem] text-yellow-400 font-bold text-xl">
                                தமிழ்
                            </div>
                            <div className="absolute bottom-[12rem] right-[20rem] text-pink-500 font-bold text-xl">
                                বাংলা
                            </div>
                            <div className="absolute bottom-[17rem] right-[2rem] text-green-600 font-extrabold text-xl">
                                ગુજરાતી
                            </div>
                            <div className="absolute bottom-[15rem] right-[12rem] text-purple-600 font-bold text-xl">
                                ਪੰਜਾਬੀ
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* How It Works */}
            <section className="px-6 md:px-20 py-16 bg-blue-50">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: "ri-mic-line",
                            title: "Speak in Your Language",
                            desc: "We understand 10+ Indian languages via voice.",
                        },
                        {
                            icon: "ri-lightbulb-flash-line",
                            title: "Get Matching Schemes",
                            desc: "AI recommends schemes based on your situation.",
                        },
                        {
                            icon: "ri-file-edit-line",
                            title: "Get Forms Filled Automatically",
                            desc: "Upload Aadhaar, we handle the paperwork.",
                        },
                        {
                            icon: "ri-eye-line",
                            title: "Review Before You Submit",
                            desc: "You’ll get to verify all details before submission.",
                        },
                        {
                            icon: "ri-notification-3-line",
                            title: "Stay Notified",
                            desc: "We notify you when new schemes you’re eligible for go live.",
                        },
                        {
                            icon: "ri-chat-voice-line",
                            title: "Ask in Your Voice",
                            desc: "Not sure what you need? Just ask — your AI assistant listens.",
                        },
                    ].map((step, index) => (
                        <div
                            key={index}
                            className="bg-blue-100 p-6 rounded-2xl flex flex-col items-center hover:scale-105 transition-transform duration-200 text-center min-h-[180px]"
                        >
                            <i
                                className={`${step.icon} text-4xl mb-4 text-blue-900`}
                            ></i>
                            <h3 className="text-xl font-bold mb-2">
                                {step.title}
                            </h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Sahayak Connect Section */}
            <section className="bg-white px-6 md:px-20 py-16" id="why">
                {/* Top Block */}
                <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
                    {/* Left */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Why Sahayak Connect?
                        </h2>
                        <h3 className="font-bold text-gray-800 mb-1 text-lg">
                            Multilingual AI Agent
                        </h3>
                        <p className="text-lg text-gray-600 mb-4 font-semibold">
                            Understands voice and text in native Indian
                            languages.
                        </p>
                        <button className="bg-orange-50 hover:bg-orange-100 transition text-sm px-6 py-2 rounded-full font-semibold shadow">
                            See how we fill the form{" "}
                            <span className="text-lg">→</span>
                        </button>
                    </div>

                    {/* Right */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                            <div className="bg-[#002645] text-white rounded-lg p-4 text-sm leading-relaxed font-bold">
                                हमर पतिक निधन भऽ गेल अछि,
                                <br /> आ हम गर्भवती छी।
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800">
                                    Suggested Scheme
                                </h4>
                                <p className="text-sm text-gray-600 font-bold">
                                    Pradhan Mantri Matru Vandana Yojana
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="bg-orange-50 rounded-xl p-6 md:p-10">
                    <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-10">
                        Your Guide to Government Support
                        <br />
                        Helping Every Citizen, Every Step
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        {[
                            {
                                icon: "ri-translate-2",
                                title: "Multilingual AI Agent",
                                desc: "Understands voice and text in native Indian languages.",
                            },
                            {
                                icon: "ri-file-copy-line",
                                title: "End-to-End Support",
                                desc: "From eligibility check to pre-filled form PDF.",
                            },
                            {
                                icon: "ri-community-line",
                                title: "Built for Bharat",
                                desc: "Designed for citizens with low digital access and literacy.",
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <i className={`${item.icon} text-3xl mb-4`}></i>
                                <h3 className="font-semibold mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-700 font-semibold">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center mt-10">
                    <Link href={
                            !user
                                ? "/sign-in"
                                : user.profileComplete
                                ? "/app/home"
                                : "/app/user-details"
                        }>
                        <button className="bg-slate-900 text-white px-8 md:px-16 py-3 rounded-full font-semibold hover:scale-105 transition"> Start Now </button>
                    </Link>
                </div>
            </section>

            <footer className="text-center text-sm font-semibold text-gray-500 mt-1 pb-6">
                • Built with Care by Team SahaayakConnect •
            </footer>
        </div>
    );
}
