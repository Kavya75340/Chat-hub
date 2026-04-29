import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { AISuggestions } from "./AISuggestions";
import { Divider } from "@/components/ui/Divider";
import { ScheduleModal } from "@/components/schedule/ScheduleModal";
import {
    getMessages,
    sendMessage,
    markSeen,
    markDelivered,
} from "@/api/messageApi";
import { createNotification } from "@/api/notificationApi";
import { connectSocket } from "@/components/service/socketService";

export function ChatContainer({ chat, updateLastMessage }) {
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [scheduleOpen, setScheduleOpen] = useState(false);

    const scrollRef = useRef(null);
    const socketRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    // ================= LOAD MESSAGES =================
    useEffect(() => {
        if (!chat?.chatId) return;

        const loadMessages = async () => {
            try {
                const res = await getMessages(chat.chatId);
                const data = res.data || [];

                setMessages(data);

                if (data.length > 0) {
                    const last = data[data.length - 1];
                    updateLastMessage(chat.chatId, last.content);
                }
            } catch (err) {
                console.log("load error:", err);
            }
        };

        loadMessages();
    }, [chat?.chatId]);

    // ================= AUTO SCROLL =================
    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    // ================= DELIVERED =================
    useEffect(() => {
        if (!chat?.chatId) return;

        markDelivered(chat.chatId); // only once when chat changes
    }, [chat?.chatId]);

    // ================= SEEN (debounced) =================
    useEffect(() => {
        if (!chat?.chatId) return;

        if (messages.length > 0) {
            markSeen(chat.chatId);
        }
    }, [chat?.chatId]);

    // ================= SOCKET =================
    useEffect(() => {
        if (!chat?.chatId) return;

        // cleanup previous socket
        if (socketRef.current) {
            socketRef.current.deactivate();
        }

        socketRef.current = connectSocket(chat.chatId, (msg) => {
            // DELETE MESSAGE
            if (typeof msg === "string" && msg.startsWith("DELETE:")) {
                const id = msg.split(":")[1];

                setMessages((prev) =>
                    prev.filter((m) => String(m.id) !== String(id))
                );
                return;
            }

            // wrong chat ignore
            if (String(msg.chatId) !== String(chat.chatId)) return;

            // 🔥 INSTANT SEEN (IMPORTANT)
            if (msg.senderId !== currentUser.userId) {
                markSeen(chat.chatId);
            }

            // update sidebar last message
            if (msg.content) {
                updateLastMessage(chat.chatId, msg.content);
            }

            setMessages((prev) => {
                // temp remove (optional but recommended)
                const cleaned = prev.filter((m) => !m.isTemp);

                const exists = cleaned.some((m) => m.id === msg.id);

                if (exists) {
                    return cleaned.map((m) => (m.id === msg.id ? msg : m));
                }

                return [...cleaned, msg];
            });
        });

        return () => {
            socketRef.current?.deactivate();
        };
    }, [chat?.chatId]);

    // ================= SEND MESSAGE =================
    const handleSend = async () => {
        if (!draft.trim() || !chat?.chatId) return;

        // 1. Optimistic Update: Pehle UI mein message dikhao
        const tempMsg = {
            id: "temp-" + Date.now(),
            isTemp: true, // Flag to identify this is not from DB yet
            chatId: chat.chatId,
            senderId: currentUser.userId,
            content: draft,
            status: "SENDING", // Change status to sending
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempMsg]);
        const currentDraft = draft; // Store draft to clear it early
        setDraft("");

        try {
            // 2. API Call to Backend
            await sendMessage({
                chatId: chat.chatId,
                receiverId: chat.isGroup ? null : chat.receiverId,
                content: currentDraft,
                messageType: "TEXT",
                scheduled: false,
            });

            // Notifications (Optional)
            if (!chat.isGroup) {
                await createNotification({
                    userId: chat.receiverId,
                    message: currentDraft,
                });
            }
        } catch (err) {
            console.log("send error:", err);
            // Error handling: Remove temp message if send fails
            setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
            setDraft(currentDraft); // Give text back to user
        }
    };

    // ================= SCHEDULE =================
    const handleScheduleSend = async (date, time) => {
        if (!draft.trim()) return;

        const scheduledTime = new Date(`${date}T${time}`);

        try {
            await sendMessage({
                chatId: chat.chatId,
                receiverId: chat.isGroup ? null : chat.receiverId,
                content: draft,
                messageType: "TEXT",
                scheduled: true,
                scheduledTime,
            });

            setDraft("");
            setScheduleOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= UI =================
    return (
        <div className="flex h-full flex-1 flex-col bg-card">
            <ChatHeader chat={chat} />

            <Divider />

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
                {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                ))}
            </div>

            <div className="border-t p-3">
                <AISuggestions onPick={(t) => setDraft(t)} />

                <MessageInput
                    value={draft}
                    onChange={setDraft}
                    onSend={handleSend}
                    onOpenSchedule={() => setScheduleOpen(true)}
                    chat={chat}
                    currentUser={currentUser}
                />
            </div>

            <ScheduleModal
                open={scheduleOpen}
                preview={draft}
                onClose={() => setScheduleOpen(false)}
                onConfirm={handleScheduleSend}
            />
        </div>
    );
}
