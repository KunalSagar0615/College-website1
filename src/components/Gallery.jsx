import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8081/api/gallery";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);

    // ================= TOAST =================
    const [toast, setToast] = useState("");
    const [toastType, setToastType] = useState("success");

    const showToast = (msg, type = "success") => {
        setToast(msg);
        setToastType(type);

        setTimeout(() => {
            setToast("");
        }, 2500);
    };

    // ================= FETCH =================
    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API}/all`);
            setImages(res.data || []);
        } catch {
            showToast("Failed to load images ❌", "error");
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // ================= UPLOAD =================
    const upload = async () => {
        if (!file) {
            return showToast("Please select a file ⚠️", "warning");
        }

        const fd = new FormData();
        fd.append("file", file);

        try {
            await axios.post(`${API}/upload`, fd);

            setFile(null);
            fetchImages();

            showToast("Image uploaded successfully 📷", "success");
        } catch {
            showToast("Upload failed ❌", "error");
        }
    };

    // ================= DELETE =================
    const remove = async (id) => {
        try {
            await axios.delete(`${API}/delete/${id}`);

            fetchImages();
            showToast("Image deleted successfully 🗑️", "success");
        } catch {
            showToast("Delete failed ❌", "error");
        }
    };

    return (
        <div className="relative">

            {/* ================= TOAST ================= */}
            {toast && (
                <div
                    className={`fixed top-20 right-5 px-4 py-3 text-white rounded-lg shadow-xl
                    z-[9999] transition-all duration-300
                    ${toastType === "success" && "bg-green-600"}
                    ${toastType === "error" && "bg-red-500"}
                    ${toastType === "warning" && "bg-yellow-500"}
                    ${toastType === "info" && "bg-blue-500"}
                `}
                >
                    {toast}
                </div>
            )}

            <h2 className="text-xl font-bold mb-4">Gallery</h2>

            {/* UPLOAD SECTION */}
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2"
                />

                <button
                    onClick={upload}
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                    Upload
                </button>
            </div>

            {/* IMAGE GRID */}
            <div className="grid md:grid-cols-3 gap-4 mt-4">
                {images.map((img) => (
                    <div key={img.id} className="bg-white p-2 shadow rounded">

                        <img
                            src={`${API}/image/${img.id}`}
                            className="h-40 w-full object-cover rounded"
                        />

                        <button
                            onClick={() => remove(img.id)}
                            className="bg-red-500 text-white w-full mt-2 py-1 rounded"
                        >
                            Delete
                        </button>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default Gallery;