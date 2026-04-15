import { uploadFile } from "../../api/fileApi";
import { sendMessage } from "../../api/messageApi";

export default function FileUpload({ chat }) {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const getMessageType = (file) => {
        if (file.type.startsWith("image")) return "IMAGE";

        if (file.type.startsWith("video")) return "VIDEO";

        if (file.type.startsWith("audio")) return "AUDIO";

        return "DOCUMENT";
    };

    const handleFile = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            const res = await uploadFile(file, chat.chatId, currentUser.userId);

            const receiverId =
                chat.senderId === currentUser.userId
                    ? chat.receiverId
                    : chat.senderId;

            await sendMessage({
                chatId: chat.chatId,

                senderId: currentUser.userId,

                receiverId: receiverId,

                content: res.data.fileUrl,

                messageType: getMessageType(file),
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <label className="cursor-pointer bg-gray-200 px-3 rounded flex items-center">
            📎
            <input
                type="file"
                hidden
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFile}
            />
        </label>
    );
}
