import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
    });

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

            await registerUser(form);

            alert("Account created");

            navigate("/");
        } catch (err) {
            alert("Error creating account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-green-600">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        onChange={handleChange}
                    />

                    <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Already registered?
                    <Link to="/" className="text-green-600 ml-1 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
