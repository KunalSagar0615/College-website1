import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import Dashboard from "./Dashboard.jsx";
import Students from "./Students.jsx";
import Notifications from "./Notifications.jsx";
import Gallery from "./Gallery.jsx";
import Report from "./Report.jsx";
import Enquiry from "./Enquiry.jsx";
import ContactReport from "./ContactReport.jsx";
import FeesReport from "./FeesReport.jsx";
import ComplaintReport from "./ComplaintReport.jsx"


const Admin = () => {

    const navigate = useNavigate();

    const [activeTab, setActiveTab] =
        useState("dashboard");

    // ================= ADMIN AUTH CHECK =================
    useEffect(() => {

        const admin =
            JSON.parse(localStorage.getItem("admin"));

        // 🔥 IF ADMIN NOT LOGGED IN
        if (!admin) {

            alert("Please Login As Admin ❌");

            navigate("/login");
        }

    }, [navigate]);

    // ================= RENDER COMPONENT =================
    const renderComponent = () => {

        switch (activeTab) {

            case "dashboard":
                return <Dashboard />;

            case "students":
                return <Students />;

            case "notifications":
                return <Notifications />;

            case "gallery":
                return <Gallery />;

            case "report":
                return <Report />;

            case "enquiry":
                return <Enquiry />;

            case "contact":
                return <ContactReport />;

            case "fees":
                return <FeesReport />;
            case "ComplaintReport":
                return <ComplaintReport/>

            default:
                return <Dashboard />;
        }
    };

    return (

        <div className="flex bg-gray-100 min-h-screen">

            {/* SIDEBAR */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* MAIN CONTENT */}
            <main
                className="
                    flex-1
                    lg:ml-60
                    mt-16
                    p-3 sm:p-4 md:p-6
                    overflow-y-auto
                    min-h-[calc(100vh-4rem)]
                    w-full
                "
            >

                <div
                    className="
                        bg-white
                        p-4 sm:p-5 md:p-6
                        rounded-2xl
                        shadow-md
                        min-h-full
                    "
                >

                    {renderComponent()}

                </div>

            </main>

        </div>
    );
};

export default Admin;