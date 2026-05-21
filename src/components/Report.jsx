import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = "http://localhost:8081/api";

const Report = () => {

    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);

    const [selectedDate, setSelectedDate] = useState("");
    const [showReport, setShowReport] = useState(false);

    const logRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    // ================= FETCH =================
    const fetchData = async () => {

        try {

            const res =
                await axios.get(`${API}/reports/dashboard`);

            setLogs(res.data.logs || []);

        } catch (err) {

            console.log(err);
        }
    };

    // ================= GENERATE REPORT =================
    const generateReport = () => {

        if (!selectedDate) {
            alert("Select date");
            return;
        }

        const filtered = logs.filter((l) => {

            const logDate =
                new Date(l.loginTime)
                    .toISOString()
                    .slice(0, 10);

            return logDate === selectedDate;
        });

        setFilteredLogs(filtered);

        setShowReport(true);
    };

    // ================= DELETE =================
    const deleteLog = async (id) => {

        if (!window.confirm("Delete this log?")) return;

        try {

            await axios.delete(`${API}/logs/${id}`);

            setFilteredLogs((prev) =>
                prev.filter((l) => l.id !== id)
            );

            setLogs((prev) =>
                prev.filter((l) => l.id !== id)
            );

        } catch (err) {

            console.log(err);

            alert("Delete failed ❌");
        }
    };

    // ================= PRINT =================
    const handlePrint = () => {

        const content =
            logRef.current.innerHTML;

        const win =
            window.open("", "", "width=900,height=700");

        win.document.write(`
            <html>
                <head>

                    <title>Login Report</title>

                    <style>

                        body {
                            font-family: Arial;
                            padding:20px;
                        }

                        h1 {
                            text-align:center;
                        }

                        table {
                            width:100%;
                            border-collapse: collapse;
                        }

                        th,td {
                            border:1px solid #ccc;
                            padding:8px;
                            text-align:center;
                        }

                    </style>

                </head>

                <body>

                    <h1>
                        🔐 Login Activity Report
                    </h1>

                    ${content}

                </body>

            </html>
        `);

        win.document.close();

        win.print();
    };

    // ================= PDF =================
    const handleDownload = async () => {

        const canvas =
            await html2canvas(logRef.current, {
                scale: 2
            });

        const img =
            canvas.toDataURL("image/png");

        const pdf =
            new jsPDF("p", "mm", "a4");

        pdf.text("Login Activity Report", 60, 10);

        pdf.addImage(img, "PNG", 10, 20, 190, 0);

        pdf.save("login-report.pdf");
    };

    return (

        <div className="min-h-screen bg-gray-100 p-6 pt-24">

            <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
                🔐 Login Activity Dashboard
            </h1>

            {/* DATE FILTER */}
            <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-4 items-end">

                <div>

                    <label className="block text-sm font-medium mb-1">
                        Select Date
                    </label>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) =>
                            setSelectedDate(e.target.value)
                        }
                        className="border p-2 rounded"
                    />

                </div>

                <button
                    onClick={generateReport}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Generate Report
                </button>

            </div>

            {/* REPORT */}
            {showReport && (

                <div className="bg-white p-6 rounded-xl shadow">

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-2 mb-4">

                        <button
                            onClick={handlePrint}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Print
                        </button>

                        <button
                            onClick={handleDownload}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                            PDF
                        </button>

                    </div>

                    {/* TABLE */}
                    <div
                        ref={logRef}
                        className="overflow-x-auto"
                    >

                        <table className="w-full border text-sm text-center">

                            <thead className="bg-gray-200">

                                <tr>

                                    <th className="border p-2">
                                        User
                                    </th>

                                    <th className="border p-2">
                                        Role
                                    </th>

                                    <th className="border p-2">
                                        Status
                                    </th>

                                    <th className="border p-2">
                                        Login Time
                                    </th>

                                    <th className="border p-2">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredLogs.length > 0 ? (

                                    filteredLogs.map((l) => (

                                        <tr key={l.id}>

                                            <td className="border p-2">
                                                {l.userEmail}
                                            </td>

                                            <td className="border p-2">
                                                {l.role}
                                            </td>

                                            <td className="border p-2">
                                                {l.logoutTime
                                                    ? "Logged Out"
                                                    : "Active"}
                                            </td>

                                            <td className="border p-2">
                                                {new Date(
                                                    l.loginTime
                                                ).toLocaleString()}
                                            </td>

                                            <td className="border p-2">

                                                <button
                                                    onClick={() =>
                                                        deleteLog(l.id)
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>
                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="p-4 text-gray-500"
                                        >
                                            No data found for selected date
                                        </td>

                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Report;