import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        const handleUnload = () => {
            navigator.sendBeacon(
                `http://localhost:8080/api/users/${user.userId}/online?online=false`
            );
        };

        window.addEventListener("unload", handleUnload);

        return () => {
            window.removeEventListener("unload", handleUnload);
        };
    }, []);

    return (
        <div className="h-screen flex bg-gray-100">
            <Sidebar setSelectedChat={setSelectedChat} />

            <ChatWindow selectedChat={selectedChat} />
        </div>
    );
}
