"use client";

import React from "react";
import ChatInput from "@/components/ui/ChatInput";

const Home = () => {
    return (
        <>
            <div className="flex flex-col h-[100%]">
                <div className="h-[100%]">
                    <h1 className="">Chats</h1>
                </div>
                <ChatInput />
            </div>
        </>
    );
};

export default Home;
