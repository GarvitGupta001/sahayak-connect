import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";

const useChatContext = () => {
    const { chats, setChats } = useContext(ChatContext);

    return { chats, setChats };
};

export default useChatContext;