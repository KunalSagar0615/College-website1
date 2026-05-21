import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API =
    "http://localhost:8081/api/enquiry";

const Enquiry = () => {

    const [enquiries, setEnquiries] =
        useState([]);

    const [filteredData, setFilteredData] =
        useState([]);

    const [course, setCourse] =
        useState("");

    const [year, setYear] =
        useState("");

    const reportRef = useRef();

    // ================= FETCH =================
    const fetchEnquiries = async () => {

        try {

            const res =
                await axios.get(
                    `${API}/all`
                );

            setEnquiries(res.data);

            setFilteredData(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    useEffect(() => {

        fetchEnquiries();

    }, []);

    // ================= FILTER =================
    const handleFilter = () => {

        let data = [...enquiries];

        if (course) {

            data = data.filter(
                (e) =>
                    e.course === course
            );
        }

        if (year) {

            data = data.filter(
                (e) =>
                    String(e.enquiryYear) === year
            );
        }

        setFilteredData(data);
    };

    // ================= RESET =================
    const resetFilter = () => {

        setCourse("");

        setYear("");

        setFilteredData(enquiries);
    };

    // ================= DELETE =================
    const deleteEnquiry = async (id) => {

        if (
            !window.confirm(
                "Delete this enquiry?"
            )
        ) return;

        try {

            await axios.delete(
                `${API}/${id}`
            );

            const updated =
                enquiries.filter(
                    (e) => e.id !== id
                );

            setEnquiries(updated);

            setFilteredData(updated);

        } catch (err) {

            console.log(err);

            alert("Delete failed ❌");
        }
    };

    // ================= GENERATE REPORT =================
    const generateReport = () => {

        let reportTitle =
            "Admission Enquiry Report";

        if (course && year) {

            reportTitle =
                `${course} - ${year} Admission Report`;
        }

        else if (course) {

            reportTitle =
                `${course} Admission Report`;
        }

        else if (year) {

            reportTitle =
                `${year} Admission Report`;
        }

        const total =
            filteredData.length;

        const reportWindow =
            window.open(
                "",
                "",
                "width=1200,height=800"
            );

        reportWindow.document.write(`

            <html>

                <head>

                    <title>
                        ${reportTitle}
                    </title>

                    <style>

                        body {
                            font-family: Arial;
                            padding: 20px;
                        }

                        h1 {
                            text-align: center;
                            margin-bottom: 10px;
                        }

                        h3 {
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            text-align: center;
                            font-size: 12px;
                        }

                        th {
                            background: #1e3a8a;
                            color: white;
                        }

                    </style>

                </head>

                <body>

                    <h1>
                        ${reportTitle}
                    </h1>

                    <h3>
                        Total Enquiries :
                        ${total}
                    </h3>

                    <table>

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Mobile</th>

                                <th>Email</th>

                                <th>Course</th>

                                <th>Admission Year</th>

                                <th>Qualification</th>

                                <th>Marks</th>

                                <th>Passout</th>

                                <th>Year Gap</th>

                            </tr>

                        </thead>

                        <tbody>

                            ${filteredData.map((e) => `

                                <tr>

                                    <td>${e.name}</td>

                                    <td>${e.mobile}</td>

                                    <td>${e.email}</td>

                                    <td>${e.course}</td>

                                    <td>${e.enquiryYear}</td>

                                    <td>${e.qualification}</td>

                                    <td>${e.marks}</td>

                                    <td>${e.passoutYear}</td>

                                    <td>
                                        ${e.yearGap}
                                        ${e.yearGap === "Yes"
                ? ` (${e.gapYears} yrs)`
                : ""
            }
                                    </td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </body>

            </html>
        `);

        reportWindow.document.close();

        reportWindow.print();
    };

    // ================= PRINT =================
    const handlePrint = () => {

        const content =
            reportRef.current.innerHTML;

        const win =
            window.open(
                "",
                "",
                "width=1200,height=800"
            );

        win.document.write(`
            <html>

                <head>

                    <title>
                        Admission Enquiry Report
                    </title>

                    <style>

                        body {
                            font-family: Arial;
                            padding: 20px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            text-align: center;
                            font-size: 12px;
                        }

                        th {
                            background: #1e3a8a;
                            color: white;
                        }

                    </style>

                </head>

                <body>

                    <h1>
                        Admission Enquiry Report
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
            await html2canvas(
                reportRef.current,
                { scale: 2 }
            );

        const img =
            canvas.toDataURL("image/png");

        const pdf =
            new jsPDF(
                "l",
                "mm",
                "a4"
            );

        pdf.text(
            "Admission Enquiry Report",
            90,
            10
        );

        pdf.addImage(
            img,
            "PNG",
            5,
            20,
            287,
            0
        );

        pdf.save(
            "admission-enquiry-report.pdf"
        );
    };

    return (

        <div>

            {/* HEADER */}
            <div
                className="
                    flex flex-col lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4 mb-6
                "
            >

                <h1
                    className="
                        text-2xl md:text-3xl
                        font-bold text-blue-900
                    "
                >
                    📝 Admission Enquiry
                </h1>

                <div
                    className="
                        flex flex-col sm:flex-row
                        gap-3 flex-wrap
                    "
                >

                    {/* COURSE */}
                    <select
                        value={course}
                        onChange={(e) =>
                            setCourse(
                                e.target.value
                            )
                        }
                        className="
                            border p-2 rounded-lg
                        "
                    >

                        <option value="">
                            All Courses
                        </option>

                        <option value="MBA">
                            MBA
                        </option>

                        <option value="MCA">
                            MCA
                        </option>

                    </select>

                    {/* YEAR */}
                    <select
                        value={year}
                        onChange={(e) =>
                            setYear(
                                e.target.value
                            )
                        }
                        className="
                            border p-2 rounded-lg
                        "
                    >

                        <option value="">
                            All Years
                        </option>

                        {Array.from(
                            { length: 10 },
                            (_, i) =>
                                new Date()
                                    .getFullYear() + i
                        ).map((y) => (

                            <option
                                key={y}
                                value={y}
                            >
                                {y}
                            </option>
                        ))}

                    </select>

                    {/* FILTER */}
                    <button
                        onClick={handleFilter}
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-4 py-2
                            rounded-lg
                        "
                    >
                        Filter
                    </button>

                    {/* RESET */}
                    <button
                        onClick={resetFilter}
                        className="
                            bg-gray-500
                            hover:bg-gray-600
                            text-white
                            px-4 py-2
                            rounded-lg
                        "
                    >
                        Reset
                    </button>

                    {/* REPORT */}
                    <button
                        onClick={generateReport}
                        className="
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            px-4 py-2
                            rounded-lg
                        "
                    >
                        Generate Report
                    </button>

                    {/* PRINT */}
                    <button
                        onClick={handlePrint}
                        className="
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            px-4 py-2
                            rounded-lg
                        "
                    >
                        Print
                    </button>

                    {/* PDF */}
                    <button
                        onClick={handleDownload}
                        className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            px-4 py-2
                            rounded-lg
                        "
                    >
                        PDF
                    </button>

                </div>

            </div>

            {/* TOTAL */}
            <div
                className="
                    mb-4
                    bg-green-100
                    text-green-800
                    px-4 py-3
                    rounded-lg
                    font-semibold
                    w-fit
                "
            >
                Total Enquiries :
                {" "}
                {filteredData.length}
            </div>

            {/* TABLE */}
            <div
                ref={reportRef}
                className="
                    overflow-x-auto
                    bg-white
                    rounded-xl
                    shadow
                "
            >

                <table
                    className="
                        w-full
                        border-collapse
                        min-w-[1100px]
                    "
                >

                    <thead
                        className="
                            bg-blue-900
                            text-white
                        "
                    >

                        <tr>

                            <th className="p-3">
                                Name
                            </th>

                            <th className="p-3">
                                Mobile
                            </th>

                            <th className="p-3">
                                Email
                            </th>

                            <th className="p-3">
                                Course
                            </th>

                            <th className="p-3">
                                Admission Year
                            </th>

                            <th className="p-3">
                                Qualification
                            </th>

                            <th className="p-3">
                                Marks
                            </th>

                            <th className="p-3">
                                Passout
                            </th>

                            <th className="p-3">
                                Year Gap
                            </th>

                            <th className="p-3">
                                Goals
                            </th>

                            <th className="p-3">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredData.length > 0 ? (

                            filteredData.map((e) => (

                                <tr
                                    key={e.id}
                                    className="
                                        border-b
                                        hover:bg-gray-50
                                    "
                                >

                                    <td className="p-3">
                                        {e.name}
                                    </td>

                                    <td className="p-3">
                                        {e.mobile}
                                    </td>

                                    <td className="p-3">
                                        {e.email}
                                    </td>

                                    <td className="p-3">
                                        {e.course}
                                    </td>

                                    <td className="p-3">
                                        {e.enquiryYear}
                                    </td>

                                    <td className="p-3">
                                        {e.qualification}
                                    </td>

                                    <td className="p-3">
                                        {e.marks}
                                    </td>

                                    <td className="p-3">
                                        {e.passoutYear}
                                    </td>

                                    <td className="p-3">

                                        {e.yearGap}

                                        {e.yearGap === "Yes" &&
                                            ` (${e.gapYears} yrs)`
                                        }

                                    </td>

                                    <td className="p-3">
                                        {e.goals}
                                    </td>

                                    <td className="p-3">

                                        <button
                                            onClick={() =>
                                                deleteEnquiry(
                                                    e.id
                                                )
                                            }
                                            className="
                                                bg-red-600
                                                hover:bg-red-700
                                                text-white
                                                px-3 py-1
                                                rounded-lg
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
                                    colSpan="11"
                                    className="
                                        text-center
                                        p-6
                                        text-gray-500
                                    "
                                >
                                    No Enquiries Found
                                </td>

                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default Enquiry;