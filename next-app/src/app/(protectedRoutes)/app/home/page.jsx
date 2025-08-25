"use client";

import React, { useState, useEffect } from "react";
import ChatInput from "@/components/ui/ChatInput";
import ChatLoading from "@/components/ui/ChatLoading";
import ChatError from "@/components/ui/ChatError";
import ChatSuccess from "@/components/ui/ChatSuccess";
import { RESPONSE_STATUS } from "@/constants/responseStatus";

const Home = () => {
    const [chats, setChats] = useState([]);
    const [chatDisabled, setChatDisabled] = useState(false);

    const getMLResponse = async (input) => {
        const response = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                console.log(random);
                if (random > 0.8) {
                    resolve({
                        success: false,
                        message: "FAILED",
                        data: null,
                    });
                    return;
                }
                resolve({
                    success: true,
                    message: "SUCCESS",
                    data: "This is a sample response",
                });
            }, 1000);
        });
        return response;
    };

    const onSend = async (input, setInput) => {
        const chat = {
            user: input,
            bot: null,
            status: RESPONSE_STATUS.FETCHING,
        };
        setInput("");
        console.log(chat);
        setChats((chats) => [...chats, chat]);
        setChatDisabled(true);
        const response = await getMLResponse(input);
        console.log(response);
        if (!response.success) {
            setChats((currentChats) =>
                currentChats.map((chat, index) => {
                    if (index === currentChats.length - 1) {
                        return {
                            ...chat,
                            status: RESPONSE_STATUS.FAILED_FETCH,
                        };
                    }
                    return chat;
                })
            );
            setChatDisabled(false);
            return;
        }
        setChats((currentChats) =>
            currentChats.map((chat, index) => {
                if (index === currentChats.length - 1) {
                    return {
                        ...chat,
                        status: RESPONSE_STATUS.FETCHED,
                        bot: response.data,
                    };
                }
                return chat;
            })
        );
        setChatDisabled(false);
    };

    useEffect(() => {
        console.log(chats);
    }, [chats]);

    return (
        <>
            <div className="flex flex-col justify-end h-[100%] overflow-y-scroll">
                <div className="flex flex-col overflow-y-scroll">
                    {chats.map((chat, index) => (
                        <div key={index} className="mb-4">
                            <div className="p-3 rounded-lg bg-blue-500 text-white self-end max-w-lg ml-auto">
                                <p>{chat.user}</p>
                            </div>
                            {(() => {
                                switch (chat.status) {
                                    case RESPONSE_STATUS.FETCHING:
                                        return <ChatLoading />;
                                    case RESPONSE_STATUS.FETCHED:
                                        return (
                                            <ChatSuccess message={chat.bot} />
                                        );
                                    case RESPONSE_STATUS.FAILED_FETCH:
                                        return <ChatError />;
                                    default:
                                        return null;
                                }
                            })()}
                        </div>
                    ))}
                </div>
                <ChatInput onSend={onSend} disabled={chatDisabled} />
            </div>
        </>
    );
};

export default Home;
