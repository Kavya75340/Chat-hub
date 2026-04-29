import { useState } from "react";
import { createGroup } from "@/api/groupApi";

export default function GroupModal({ users, close, reload }) {
    const [name, setName] = useState("");
    const [selected, setSelected] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const toggleUser = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!name || selected.length === 0) return;

        await createGroup({
            name,
            description: "group",
            createdBy: currentUser.userId,
            members: selected,
        });

        reload(); // chats reload
        close();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4 rounded w-80">
                <h2>Create Group</h2>

                <input
                    placeholder="Group name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border w-full p-2 mb-2"
                />

                <div className="max-h-40 overflow-y-auto">
                    {users.map((u) => (
                        <div key={u.id}>
                            <input
                                type="checkbox"
                                onChange={() => toggleUser(u.id)}
                            />
                            {u.name}
                        </div>
                    ))}
                </div>

                <button onClick={handleCreate}>Create</button>

                <button onClick={close}>Cancel</button>
            </div>
        </div>
    );
}
