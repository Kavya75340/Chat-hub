import { useEffect, useState } from "react";
import { searchUsers } from "../../api/userApi";
import { createChatRoom } from "../../api/chatApi";
import GroupModal from "./GroupModal";

export default function Sidebar({ setSelectedChat }) {
    const [users, setUsers] = useState([]);

    const [showGroupModal, setShowGroupModal] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadUsers();

        const interval = setInterval(
            loadUsers,

            3000
        );

        return () => clearInterval(interval);
    }, []);

    const loadUsers = async () => {
        try {
            const res = await searchUsers("");

            const currentUser = JSON.parse(localStorage.getItem("user"));

            const filtered = res.data.filter(
                (u) => u.id !== currentUser.userId
            );

            setUsers(filtered);
        } catch (err) {
            console.log(err);
        }
    };

    const openChat = async (receiverId) => {
        const res = await createChatRoom({
            senderId: currentUser.userId,

            receiverId,
        });

        setSelectedChat(res.data);
    };

    return (
        <div className="w-80 bg-white border-r flex flex-col">
            <div className="p-4 border-b flex justify-between">
                <span className="font-bold text-lg">
                    <img src="/logo.png" alt="" className="w-20" />
                </span>

                <button
                    onClick={() => setShowGroupModal(true)}
                    className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                >
                    Group
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => openChat(user.id)}
                        className="p-3 border-b cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                    >
                        {/* LEFT SIDE */}
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    user.status === "ONLINE"
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                }`}
                            />

                            <span className="font-medium">{user.name}</span>
                        </div>

                        {/* RIGHT SIDE */}
                        <span className="text-xs text-gray-400">
                            {user.status}
                        </span>
                    </div>
                ))}
            </div>

            {showGroupModal && (
                <GroupModal
                    users={users}
                    close={() => setShowGroupModal(false)}
                />
            )}
        </div>
    );
}
