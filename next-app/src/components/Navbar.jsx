"use client";

import React, { useState } from "react";
import Image from 'next/image';
import 'remixicon/fonts/remixicon.css';

// NOTE: This replaces the previous bottom navigation (MUI) with a responsive top navbar.
// It is fixed to the top. Ensure page content adds top padding/margin if it gets hidden.
// If an existing <Header /> is also rendered (see protected app layout), you may
// want to remove that to avoid two stacked fixed headers.

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-white fixed w-full z-30 top-0 left-0 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                    <Image src="/sahaayaklogo%20(1).png" alt="Sahayak Logo" width={140} height={56} priority className="h-14 w-auto" />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-8 text-l font-bold text-[#20314e]">
                    <a href="#how-it-works" className="hover:text-blue-900">Home</a>
                    <a href="#why" className="hover:text-blue-900">Apply For Schemes</a>
                    <a href="#demo" className="hover:text-blue-900">Demonstration</a>
                    <a href="#contact" className="hover:text-blue-900">Contact Us</a>
                </nav>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-2xl text-[#20314e] focus:outline-none"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        <i className={menuOpen ? "ri-close-line" : "ri-menu-line"}></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu with smooth transition */}
            <div
                className={`md:hidden transition-all duration-300 transform origin-top ${menuOpen ? 'max-h-[500px] opacity-100 pt-4 pb-6 px-6 pointer-events-auto' : 'max-h-0 opacity-0 px-6 pointer-events-none'} overflow-hidden text-[#20314e] font-semibold`}
                style={{ willChange: 'transform, opacity, maxHeight' }}
            >
                <a href="#how-it-works" className="block hover:text-blue-900" onClick={() => setMenuOpen(false)}>Home</a>
                <a href="#why" className="block hover:text-blue-900" onClick={() => setMenuOpen(false)}>Apply For Schemes</a>
                <a href="#demo" className="block hover:text-blue-900" onClick={() => setMenuOpen(false)}>Demonstration</a>
                <a href="#contact" className="block hover:text-blue-900" onClick={() => setMenuOpen(false)}>Contact Us</a>
            </div>
        </header>
    );
};

export default Navbar;
