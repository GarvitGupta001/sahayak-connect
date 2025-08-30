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

    // useEffect(() => {
    //     console.log(chats);
    // }, [chats]);

        return (
            <div className="flex flex-col h-full rounded-xl bg-white/70 backdrop-blur border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth">
                    {chats.length === 0 && (
                        <div className="text-center text-slate-500 text-sm font-medium">
                            Ask about a government scheme in your language to get started.
                        </div>
                    )}
                    {chats.map((chat, index) => (
                        <div key={index} className="space-y-3 animate-fade-slide" style={{animationDelay: `${index*80}ms`}}>
                            <div className="ml-auto max-w-[80%] rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 text-white px-4 py-3 shadow">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{chat.user}</p>
                            </div>
                            {(() => {
                                switch (chat.status) {
                                    case RESPONSE_STATUS.FETCHING:
                                        return <ChatLoading />;
                                    case RESPONSE_STATUS.FETCHED:
                                        return <ChatSuccess message={chat.bot} />;
                                    case RESPONSE_STATUS.FAILED_FETCH:
                                        return <ChatError />;
                                    default:
                                        return null;
                                }
                            })()}
                        </div>
                    ))}
                </div>
                <div className="border-t border-slate-200 bg-white/80">
                    <ChatInput onSend={onSend} disabled={chatDisabled} />
                </div>
            </div>
        );
};

export default Home;
