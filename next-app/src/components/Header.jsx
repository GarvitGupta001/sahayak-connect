"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

/*
  Header Component
  - Mobile-first, sticky top bar
  - Shows app logo + dynamic or provided title
  - Light glassmorphic style to match rest of UI
  Usage: <Header /> or <Header title="Profile" />
*/

const Header = ({ title }) => {
  const pathname = usePathname();

  // Derive a title from pathname if no explicit title provided
  const derivedTitle = React.useMemo(() => {
    if (title) return title;
    if (!pathname) return "Sahayak Connect";
    const segment = pathname.split("/").filter(Boolean).pop();
    if (!segment) return "Sahayak Connect";
    return segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [pathname, title]);

  return (
    <header className="sticky top-0 z-20 w-full backdrop-blur bg-white/60 border-b border-slate-200/70 shadow-sm">
      <div className="max-w-md mx-auto flex items-center gap-3 px-4 h-14">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Sahayak Connect Logo"
            width={32}
            height={32}
            priority
            className="rounded-md w-8 h-8 object-contain"
          />
          <span className="font-['TAN-Tangkiwood'] text-xl leading-none select-none">
            Sahayak
          </span>
        </div>
        <div className="ml-auto text-sm font-semibold text-slate-700 truncate max-w-[55%]" title={derivedTitle}>
          {derivedTitle}
        </div>
      </div>
    </header>
  );
};

export default Header;