import { useState, useEffect } from "react";

function App() {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center py-10 items-center bg-black text-white">
        <div className="text-left">
          <h1 className="text-7xl">Sahayak Connect</h1>
          <p className="text-4xl">
            Under Development
            {activeDot > 0 ? "." : ""}
            {activeDot > 1 ? "." : ""}
            {activeDot > 2 ? "." : ""}
          </p>
        </div>
        <div className="flex justify-center">
          <video
            src="/AI_orb.webm"
            autoPlay
            loop
            muted
            playsInline
            className="h-96"
          ></video>
        </div>
      </div>
    </>
  );
}

export default App;
