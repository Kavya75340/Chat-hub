import { useState } from "react";

export default function MessageInput() {
    const [text, setText] = useState("");

    const send = () => {
        console.log(text);
    };

    return (
        <div>
            <input value={text} onChange={(e) => setText(e.target.value)} />

            <button onClick={send}>send</button>
        </div>
    );
}
