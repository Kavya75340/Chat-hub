import { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { IconSidebar } from "./IconSidebar";
import { SlidePanel } from "./SlidePanel";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { Divider } from "@/components/ui/Divider";
import { searchUsers } from "@/api/userApi";
import { getMyGroups } from "@/api/groupApi";
import { createChatRoom } from "@/api/chatApi";
import GroupModal from "./GroupModal";
import { connectStatusSocket } from "../service/socketService";
// import { chats } from "@/components/chat/mockData";

export function FloatingLayout() {
    const [active, setActive] = useState("chat");
    const [panelOpen, setPanelOpen] = useState(true);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const socket = connectStatusSocket((msg) => {
            const [userId, status] = msg.split(":");

            // 🔥 update chats list
            setChats((prev) =>
                prev.map((c) =>
                    String(c.userId) === String(userId)
                        ? { ...c, online: status === "ONLINE" }
                        : c
                )
            );

            // 🔥 update active chat ALSO (IMPORTANT FIX)
            setActiveChat((prev) => {
                if (prev && String(prev.receiverId) === String(userId)) {
                    return { ...prev, online: status === "ONLINE" };
                }
                return prev;
            });
        });

        return () => socket.deactivate();
    }, []);

    // ================= LOAD CHATS =================
    const loadChats = async () => {
        try {
            // USERS
            const userRes = await searchUsers("");
            const userData = userRes.data.content || userRes.data;

            const users = userData
                .filter((u) => u.id !== currentUser.userId)
                .map((u) => ({
                    id: "u_" + u.id,
                    chatId: null,
                    name: u.name,
                    initials: u.name.slice(0, 2),
                    online: u.status === "ONLINE",
                    type: "USER",
                    userId: u.id,
                    unread: 0,
                }));

            // GROUPS
            const groupRes = await getMyGroups();
            const groups = groupRes.data.map((g) => ({
                id: "g_" + g.groupId,
                chatId: "group_" + g.groupId, // ✅ safe id
                name: g.name,
                initials: "GR",
                online: false,
                type: "GROUP",
                groupId: g.groupId,
                unread: 0,
            }));

            setChats([...groups, ...users]);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= INITIAL LOAD =================
    useEffect(() => {
        loadChats();
    }, []);

    // ================= SIDEBAR =================
    function handleSelect(key) {
        if (key === "chat") {
            setPanelOpen((o) => (active === "chat" ? !o : true));
        } else {
            setPanelOpen(false);
        }
        setActive(key);
    }

    // ================= UPDATE LAST MESSAGE =================
    const updateLastMessage = (chatId, content) => {
        setChats((prev) =>
            prev.map((c) =>
                c.chatId === chatId ? { ...c, lastMessage: content } : c
            )
        );
    };

    // ================= SELECT CHAT =================
    const handleSelectChat = async (chat) => {
        // USER CHAT
        if (chat.type === "USER") {
            let chatId = chat.chatId;

            // create only once
            if (!chatId) {
                const res = await createChatRoom({
                    senderId: currentUser.userId,
                    receiverId: chat.userId,
                });

                chatId = res.data.chatId;

                // update chats state
                setChats((prev) =>
                    prev.map((c) =>
                        c.userId === chat.userId ? { ...c, chatId } : c
                    )
                );
            }

            setActiveChat({
                chatId,
                receiverId: chat.userId,
                name: chat.name,
                online: chat.online,
                isGroup: false,
            });
        }

        // GROUP CHAT
        if (chat.type === "GROUP") {
            setActiveChat({
                chatId: chat.chatId, // already prefixed
                name: chat.name,
                online: false,
                isGroup: true,
            });
        }

        // reset unread
        setChats((prev) =>
            prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
        );
    };

    return (
        <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
            <div className="flex w-full max-w-full flex-col overflow-hidden rounded-3xl border border-border bg-card/80 shadow-floating backdrop-blur-xl h-screen">
                <TopBar />
                <Divider />

                <div className="flex flex-1 overflow-hidden">
                    <IconSidebar active={active} onSelect={handleSelect} />

                    <SlidePanel
                        open={panelOpen}
                        chats={chats}
                        activeChatId={activeChat?.chatId}
                        onSelect={handleSelectChat}
                        onClose={() => setPanelOpen(false)}
                        onCreateGroup={() => setShowGroupModal(true)}
                    />

                    <ChatContainer
                        chat={activeChat}
                        updateLastMessage={updateLastMessage}
                    />
                    {showGroupModal && (
                        <GroupModal
                            users={chats.filter((c) => c.type === "USER")}
                            close={() => setShowGroupModal(false)}
                            reload={loadChats}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
