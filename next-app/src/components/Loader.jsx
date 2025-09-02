import React, { useState, useEffect } from "react";

const Loader = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="flex space-x-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#130032] rounded-full animate-bounce"></div>
                <div
                    className="w-3 h-3 md:w-4 md:h-4 bg-[#130032] rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                    className="w-3 h-3 md:w-4 md:h-4 bg-[#130032] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                ></div>
            </div>
        </div>
    );
};

export default Loader;
