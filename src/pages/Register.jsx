import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { registerUser } from "../store/slices/authSlice";

const Register = () => {
    const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.username || !credentials.email || !credentials.password) {
            toast.error("Please fill all feilds");
            return;
        }

        await toast.promise(
            dispatch(registerUser(credentials)),
            {
                loading: "Signing in...",
                success: (res) => {
                    if (res.payload?.token) {
                        navigate("/home");
                        return "Sign in successful!";
                    } else {
                        throw new Error(res.payload || "Sign in failed");
                    }
                },
                error: (err) => err.message || "Sign in failed",
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white px-4">
            <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">Create account</h2>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        type="text"
                        name="username"
                        placeholder="Name"
                        value={credentials.username}
                        onChange={handleChange}
                        className="p-2 rounded bg-[#2a2a2a] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {/* Email Input */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        className="p-2 rounded bg-[#2a2a2a] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {/* Password Input */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="p-2 rounded bg-[#2a2a2a] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline font-medium">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;