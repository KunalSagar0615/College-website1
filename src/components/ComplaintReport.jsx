import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const ComplaintReport = () => {

    const [complaints, setComplaints] = useState([]);

    const reportRef = useRef();

    // ================= FETCH =================
    const fetchComplaints = async () => {

        try {

            const res =
                await axios.get(
                    "http://localhost:8081/api/complaints"
                );

            setComplaints(res.data);

        } catch (err) {

            console.log(err);

            alert(
                "Failed To Load Complaints ❌"
            );
        }
    };

    useEffect(() => {

        fetchComplaints();

    }, []);

    // ================= DELETE =================
    const deleteComplaint = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this complaint?"
            );

        if (!confirmDelete) return;

        try {

            await axios.delete(
                `http://localhost:8081/api/complaints/${id}`
            );

            alert(
                "Complaint Deleted Successfully ✅"
            );

            fetchComplaints();

        } catch (err) {

            console.log(err);

            alert(
                "Delete Failed ❌"
            );
        }
    };

    // ================= PRINT REPORT =================
    const generateReport = () => {

        const printContents =
            reportRef.current.innerHTML;

        const printWindow =
            window.open(
                "",
                "",
                "width=1200,height=800"
            );

        printWindow.document.write(`

            <html>

                <head>

                    <title>
                        Complaint Report
                    </title>

                    <style>

                        body{
                            font-family:Arial,sans-serif;
                            padding:20px;
                            background:#fff;
                        }

                        h1{
                            text-align:center;
                            color:#b91c1c;
                            margin-bottom:25px;
                        }

                        table{
                            width:100%;
                            border-collapse:collapse;
                        }

                        th,td{
                            border:1px solid #ccc;
                            padding:10px;
                            text-align:left;
                            font-size:14px;
                        }

                        th{
                            background:#b91c1c;
                            color:#fff;
                        }

                        tr:nth-child(even){
                            background:#f9f9f9;
                        }

                    </style>

                </head>

                <body>

                    <h1>
                        Complaint Report
                    </h1>

                    ${printContents}

                </body>

            </html>
        `);

        printWindow.document.close();

        printWindow.focus();

        setTimeout(() => {

            printWindow.print();

            printWindow.close();

        }, 500);
    };

    return (

        <div className="w-full max-w-full overflow-hidden p-2 sm:p-4">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                <h1
                    style={{
                        color: "#b91c1c"
                    }}
                    className="text-2xl sm:text-3xl font-bold"
                >
                    📢 Complaint Report
                </h1>

                <button
                    onClick={generateReport}
                    style={{
                        backgroundColor: "#dc2626"
                    }}
                    className="
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        text-sm
                        font-semibold
                        shadow
                        w-full
                        sm:w-auto
                    "
                >
                    Generate Report
                </button>

            </div>

            {/* TABLE */}
            <div
                className="
                    w-full
                    overflow-x-auto
                    bg-white
                    rounded-2xl
                    shadow-lg
                "
            >

                <div ref={reportRef}>

                    <table className="w-full text-xs sm:text-sm">

                        <thead
                            style={{
                                backgroundColor: "#b91c1c",
                                color: "#ffffff"
                            }}
                        >

                            <tr>

                                <th className="p-3 whitespace-nowrap">
                                    ID
                                </th>

                                <th className="p-3 whitespace-nowrap">
                                    Name
                                </th>

                                <th className="p-3 whitespace-nowrap">
                                    Email
                                </th>

                                <th className="p-3 whitespace-nowrap">
                                    Subject
                                </th>

                                <th className="p-3 min-w-[250px]">
                                    Message
                                </th>

                                <th className="p-3 whitespace-nowrap">
                                    Date
                                </th>

                                <th className="p-3 whitespace-nowrap">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {complaints.length > 0 ? (

                                complaints.map((c) => (

                                    <tr
                                        key={c.id}
                                        className="border-b"
                                    >

                                        <td className="p-3 text-center whitespace-nowrap">
                                            {c.id}
                                        </td>

                                        <td className="p-3 whitespace-nowrap font-medium">
                                            {c.name}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {c.email}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {c.subject}
                                        </td>

                                        <td className="p-3 break-words">
                                            {c.message}
                                        </td>

                                        <td className="p-3 whitespace-nowrap text-center">

                                            {new Date(
                                                c.createdAt
                                            ).toLocaleDateString()}

                                        </td>

                                        <td className="p-3 text-center">

                                            <button
                                                onClick={() =>
                                                    deleteComplaint(c.id)
                                                }
                                                className="
                                                    bg-red-600
                                                    hover:bg-red-700
                                                    text-white
                                                    px-3
                                                    py-2
                                                    rounded-lg
                                                    text-xs
                                                    font-semibold
                                                    whitespace-nowrap
                                                "
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            text-center
                                            p-8
                                            text-gray-500
                                            text-lg
                                        "
                                    >
                                        No Complaints Found
                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default ComplaintReport;