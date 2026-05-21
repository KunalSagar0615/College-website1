import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API = "http://localhost:8081/api/notifications";

const Notifications = () => {

    // ================= STATE =================
    const [list, setList] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);

    const [search, setSearch] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [activeTab, setActiveTab] = useState("manage");

    // ================= FETCH =================
    const fetchNotifications = async () => {

        try {

            const res = await axios.get(`${API}/all`);

            setList(res.data || []);
            setFiltered(res.data || []);

        } catch (err) {

            console.log("Failed To Load Notifications");
        }
    };

    useEffect(() => {

        fetchNotifications();

    }, []);

    // ================= FILTER =================
    useEffect(() => {

        let data = [...list];

        // SEARCH
        if (search) {

            data = data.filter((n) =>
                n.title?.toLowerCase().includes(search.toLowerCase()) ||
                n.message?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // DATE FILTER
        if (fromDate && toDate) {

            data = data.filter((n) => {

                const date = n.createdAt?.slice(0, 10);

                return date >= fromDate && date <= toDate;
            });
        }

        setFiltered(data);

    }, [search, fromDate, toDate, list]);

    // ================= SUBMIT =================
    const handleSubmit = async () => {

        if (!title || !message) {
            return alert("Fill all fields ❌");
        }

        try {

            if (editId) {

                await axios.put(`${API}/update/${editId}`, {
                    title,
                    message
                });

                alert("Notification Updated ✅");

            } else {

                await axios.post(`${API}/add`, {
                    title,
                    message
                });

                alert("Notification Added ✅");
            }

            setTitle("");
            setMessage("");
            setEditId(null);

            fetchNotifications();

        } catch (err) {

            alert("Operation Failed ❌");
        }
    };

    // ================= EDIT =================
    const handleEdit = (n) => {

        setTitle(n.title);
        setMessage(n.message);
        setEditId(n.id);
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm("Delete Notification ?");

        if (!confirmDelete) return;

        try {

            await axios.delete(`${API}/delete/${id}`);

            alert("Notification Deleted ✅");

            fetchNotifications();

        } catch (err) {

            alert("Delete Failed ❌");
        }
    };

    // ================= PRINT =================
    const printReport = () => {

        const content =
            document.getElementById("report").outerHTML;

        const win =
            window.open("", "", "width=900,height=650");

        win.document.write(`
            <html>
                <head>
                    <title>Notification Report</title>

                    <style>
                        body {
                            font-family: Arial;
                            padding:20px;
                        }

                        table {
                            width:100%;
                            border-collapse:collapse;
                        }

                        th,td {
                            border:1px solid #ccc;
                            padding:10px;
                            text-align:center;
                        }
                    </style>

                </head>

                <body>

                    <h2>Notification Report</h2>

                    ${content}

                </body>
            </html>
        `);

        win.document.close();

        win.print();
    };

    // ================= PDF =================
    const downloadPDF = () => {

        const doc = new jsPDF();

        const tableData = filtered.map((n) => [
            n.title,
            n.message,
            n.createdAt?.slice(0, 10)
        ]);

        autoTable(doc, {
            head: [["Title", "Message", "Date"]],
            body: tableData,
        });

        doc.save("notification-report.pdf");
    };

    return (

        <div className="p-6">

            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-4">
                🔔 Notice
            </h2>

            {/* TABS */}
            <div className="flex gap-3 mb-4">

                <button
                    onClick={() => setActiveTab("manage")}
                    className={`px-4 py-2 rounded ${activeTab === "manage"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    Manage
                </button>

                <button
                    onClick={() => setActiveTab("report")}
                    className={`px-4 py-2 rounded ${activeTab === "report"
                        ? "bg-red-600 text-white"
                        : "bg-red-400 text-white"
                        }`}
                >
                    Report
                </button>

            </div>

            {/* ================= MANAGE ================= */}
            {activeTab === "manage" && (
                <>

                    {/* FORM */}
                    <div className="bg-white p-4 rounded-xl shadow mb-4 space-y-2">

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Title"
                            className="border p-2 w-full rounded"
                        />

                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter Message"
                            className="border p-2 w-full rounded"
                        />

                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            {editId
                                ? "Update Notification"
                                : "Add Notification"}
                        </button>

                    </div>

                    {/* LIST */}
                    <div className="space-y-2">

                        {list.map((n) => (

                            <div
                                key={n.id}
                                className="bg-white p-3 rounded shadow flex justify-between items-center"
                            >

                                <span>
                                    <b>{n.title}</b> - {n.message}
                                </span>

                                <div className="space-x-2">

                                    <button
                                        onClick={() => handleEdit(n)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(n.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </>
            )}

            {/* ================= REPORT ================= */}
            {activeTab === "report" && (

                <div className="bg-white p-5 rounded-xl shadow">

                    {/* FILTER */}
                    <div className="flex gap-2 mb-4 items-center">

                        <input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-2 rounded w-full"
                        />

                        {/* FROM */}
                        <div className="flex items-center gap-1">

                            <span className="text-sm">From</span>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border p-2 rounded"
                            />

                        </div>

                        {/* TO */}
                        <div className="flex items-center gap-1">

                            <span className="text-sm">To</span>

                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border p-2 rounded"
                            />

                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3 mb-5">

                        <button
                            onClick={printReport}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Print
                        </button>

                        <button
                            onClick={downloadPDF}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            PDF
                        </button>

                    </div>

                    {/* TABLE */}
                    <table
                        id="report"
                        className="w-full border border-gray-300 text-sm text-center rounded-lg overflow-hidden"
                    >

                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">

                            <tr>

                                <th className="p-4 border">
                                    Title
                                </th>

                                <th className="p-4 border">
                                    Message
                                </th>

                                <th className="p-4 border">
                                    Date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filtered.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="p-4 text-gray-500"
                                    >
                                        No Data Found
                                    </td>

                                </tr>

                            ) : (

                                filtered.map((n, i) => (

                                    <tr
                                        key={n.id}
                                        className={
                                            i % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        }
                                    >

                                        <td className="p-3 border">
                                            {n.title}
                                        </td>

                                        <td className="p-3 border">
                                            {n.message}
                                        </td>

                                        <td className="p-3 border">
                                            {n.createdAt?.slice(0, 10)}
                                        </td>

                                    </tr>

                                ))
                            )}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
};

export default Notifications;