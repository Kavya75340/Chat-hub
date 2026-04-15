import { useState } from "react";

import Register from "./Register";

import Chat from "./Chat";

import Login from "./Login";

const Home = () => {
    const [page, setPage] = useState("login");

    if (page === "register") {
        return <Register setPage={setPage} />;
    }

    if (page === "chat") {
        return <Chat />;
    }

    return <Login setPage={setPage} />;
};

export default Home;
