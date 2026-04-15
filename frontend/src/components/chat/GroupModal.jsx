import { useState } from "react";
import { createGroup } from "../../api/groupService";

export default function GroupModal({ users, close }) {
    const [name, setName] = useState("");

    const [selected, setSelected] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const toggleUser = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        await createGroup({
            name,

            description: "",

            groupImage: "",

            createdBy: currentUser.userId,

            members: selected,
        });

        close();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4 rounded w-80">
                <h2 className="font-bold mb-2">Create Group</h2>

                <input
                    placeholder="Group name"
                    className="border w-full p-2 mb-2"
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="max-h-40 overflow-y-auto">
                    {users.map((u) => (
                        <div key={u.id} className="flex gap-2">
                            <input
                                type="checkbox"
                                onChange={() => toggleUser(u.id)}
                            />

                            {u.name}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
                >
                    Create
                </button>
            </div>
        </div>
    );
}
