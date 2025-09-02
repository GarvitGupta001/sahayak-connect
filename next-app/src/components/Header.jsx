"use client";
import React from "react";
import Image from 'next/image';
import 'remixicon/fonts/remixicon.css';

// A simplified mobile-first navbar for the PhoneHome landing page.
// Adjust links/anchors to match sections present on the page.
const Header = () => {
  return (
    <header className="w-full z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
        <Image src="/sahaayaklogo%20(1).png" alt="Sahayak Connect" width={140} height={56} priority className="h-12 w-auto" />
      </div>
    </header>
  );
};

export default Header;