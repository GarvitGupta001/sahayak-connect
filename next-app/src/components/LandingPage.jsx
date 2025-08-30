"use client";
import React from "react";
import 'remixicon/fonts/remixicon.css';
import { useRouter } from 'next/navigation';
import PhoneNavbar from "@/components/PhoneNavbar";

const LANGUAGES = [
  { text: 'हिंदी', color: 'bg-blue-50 text-blue-900' },
  { text: 'ঘऱां', color: 'bg-orange-50 text-orange-600' },
  { text: 'سنڌي', color: 'bg-indigo-50 text-indigo-700' },
  { text: 'தமிழ்', color: 'bg-yellow-50 text-yellow-600' },
  { text: 'বাংলা', color: 'bg-pink-50 text-pink-600' },
  { text: 'ગુજરાતી', color: 'bg-green-50 text-green-600' },
  { text: 'ਪੰਜਾਬੀ', color: 'bg-purple-50 text-purple-600' },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-white text-slate-900">
      <PhoneNavbar />

      {/* Hero Section (rewritten for full mobile visibility) */}
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center pt-32 md:pt-40 pb-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-blue-50" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 w-[70%] md:w-1/2 bg-[url('/roboPhone.png')] bg-no-repeat bg-right-bottom bg-contain opacity-70 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-12 flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-snug md:leading-tight">
              Your Voice. Your Rights.<br className="hidden sm:block" /> One AI Assistant.
            </h1>
            <p className="mb-8 text-base sm:text-lg font-semibold max-w-xl mx-auto md:mx-0">
              No forms, no confusion — just speak, and we’ll apply for you.
            </p>
            <div className="flex justify-center md:justify-start">
              <button
                onClick={() => router.push('/sign-in')}
                className="bg-slate-900 text-white px-8 sm:px-12 md:px-16 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 transition shadow-lg shadow-slate-900/20"
              >
                Find and Apply Now
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 md:hidden max-w-xs mx-auto">
              {LANGUAGES.map(l => (
                <span key={l.text} className={`${l.color} text-xs sm:text-sm font-semibold rounded-full px-3 py-1 shadow-sm border border-slate-100 whitespace-nowrap`}>{l.text}</span>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 hidden md:flex items-center justify-center relative">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {LANGUAGES.map((l,i) => (
                <span key={l.text} className={`text-lg font-bold rounded-xl px-4 py-3 text-center shadow bg-white/70 backdrop-blur border border-slate-200 animate-fade-slide`} style={{animationDelay: `${i*120}ms`}}>{l.text}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 md:px-20 py-16 bg-blue-50">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "ri-mic-line", title: "Speak in Your Language", desc: "We understand 10+ Indian languages via voice." },
            { icon: "ri-lightbulb-flash-line", title: "Get Matching Schemes", desc: "AI recommends schemes based on your situation." },
            { icon: "ri-file-edit-line", title: "Get Forms Filled Automatically", desc: "Upload Aadhaar, we handle the paperwork." },
            { icon: "ri-eye-line", title: "Review Before You Submit", desc: "You’ll get to verify all details before submission." },
            { icon: "ri-notification-3-line", title: "Stay Notified", desc: "We notify you when new schemes you’re eligible for go live." },
            { icon: "ri-chat-voice-line", title: "Ask in Your Voice", desc: "Not sure what you need? Just ask — your AI assistant listens." }
          ].map((step, index) => (
            <div key={index} className="bg-blue-100 p-6 rounded-2xl flex flex-col items-center hover:scale-105 transition-transform duration-200 text-center min-h-[180px]">
              <i className={`${step.icon} text-4xl mb-4 text-blue-900`}></i>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-white px-6 md:px-20 py-16" id="why">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Sahayak Connect?</h2>
            <h3 className="font-bold text-gray-800 mb-1 text-lg">Multilingual AI Agent</h3>
            <p className="text-lg text-gray-600 mb-4 font-semibold">
              Understands voice and text in native Indian languages.
            </p>
            <button className="bg-orange-50 hover:bg-orange-100 transition text-sm px-6 py-2 rounded-full font-semibold shadow">
              See how we fill the form <span className="text-lg">→</span>
            </button>
          </div>
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <div className="bg-[#002645] text-white rounded-lg p-4 text-sm leading-relaxed font-bold">
                हमर पतिक निधन भऽ गेल अछि,<br /> आ हम गर्भवती छी।
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Suggested Scheme</h4>
                <p className="text-sm text-gray-600 font-bold">Pradhan Mantri Matru Vandana Yojana</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 md:p-10">
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-10">
            Your Guide to Government Support<br />Helping Every Citizen, Every Step
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "ri-translate-2", title: "Multilingual AI Agent", desc: "Understands voice and text in native Indian languages." },
              { icon: "ri-file-copy-line", title: "End-to-End Support", desc: "From eligibility check to pre-filled form PDF." },
              { icon: "ri-community-line", title: "Built for Bharat", desc: "Designed for citizens with low digital access and literacy." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <i className={`${item.icon} text-3xl mb-4`}></i>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-700 font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center text-sm font-semibold text-gray-500 mt-10 pb-6" id="contact">
        • Built with Care by Team SahaayakConnect •
      </footer>
    </div>
  );
}
