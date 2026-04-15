import { useEffect, useState } from "react";
import { sendMessage, getMessages } from "../../api/messageApi";
import MessageBubble from "./MessageBubble";
import FileUpload from "./FileUpload";

export default function ChatWindow({ selectedChat }) {
    const [messages, setMessages] = useState([]);

    const [text, setText] = useState("");

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!selectedChat) return;

        loadMessages();

        const interval = setInterval(
            loadMessages,

            2000
        );

        return () => clearInterval(interval);
    }, [selectedChat]);

    const loadMessages = async () => {
        try {
            const res = await getMessages(selectedChat.chatId);

            setMessages(res?.data || []);
        } catch (err) {
            console.log(err);

            setMessages([]);
        }
    };

    const handleSend = async () => {
        if (!text.trim()) return;

        await sendMessage({
            chatId: selectedChat.chatId,

            senderId: currentUser.userId,

            receiverId: selectedChat.receiverId,

            content: text,

            messageType: "TEXT",
        });

        setText("");

        loadMessages();
    };

    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400">
                Select chat
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="p-3 border-b bg-white">
                Chat ID: {selectedChat.chatId}
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
                {messages?.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        own={msg.senderId === currentUser.userId}
                    />
                ))}
            </div>

            <div className="p-2 bg-white border-t flex gap-2">
                <FileUpload chat={selectedChat} />

                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 border rounded p-2"
                    placeholder="Type message"
                />

                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
