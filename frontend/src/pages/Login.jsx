import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        phoneNumber: "",
        password: "",
    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,

            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = await loginUser(form);

            console.log("LOGIN RESPONSE:", data);

            if (!data?.token) {
                throw new Error("Token not found");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            navigate("/chat");
        } catch (err) {
            console.log("LOGIN ERROR:", err);
            setError("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
                    Chat Login
                </h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={handleChange}
                    />

                    <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
                        {loading ? "Logging..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    No account?
                    <Link
                        to="/register"
                        className="text-blue-600 ml-1 font-semibold"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
