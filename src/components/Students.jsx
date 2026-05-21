import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const USER_API = "http://localhost:8081/api/users";

const Students = () => {
    const [message, setMessage] = useState("");

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [showReport, setShowReport] = useState(false);

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedDivision, setSelectedDivision] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const [reportCourse, setReportCourse] = useState("");
    const [reportDivision, setReportDivision] = useState("");
    const [reportYear, setReportYear] = useState("");

    const singleRef = useRef();

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        course: "",
        password: "",
        rollNumber: "",
        division: "",
        year: ""
    });

    const [editId, setEditId] = useState(null);

    // ================= FETCH =================
    const fetchStudents = async () => {
        const res = await axios.get(`${USER_API}/students`);
        setStudents(res.data || []);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ================= FORM =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addStudent = async () => {
        await axios.post(`${USER_API}/students`, { ...form, role: "STUDENT" });
        setForm({
            name: "",
            email: "",
            mobile: "",
            course: "",
            password: "",
            rollNumber: "",
            division: "",
            year: ""
        });
        fetchStudents();
    };

    const editStudent = (s) => {
        setForm({
            name: s.name || "",
            email: s.email || "",
            mobile: s.mobile || "",
            course: s.course || "",
            password: s.password || "",
            rollNumber: s.rollNumber || "",
            division: s.division || "",
            year: s.year || ""
        });
        setEditId(s.id);
    };

    const updateStudent = async () => {

        await axios.put(`${USER_API}/students/${editId}`, form);

        // ✅ form clear करा (refresh effect येईल)
        setForm({
            name: "",
            email: "",
            mobile: "",
            course: "",
            password: "",
            rollNumber: "",
            division: "",
            year: ""
        });

        setEditId(null);

        await fetchStudents(); // नवीन data load

        // optional message
        setMessage("Student Updated Successfully ✅");
        setTimeout(() => setMessage(""), 3000);
    };
    const deleteStudent = async (id) => {
        await axios.delete(`${USER_API}/students/${id}`);
        fetchStudents();
    };

    // ================= FILTER =================
    const filtered = students.filter((s) => {

        const matchSearch =
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.email?.toLowerCase().includes(search.toLowerCase()) ||
            s.course?.toLowerCase().includes(search.toLowerCase());

        const matchCourse = reportCourse ? s.course === reportCourse : true;
        const matchDivision = reportDivision ? s.division === reportDivision : true;
        const matchYear = reportYear ? s.year === reportYear : true;

        return matchSearch && matchCourse && matchDivision && matchYear;
    });

    const uniqueCourses = [...new Set(students.map(s => s.course))];
    const uniqueDivisions = [...new Set(students.map(s => s.division))];
    const uniqueYears = [...new Set(students.map(s => s.year))];

    // ================= VIEW =================
    const handleView = async (s) => {
        const res = await axios.get(`${USER_API}/students/${s.id}`);
        setSelectedStudent(res.data);

        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        }, 200);
    };

    // ================= PRINT STUDENT =================
    const printStudent = () => {
        const content = singleRef.current.innerHTML;

        const win = window.open("", "", "width=900,height=650");
        win.document.write(`
            <html>
                <head>
                    <style>
                        table { width:100%; border-collapse:collapse; }
                        th,td { border:1px solid black; padding:10px; }
                    </style>
                </head>
                <body>
                    <h2>Student Details</h2>
                    ${content}
                </body>
            </html>
        `);
        win.document.close();
        win.print();
    };

    // ================= PRINT REPORT =================
    const printReport = () => {
        const table = document.getElementById("reportTable").outerHTML;

        const win = window.open("", "", "width=900,height=650");
        win.document.write(`
            <html>
                <head>
                    <style>
                        table { width:100%; border-collapse:collapse; }
                        th,td { border:1px solid black; padding:10px; }
                    </style>
                </head>
                <body>
                    <h2>Student Report</h2>
                    ${table}
                </body>
            </html>
        `);
        win.document.close();
        win.print();
    };

    // ================= PDF =================
    const downloadPDF = () => {
        const doc = new jsPDF();

        const tableData = filtered.map((s) => [
            s.rollNumber,   // ✅ add
            s.name,
            s.email,
            s.course,
            s.division,
            s.year
        ]);

        autoTable(doc, {
            head: [["Roll No", "Name", "Email", "Course", "Division", "Year"]], // ✅ update
            body: tableData,
        });

        doc.save("student-report.pdf");
    };

    return (
        <div className="p-4">

            <h2 className="text-xl font-bold mb-4">Students</h2>

            {/* SEARCH */}
            <input
                className="border p-2 mb-4 w-full md:w-1/2 rounded"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* FORM */}
            <div className="grid md:grid-cols-5 gap-2 mb-4">

                <input name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Name"
                />

                <input name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Email"
                />

                <input name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Mobile"
                />

                <input name="course"
                    value={form.course}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Course"
                />

                <input name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Password"
                />

                {/* ✅ NEW FIELDS (ADMIN EDIT) */}
                <input name="rollNumber"
                    value={form.rollNumber || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Roll No"
                />

                <input name="division"
                    value={form.division || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Division"
                />

                <input name="year"
                    value={form.year || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Year"
                />

            </div>

            <button
                onClick={editId ? updateStudent : addStudent}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-4"
            >
                {editId ? "Update Student" : "Add Student"}
            </button>
            

            {/* FILTER */}
            <div className="mb-6 flex gap-2 flex-wrap">
                <select onChange={(e) => setSelectedCourse(e.target.value)} className="border p-2 rounded">
                    <option value="">Course</option>
                    {uniqueCourses.map((c, i) => <option key={i}>{c}</option>)}
                </select>

                <select onChange={(e) => setSelectedDivision(e.target.value)} className="border p-2 rounded">
                    <option value="">Division</option>
                    {uniqueDivisions.map((d, i) => <option key={i}>{d}</option>)}
                </select>

                <select onChange={(e) => setSelectedYear(e.target.value)} className="border p-2 rounded">
                    <option value="">Year</option>
                    {uniqueYears.map((y, i) => <option key={i}>{y}</option>)}
                </select>

                <button
                    onClick={() => {
                        setReportCourse(selectedCourse);
                        setReportDivision(selectedDivision);
                        setReportYear(selectedYear);
                        setShowReport(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Generate Report
                </button>
            </div>

            {/* TABLE */}
            <table className="w-full border rounded overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 border">Roll No</th>  {/* ✅ add */}
                        <th className="p-3 border">Name</th>
                        <th className="p-3 border">Email</th>
                        <th className="p-3 border">Course</th>
                        <th className="p-3 border">Division</th>
                        <th className="p-3 border">Year</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map((s) => (
                        <tr key={s.id} className="text-center hover:bg-gray-50">
                            <td className="p-3 border">{s.rollNumber}</td> {/* ✅ add */}
                            <td className="p-3 border">{s.name}</td>
                            <td className="border">{s.email}</td>
                            <td className="border">{s.mobile}</td>
                            <td className="border">{s.course}</td>

                          

                            <td className="border space-x-2 p-2">

                                <button
                                    onClick={() => editStudent(s)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteStudent(s.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() => handleView(s)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
                                >
                                    View
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* REPORT MODAL */}
            {/* REPORT MODAL */}
            {showReport && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

                    <div className="bg-white w-[850px] rounded-xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">

                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-semibold">📊 Student Report</h2>
                            <button onClick={() => setShowReport(false)}>×</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table id="reportTable" className="w-full border text-sm">

                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="p-3 border">Roll No</th> {/* ✅ Added */}
                                        <th className="p-3 border">Name</th>
                                        <th className="p-3 border">Email</th>
                                        <th className="p-3 border">Course</th>
                                        <th className="p-3 border">Division</th>
                                        <th className="p-3 border">Year</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((s) => (
                                        <tr key={s.id}>
                                            <td className="p-3 border">{s.rollNumber}</td> {/* ✅ Added */}
                                            <td className="p-3 border">{s.name}</td>
                                            <td className="p-3 border">{s.email}</td>
                                            <td className="p-3 border">{s.course}</td>
                                            <td className="p-3 border">{s.division}</td>
                                            <td className="p-3 border">{s.year}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={printReport} className="bg-blue-500 text-white px-3 py-1 rounded">Print</button>
                            <button onClick={downloadPDF} className="bg-green-600 text-white px-3 py-1 rounded">PDF</button>
                        </div>

                    </div>
                </div>
            )}
            {/* STUDENT DETAILS */}
            {selectedStudent && (
                <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6 border-b pb-3">
                        <h2 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                            👤 Student Details
                        </h2>

                        <button
                            onClick={printStudent}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm shadow"
                        >
                            Print
                        </button>
                    </div>

                    {/* TABLE */}
                    <div ref={singleRef}>
                        <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">

                            <tbody className="divide-y divide-gray-200">

                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <th className="p-3 text-left w-1/3 font-medium text-gray-700">Name</th>
                                    <td className="p-3 text-gray-800">{selectedStudent.name}</td>
                                </tr>

                                <tr className="hover:bg-gray-50">
                                    <th className="p-3 text-left font-medium text-gray-700">Email</th>
                                    <td className="p-3">{selectedStudent.email}</td>
                                </tr>

                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <th className="p-3 text-left font-medium text-gray-700">Mobile</th>
                                    <td className="p-3">{selectedStudent.mobile}</td>
                                </tr>

                                <tr className="hover:bg-gray-50">
                                    <th className="p-3 text-left font-medium text-gray-700">Course</th>
                                    <td className="p-3">{selectedStudent.course}</td>
                                </tr>

                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <th className="p-3 text-left font-medium text-gray-700">Semester</th>
                                    <td className="p-3">{selectedStudent.semester}</td>
                                </tr>

                                <tr className="hover:bg-gray-50">
                                    <th className="p-3 text-left font-medium text-gray-700">Roll No</th>
                                    <td className="p-3">{selectedStudent.rollNumber}</td>
                                </tr>

                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <th className="p-3 text-left font-medium text-gray-700">Division</th>
                                    <td className="p-3">{selectedStudent.division}</td>
                                </tr>

                                <tr className="hover:bg-gray-50">
                                    <th className="p-3 text-left font-medium text-gray-700">Year</th>
                                    <td className="p-3">{selectedStudent.year}</td>
                                </tr>

                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <th className="p-3 text-left font-medium text-gray-700">Father Name</th>
                                    <td className="p-3">{selectedStudent.fatherName}</td>
                                </tr>

                                <tr className="hover:bg-gray-50">
                                    <th className="p-3 text-left font-medium text-gray-700">Mother Name</th>
                                    <td className="p-3">{selectedStudent.motherName}</td>
                                </tr>

                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <th className="p-3 text-left font-medium text-gray-700">Gender</th>
                                    <td className="p-3">{selectedStudent.gender}</td>
                                </tr>

                                <tr className="hover:bg-gray-50">
                                    <th className="p-3 text-left font-medium text-gray-700">10th</th>
                                    <td className="p-3">
                                        {selectedStudent.tenthSchool} ({selectedStudent.tenthMarks})
                                    </td>
                                </tr>

                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <th className="p-3 text-left font-medium text-gray-700">12th</th>
                                    <td className="p-3">
                                        {selectedStudent.twelfthCollege} ({selectedStudent.twelfthMarks})
                                    </td>
                                </tr>

                                <tr className="hover:bg-gray-50">
                                    <th className="p-3 text-left font-medium text-gray-700">CGPA</th>
                                    <td className="p-3">{selectedStudent.cgpa}</td>
                                </tr>

                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <th className="p-3 text-left font-medium text-gray-700">Address</th>
                                    <td className="p-3">{selectedStudent.address}</td>
                                </tr>

                            </tbody>

                        </table>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Students;