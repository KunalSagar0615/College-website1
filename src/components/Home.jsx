import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import img1 from "../assets/hero0.avif";

const Home = () => {

    const [notices, setNotices] = useState([]);
    const [images, setImages] = useState([]);

    const [selectedImage, setSelectedImage] =
        useState(null);

    const [showGap, setShowGap] =
        useState(false);

    // ================= FETCH NOTICES =================
    const fetchNotices = async () => {

        try {

            const res = await axios.get(
                "http://localhost:8081/api/notifications/all"
            );

            setNotices(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        } catch (err) {

            console.error(err);

            setNotices([]);
        }
    };

    // ================= FETCH GALLERY =================
    const fetchImages = async () => {

        try {

            const res = await axios.get(
                "http://localhost:8081/api/gallery/all"
            );

            setImages(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        } catch (err) {

            console.error(err);
        }
    };

    // ================= LOAD =================
    useEffect(() => {

        fetchNotices();

        fetchImages();

    }, []);

    // ================= SUBMIT ENQUIRY =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        const f = e.target;

        const enquiryData = {

            name: f.name.value,

            address: f.address.value,

            mobile: f.mobile.value,

            email: f.email.value,

            dob: f.dob.value,

            qualification: f.qualification.value,

            // 🔥 NEW
            course: f.course.value,

            enquiryYear: f.enquiryYear.value,

            marks: f.marks.value,

            passoutYear: f.passoutYear.value,

            yearGap: f.yeargap.value,

            gapYears: f.gapYears?.value || 0,

            goals: f.goals.value
        };

        try {

            await axios.post(
                "http://localhost:8081/api/enquiry/add",
                enquiryData
            );

            alert("Enquiry Submitted Successfully ✅");

            f.reset();

            setShowGap(false);

        } catch (err) {

            console.log(err);

            alert("Failed To Submit ❌");
        }
    };

    return (

        <div className="font-sans text-gray-800">

            {/* ================= NOTICES ================= */}
            <section className="px-4 sm:px-6 py-6 bg-white">

                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
                    Latest Notices
                </h2>

                <div className="max-w-5xl mx-auto bg-yellow-100 rounded-lg shadow px-3 py-2 overflow-hidden">

                    {notices.length > 0 ? (

                        <div className="whitespace-nowrap">

                            <div className="inline-block animate-marquee text-sm sm:text-base font-medium">

                                {notices.map((n) => (

                                    <span
                                        key={n.id}
                                        className="mr-10"
                                    >
                                        🔔 {n.title} - {n.message}
                                    </span>

                                ))}

                            </div>

                        </div>

                    ) : (

                        <p className="text-center text-gray-500">
                            No notices
                        </p>
                    )}

                </div>

                <style>{`

                    .animate-marquee {
                        display: inline-block;
                        animation: marquee 18s linear infinite;
                    }

                    @keyframes marquee {

                        0% {
                            transform: translateX(100%);
                        }

                        100% {
                            transform: translateX(-100%);
                        }
                    }

                `}</style>

            </section>

            {/* ================= HERO ================= */}
            <section className="relative h-[60vh] sm:h-[75vh] md:h-[90vh] w-full">

                <img
                    src={img1}
                    alt="hero"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-4">

                    <div className="text-center text-white max-w-3xl">

                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                            Zeal Education Society
                            <br />
                            Pune | Sangli | India
                        </h1>

                        <p className="mt-3 text-sm sm:text-lg md:text-xl text-gray-200">
                            Shape Your Future With Us
                        </p>

                        <Link to="/login">

                            <button className="mt-5 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded">
                                LOGIN
                            </button>

                        </Link>

                    </div>

                </div>

            </section>

            {/* ================= ENQUIRY ================= */}
            <section className="px-4 sm:px-6 py-10 bg-gray-50">

                <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
                    Admission Enquiry
                </h2>

                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow">

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >

                        <input
                            name="name"
                            required
                            placeholder="Student Name"
                            className="p-2 border rounded w-full"
                        />

                        <input
                            name="address"
                            placeholder="Address"
                            className="p-2 border rounded w-full"
                        />

                        <input
                            name="mobile"
                            required
                            placeholder="Mobile"
                            className="p-2 border rounded w-full"
                        />

                        <input
                            name="email"
                            placeholder="Email"
                            className="p-2 border rounded w-full"
                        />

                        <input
                            type="date"
                            name="dob"
                            className="p-2 border rounded w-full"
                        />

                        <input
                            name="qualification"
                            placeholder="Qualification"
                            className="p-2 border rounded w-full"
                        />

                        {/* 🔥 COURSE */}
                        <select
                            name="course"
                            required
                            className="p-2 border rounded w-full"
                        >

                            <option value="">
                                Select Course
                            </option>

                            <option value="BCA">
                                BCA
                            </option>

                            <option value="MCA">
                                MCA
                            </option>

                            <option value="MBA">
                                MBA
                            </option>

                            <option value="BBA">
                                BBA
                            </option>

                        </select>

                        {/* 🔥 ENQUIRY YEAR */}
                        <select
                            name="enquiryYear"
                            required
                            className="p-2 border rounded w-full"
                        >

                            <option value="">
                                Select Admission Year
                            </option>

                            {Array.from(
                                { length: 10 },
                                (_, i) => new Date().getFullYear() + i
                            ).map((year) => (

                                <option
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </option>
                            ))}

                        </select>

                        <input
                            type="number"
                            name="marks"
                            placeholder="Marks (%)"
                            className="p-2 border rounded w-full"
                        />

                        <input
                            type="number"
                            name="passoutYear"
                            placeholder="Passout Year"
                            className="p-2 border rounded w-full"
                        />

                        {/* YEAR GAP */}
                        <div className="flex items-center gap-4 md:col-span-2">

                            <label className="font-medium">
                                Year Gap:
                            </label>

                            <label>

                                <input
                                    type="radio"
                                    name="yeargap"
                                    value="Yes"
                                    required
                                    onChange={() =>
                                        setShowGap(true)
                                    }
                                />{" "}

                                Yes

                            </label>

                            <label>

                                <input
                                    type="radio"
                                    name="yeargap"
                                    value="No"
                                    onChange={() =>
                                        setShowGap(false)
                                    }
                                />{" "}

                                No

                            </label>

                        </div>

                        {/* GAP YEARS */}
                        {showGap && (

                            <input
                                type="number"
                                name="gapYears"
                                placeholder="Gap (Years)"
                                className="p-2 border rounded w-full md:col-span-2"
                            />
                        )}

                        <textarea
                            name="goals"
                            placeholder="Future Goals"
                            className="p-2 border rounded w-full md:col-span-2"
                        />

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="md:col-span-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold"
                        >

                            <span className="font-bold text-2xl">
                                Submit
                            </span>

                            <br />

                            We will connect you as soon as possible

                        </button>

                    </form>

                </div>

            </section>

            {/* ================= GALLERY ================= */}
            <section className="px-4 sm:px-6 py-10 bg-white">

                <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
                    Campus Gallery
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-6xl mx-auto">

                    {images.length > 0 ? (

                        images.map((img) => {

                            const imgUrl =
                                `http://localhost:8081/api/gallery/image/${img.id}`;

                            return (

                                <div
                                    key={img.id}
                                    className="bg-white rounded-lg shadow p-2"
                                >

                                    {img.type === "application/pdf" ? (

                                        <a
                                            href={imgUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View PDF
                                        </a>

                                    ) : (

                                        <img
                                            src={imgUrl}
                                            alt="gallery"
                                            onClick={() =>
                                                setSelectedImage(imgUrl)
                                            }
                                            className="w-full h-48 object-cover rounded cursor-pointer"
                                        />
                                    )}

                                </div>
                            );
                        })

                    ) : (

                        <p className="text-center col-span-3 text-gray-500">
                            No images found
                        </p>
                    )}

                </div>

            </section>

            {/* ================= IMAGE POPUP ================= */}
            {selectedImage && (

                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

                    <button
                        onClick={() =>
                            setSelectedImage(null)
                        }
                        className="absolute top-5 right-5 text-white text-3xl"
                    >
                        ✖
                    </button>

                    <img
                        src={selectedImage}
                        alt="preview"
                        className="max-w-full max-h-[85vh] object-contain"
                    />

                </div>
            )}

        </div>
    );
};

export default Home;