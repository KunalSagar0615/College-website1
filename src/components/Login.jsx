import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const API = "http://localhost:8081/api";

const Login = () => {

    const navigate = useNavigate();

    const { setUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: ""
    });

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ================= VALIDATION =================
    const validate = () => {

        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email required";
        }

        if (!formData.password) {
            newErrors.password = "Password required";
        }

        if (!formData.role) {
            newErrors.role = "Select role";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ================= LOGIN =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            setLoading(true);

            // 🔥 ADMIN LOGIN
            let url = "";

            if (formData.role === "ADMIN") {

                url = `${API}/admin/login`;

            } else {

                // 🔥 STUDENT LOGIN
                url = `${API}/users/login`;
            }

            const res = await axios.post(url, {
                email: formData.email,
                password: formData.password
            });

            const userData = res.data;

            // ❌ INVALID RESPONSE
            if (!userData || typeof userData !== "object") {

                alert("Invalid Email or Password ❌");

                return;
            }

            // ✅ SAVE LOGIN
            setUser(userData);

            // 🔥 ADMIN STORAGE
            if (formData.role === "ADMIN") {

                localStorage.setItem(
                    "admin",
                    JSON.stringify(userData)
                );

                alert("Admin Login Successful ✅");

                navigate("/admin");

            } else {

                // 🔥 STUDENT STORAGE
                localStorage.setItem(
                    "user",
                    JSON.stringify(userData)
                );

                alert("Student Login Successful ✅");

                navigate("/student");
            }

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            if (error.response?.status === 401) {

                alert("Invalid Credentials ❌");

            } else {

                alert("Server Error ❌ Try again later");
            }

        } finally {

            setLoading(false);
        }
    };

    // ================= UI =================
    return (

        <section className="flex justify-center items-center min-h-screen bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-lg w-96">

                <h2 className="text-2xl font-bold text-center mb-6">
                    🔐 Login Portal
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        className="w-full border p-2 mb-2 rounded"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    {errors.email && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.email}
                        </p>
                    )}

                    {/* PASSWORD */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        className="w-full border p-2 mb-2 rounded"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {errors.password && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.password}
                        </p>
                    )}

                    {/* ROLE */}
                    <select
                        name="role"
                        className="w-full border p-2 mb-2 rounded"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Role
                        </option>

                        <option value="STUDENT">
                            Student
                        </option>

                        <option value="ADMIN">
                            College Admin
                        </option>

                    </select>

                    {errors.role && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.role}
                        </p>
                    )}

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"
                        }
                    </button>

                    {/* REGISTER */}
                    <Link
                        to="/register"
                        className="block text-center mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                    >
                        Create Account
                    </Link>

                </form>

            </div>

        </section>
    );
};

export default Login;