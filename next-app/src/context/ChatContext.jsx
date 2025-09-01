"use client";

import { useState, createContext } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);

    return (
        <ChatContext.Provider value={{ chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;