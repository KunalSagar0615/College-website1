import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        role: "STUDENT",
        course: "",
        password: "",
        rollNumber: "",
        year: "",
        division: ""
    });

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {

        let { name, value } = e.target;

        if (["course", "division", "year", "rollNumber"].includes(name)) {
            value = value.trim();
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // ================= VALIDATION =================
    const validate = () => {

        const {
            name,
            email,
            mobile,
            course,
            password,
            role,
            rollNumber,
            year,
            division
        } = formData;

        if (!name || !email || !mobile || !password) {
            alert("All fields are required ❌");
            return false;
        }

        // 🔥 STUDENT VALIDATION
        if (role === "STUDENT") {

            if (!course || !rollNumber || !year || !division) {

                alert("Course, Roll Number, Year & Division required ❌");

                return false;
            }
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!email.match(emailPattern)) {
            alert("Invalid Email ❌");
            return false;
        }

        const mobilePattern = /^[0-9]{10}$/;

        if (!mobile.match(mobilePattern)) {
            alert("Mobile must be 10 digits ❌");
            return false;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters ❌");
            return false;
        }

        return true;
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            let url = "";

            // 🔥 ADMIN REGISTER
            if (formData.role === "ADMIN") {

                url = "http://localhost:8081/api/admin/register";

            } else {

                // 🔥 STUDENT REGISTER
                url = "http://localhost:8081/api/users/register";
            }

            const payload = {
                ...formData,
                course: formData.course?.trim().toUpperCase() || "",
                division: formData.division?.trim().toUpperCase() || "",
                year: formData.year?.trim() || "",
                rollNumber: formData.rollNumber?.trim() || ""
            };

            await axios.post(url, payload);

            alert("Registration Successful ✅");

            setFormData({
                name: "",
                email: "",
                mobile: "",
                role: "STUDENT",
                course: "",
                password: "",
                rollNumber: "",
                year: "",
                division: ""
            });

            navigate("/login");

        } catch (error) {

            const msg = error.response?.data || "";

            if (msg.includes("Roll")) {

                alert("⚠️ Roll Number already exists in this Course, Division & Year");

            } else if (msg.includes("Email")) {

                alert("⚠️ Email already registered");

            } else {

                alert(msg || "Registration Failed ❌");
            }
        }
    };

    return (

        <section className="flex justify-center items-center min-h-screen bg-gray-100 mt-10">

            <div className="bg-white p-8 rounded w-96 shadow-md">

                <h2 className="text-xl font-bold mb-4 text-center">
                    Registration
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        name="name"
                        value={formData.name}
                        placeholder="Name"
                        className="border p-2 w-full mb-2 rounded"
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        className="border p-2 w-full mb-2 rounded"
                        onChange={handleChange}
                    />

                    <input
                        name="mobile"
                        value={formData.mobile}
                        placeholder="Mobile"
                        className="border p-2 w-full mb-2 rounded"
                        onChange={handleChange}
                    />

                    {/* ROLE */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2 rounded"
                    >
                        <option value="STUDENT">Student</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    {/* STUDENT ONLY */}
                    {formData.role === "STUDENT" && (
                        <>

                            {/* COURSE */}
                            <select
                                name="course"
                                value={formData.course || ""}
                                onChange={handleChange}
                                className="border p-2 w-full mb-2 rounded"
                            >
                                <option value="">Select Course</option>
                                <option value="MCA">MCA</option>
                                <option value="MBA">MBA</option>
                                <option value="BCA">BCA</option>
                            </select>

                            {/* ROLL */}
                            <input
                                name="rollNumber"
                                value={formData.rollNumber}
                                placeholder="Roll Number"
                                className="border p-2 w-full mb-2 rounded"
                                onChange={handleChange}
                            />

                            {/* YEAR */}
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="border p-2 w-full mb-2 rounded"
                            >
                                <option value="">Select Year</option>
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                            </select>

                            {/* DIVISION */}
                            <select
                                name="division"
                                value={formData.division}
                                onChange={handleChange}
                                className="border p-2 w-full mb-2 rounded"
                            >
                                <option value="">Select Division</option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                                <option>D</option>
                            </select>

                        </>
                    )}

                    {/* PASSWORD */}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        className="border p-2 w-full mb-2 rounded"
                        onChange={handleChange}
                    />

                    <button className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded">
                        Register
                    </button>

                </form>

            </div>

        </section>
    );
};

export default Register;