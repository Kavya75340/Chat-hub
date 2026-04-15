export default function MessageBubble({ message, own }) {
    const fileUrl = `http://localhost:8080${message.content}`;

    return (
        <div className={`flex ${own ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                    own ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
            >
                {/* TEXT */}
                {message.messageType === "TEXT" && (
                    <span>{message.content}</span>
                )}

                {/* IMAGE */}
                {message.messageType === "IMAGE" && (
                    <img
                        src={fileUrl}
                        alt="img"
                        className="max-w-[200px] rounded"
                    />
                )}

                {/* VIDEO */}
                {message.messageType === "VIDEO" && (
                    <video controls className="max-w-[220px] rounded">
                        <source src={fileUrl} />
                    </video>
                )}

                {/* AUDIO */}
                {message.messageType === "AUDIO" && (
                    <audio controls>
                        <source src={fileUrl} />
                    </audio>
                )}

                {/* DOCUMENT */}
                {message.messageType === "DOCUMENT" && (
                    <a
                        href={`http://localhost:8080${message.content}`}
                        target="_blank"
                        className="underline"
                    >
                        📄 Open File
                    </a>
                )}

                {/* TIME */}
                <div className="text-[10px] opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
}
