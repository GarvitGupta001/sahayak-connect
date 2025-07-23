"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex justify-between px-10 items-center">
      <div className="w-[50%]">
      <h1 className="text-7xl">Sahayak Connect</h1>
      <p className="text-4xl">
        Under Development
        {activeDot > 0 ? "." : ""}
        {activeDot > 1 ? "." : ""}
        {activeDot > 2 ? "." : ""}
      </p>
      </div>
      <div className="flex justify-center w-[50%]">
        <video src="/AI_orb.webm" autoPlay loop muted playsInline className="h-96"></video>
      </div>
    </div>
  );
}
