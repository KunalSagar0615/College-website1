import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Menu,
    X
} from "lucide-react";

const Sidebar = ({
    activeTab,
    setActiveTab
}) => {

    const navigate = useNavigate();

    const [open, setOpen] =
        useState(false);

    const menu = [

        { key: "dashboard", label: "📊 Dashboard" },

        { key: "students", label: "🎓 Students" },

        { key: "notifications", label: "📢 Notifications" },

        { key: "gallery", label: "🖼️ Gallery" },

        { key: "report", label: "🔐 Login Activity" },

        { key: "enquiry", label: "📝 Admission Enquiry" },

        { key: "contact", label: "📩 Contact Us" },

        { key: "fees", label: "💰 Fees Report" },
        { key: "ComplaintReport", label:" ⚠️Complaint Report" }
    ];

    // ================= LOGOUT =================
    const handleLogout = async () => {

        try {

            const logId =
                localStorage.getItem("logId");

            if (logId) {

                await axios.put(
                    `http://localhost:8081/api/logs/logout/${logId}`
                );
            }

            localStorage.removeItem("user");

            localStorage.removeItem("logId");

            alert("Logged out successfully ✅");

            navigate("/login");

        } catch (err) {

            console.log(err);

            alert("Logout failed ❌");
        }
    };

    return (

        <>

            {/* MOBILE TOPBAR */}
            <div className="lg:hidden fixed top-16 left-0 right-0 z-50 bg-blue-950 text-white flex items-center justify-between px-4 py-3 shadow-md">

                <h2 className="text-lg font-bold">
                    Admin Panel
                </h2>

                <button
                    onClick={() =>
                        setOpen(!open)
                    }
                >

                    {open
                        ? <X size={28} />
                        : <Menu size={28} />
                    }

                </button>

            </div>

            {/* OVERLAY */}
            {open && (

                <div
                    onClick={() =>
                        setOpen(false)
                    }
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-16 left-0 z-50
                    h-[calc(100vh-4rem)]
                    w-64 bg-blue-950 text-white
                    shadow-2xl flex flex-col justify-between
                    transition-transform duration-300

                    ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >

                {/* MENU */}
                <div className="p-4 overflow-y-auto">

                    <h2 className="text-2xl font-bold mb-6 border-b border-blue-800 pb-3">
                        Admin Panel
                    </h2>

                    <div className="space-y-2">

                        {menu.map((item) => (

                            <button
                                key={item.key}
                                onClick={() => {

                                    setActiveTab(item.key);

                                    setOpen(false);
                                }}
                                className={`
                                    w-full text-left px-4 py-3 rounded-xl
                                    transition-all duration-200 font-medium

                                    ${activeTab === item.key
                                        ? "bg-white text-blue-950 shadow-md"
                                        : "hover:bg-blue-800"
                                    }
                                `}
                            >

                                {item.label}

                            </button>
                        ))}

                    </div>

                </div>

                {/* LOGOUT */}
                <div className="p-4 border-t border-blue-800">

                    <button
                        onClick={handleLogout}
                        className="
                            w-full bg-red-600 hover:bg-red-700
                            text-white py-3 rounded-xl
                            font-semibold transition-all
                        "
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>

        </>
    );
};

export default Sidebar;