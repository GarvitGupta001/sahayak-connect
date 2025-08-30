"use client";
import React, { useState } from "react";
import Image from 'next/image';
import 'remixicon/fonts/remixicon.css';

// A simplified mobile-first navbar for the PhoneHome landing page.
// Adjust links/anchors to match sections present on the page.
const PhoneNavbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/sahaayaklogo%20(1).png" alt="Sahayak Connect" width={120} height={48} priority className="h-10 w-auto" />
          <span className="font-bold text-lg text-slate-900">SahayakConnect</span>
        </div>
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl text-slate-900"
        >
          <i className={open ? 'ri-close-line' : 'ri-menu-line'} />
        </button>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-800">
          <a href="#how-it-works" className="hover:text-blue-900">How It Works</a>
          <a href="#why" className="hover:text-blue-900">Why</a>
          <a href="#demo" className="hover:text-blue-900">Demo</a>
          <a href="#contact" className="hover:text-blue-900">Contact</a>
        </nav>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-64' : 'max-h-0'}`}
      >
        <div className="px-6 pb-4 flex flex-col space-y-3 font-semibold text-slate-800">
          <a href="#how-it-works" onClick={() => setOpen(false)} className="hover:text-blue-900">How It Works</a>
          <a href="#why" onClick={() => setOpen(false)} className="hover:text-blue-900">Why</a>
          <a href="#demo" onClick={() => setOpen(false)} className="hover:text-blue-900">Demo</a>
          <a href="#contact" onClick={() => setOpen(false)} className="hover:text-blue-900">Contact</a>
        </div>
      </div>
    </header>
  );
};

export default PhoneNavbar;
