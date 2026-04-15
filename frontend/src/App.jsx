import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChatPage from "./components/chat/ChatPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<ChatPage />} />
        </Routes>
    );
}
