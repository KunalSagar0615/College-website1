import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = "http://localhost:8081/api/users/students";

const FeesReport = () => {

  const [students, setStudents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [course, setCourse] = useState("");
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");

  const [editId, setEditId] = useState(null);

  const [totalFees, setTotalFees] = useState("");
  const [newPaidFees, setNewPaidFees] = useState("");

  const reportRef = useRef();

  // ================= FETCH =================
  const fetchStudents = async () => {

    try {

      const res = await axios.get(API);

      setStudents(res.data);

      setFilteredData(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchStudents();

  }, []);

  // ================= FILTER =================
  const handleFilter = () => {

    let data = [...students];

    if (course) {
      data = data.filter(
        (s) => s.course === course
      );
    }

    if (division) {
      data = data.filter(
        (s) => s.division === division
      );
    }

    if (year) {
      data = data.filter(
        (s) => s.year === year
      );
    }

    setFilteredData(data);
  };

  // ================= RESET =================
  const resetFilter = () => {

    setCourse("");
    setDivision("");
    setYear("");

    setFilteredData(students);
  };

  // ================= RECEIPT =================
  const generateReceipt = (
    student,
    currentPayment = 0,
    remaining = 0
  ) => {

    const logo = "/logo.png";

    const win =
      window.open(
        "",
        "",
        "width=1000,height=900"
      );

    win.document.write(`

      <html>

        <head>

          <title>
            Fee Receipt
          </title>

          <style>

            body {
              font-family: Arial;
              padding: 20px;
              background: #fff;
            }

            .receipt {
              border: 2px solid #000;
              padding: 20px;
            }

            .top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
            }

            .logo {
              width: 80px;
              height: 80px;
              object-fit: contain;
            }

            .college {
              flex: 1;
              text-align: center;
            }

            .college h2 {
              margin: 0;
              font-size: 28px;
            }

            .college p {
              margin: 4px 0;
              font-size: 15px;
            }

            .title {
              text-align: center;
              margin-top: 18px;
              margin-bottom: 18px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
            }

            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 20px;
            }

            .details p {
              margin: 4px 0;
              font-size: 16px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }

            th, td {
              border: 1px solid #000;
              padding: 10px;
              text-align: center;
            }

            th {
              background: #f3f3f3;
            }

            .footer {
              display: flex;
              justify-content: space-between;
              margin-top: 60px;
            }

          </style>

        </head>

        <body>

          <div class="receipt">

            <div class="top">

              <img
                src="${logo}"
                class="logo"
              />

              <div class="college">

                <h2>
                  Zeal Institute Of Technology
                </h2>

                <p>
                  Sangli, Maharashtra
                </p>

                <p>
                  Fees Payment Receipt
                </p>

              </div>

              <img
                src="${logo}"
                class="logo"
              />

            </div>

            <div class="title">
              FEES PAYMENT RECEIPT
            </div>

            <div class="details">

              <p>
                <b>Name :</b>
                ${student.name}
              </p>

              <p>
                <b>Date :</b>
                ${new Date().toLocaleDateString()}
              </p>

              <p>
                <b>Course :</b>
                ${student.course}
              </p>

              <p>
                <b>Roll No :</b>
                ${student.rollNumber}
              </p>

              <p>
                <b>Year :</b>
                ${student.year}
              </p>

              <p>
                <b>Division :</b>
                ${student.division}
              </p>

            </div>

            <table>

              <thead>

                <tr>

                  <th>Sr No</th>

                  <th>Particulars</th>

                  <th>Amount</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>1</td>

                  <td>
                    Current Paid Amount
                  </td>

                  <td>
                    ₹ ${currentPayment}
                  </td>

                </tr>

                <tr>

                  <td>2</td>

                  <td>
                    Remaining Fees
                  </td>

                  <td>
                    ₹ ${remaining}
                  </td>

                </tr>

              </tbody>

            </table>

            <div class="footer">

              <div>
                Student Signature
              </div>

              <div>
                Receiver Signature
              </div>

            </div>

          </div>

        </body>

      </html>
    `);

    win.document.close();

    setTimeout(() => {

      win.print();

    }, 1000);
  };

  // ================= UPDATE FEES =================
  const updateFees = async (student) => {

    try {

      let total =
        Number(student.totalFees || 0);

      if (total === 0) {

        total =
          Number(totalFees || 0);
      }

      const oldPaid =
        Number(student.paidFees || 0);

      const currentPayment =
        Number(newPaidFees || 0);

      const finalPaid =
        oldPaid + currentPayment;

      let remaining =
        total - finalPaid;

      if (remaining < 0) {

        remaining = 0;
      }

      const updatedStudent = {

        ...student,

        totalFees: total,

        paidFees: finalPaid,

        remainingFees: remaining
      };

      await axios.put(
        `http://localhost:8081/api/users/students/${student.id}`,
        updatedStudent
      );

      generateReceipt(
        updatedStudent,
        currentPayment,
        remaining
      );

      alert(
        "Fees Updated Successfully ✅"
      );

      setEditId(null);

      setTotalFees("");

      setNewPaidFees("");

      fetchStudents();

    } catch (err) {

      console.log(err);

      alert("Update Failed ❌");
    }
  };

  // ================= CLEARANCE =================
  const generateClearance = (student) => {

    const logo = "/logo.png";

    const win =
      window.open(
        "",
        "",
        "width=900,height=700"
      );

    win.document.write(`

      <html>

        <head>

          <title>
            Fees Clearance Certificate
          </title>

        </head>

        <body style="font-family:Arial;padding:40px;text-align:center;">

          <img
            src="${logo}"
            width="90"
          />

          <h1>
            Zeal Institute Of Technology
          </h1>

          <h2>
            Fees Clearance Certificate
          </h2>

          <div style="border:2px solid #000;padding:30px;margin-top:30px;">

            <p style="font-size:20px;line-height:35px;">

              This is to certify that
              <b>${student.name}</b>
              has successfully cleared all fees.

            </p>

            <p>
              Course :
              ${student.course}
            </p>

            <p>
              Year :
              ${student.year}
            </p>

            <p>
              Division :
              ${student.division}
            </p>

            <p>
              Remaining Fees :
              ₹ ${student.remainingFees}
            </p>

            <br/>

            <p>
              Date :
              ${new Date().toLocaleDateString()}
            </p>

          </div>

        </body>

      </html>
    `);

    win.document.close();

    setTimeout(() => {

      win.print();

    }, 1000);
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
      "Fees Report",
      130,
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
      "fees-report.pdf"
    );
  };

  return (

    <div className="w-full p-4">

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">

        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
          💰 Fees Report
        </h1>

        <div className="flex flex-wrap gap-2">

          <select
            value={course}
            onChange={(e) =>
              setCourse(e.target.value)
            }
            className="border p-2 rounded-lg text-sm"
          >
            <option value="">
              All Courses
            </option>

            <option value="MCA">
              MCA
            </option>

            <option value="MBA">
              MBA
            </option>

          </select>

          <select
            value={division}
            onChange={(e) =>
              setDivision(e.target.value)
            }
            className="border p-2 rounded-lg text-sm"
          >
            <option value="">
              All Divisions
            </option>

            <option value="A">
              A
            </option>

            <option value="B">
              B
            </option>

          </select>

          <select
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
            className="border p-2 rounded-lg text-sm"
          >
            <option value="">
              All Years
            </option>

            <option value="1st Year">
              1st Year
            </option>

            <option value="2nd Year">
              2nd Year
            </option>

          </select>

          <button
            onClick={handleFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            Filter
          </button>

          <button
            onClick={resetFilter}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
          >
            Reset
          </button>

          <button
            onClick={handleDownload}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            PDF
          </button>

        </div>

      </div>

      <div
        ref={reportRef}
        className="w-full overflow-x-auto bg-white rounded-xl shadow"
      >

        <table className="w-full min-w-[1000px] text-sm">

          <thead className="bg-blue-900 text-white">

            <tr>

              <th className="p-3">
                Roll No
              </th>

              <th className="p-3">
                Name
              </th>

              <th className="p-3">
                Total
              </th>

              <th className="p-3">
                Paid
              </th>

              <th className="p-3">
                Remaining
              </th>

              <th className="p-3 min-w-[250px]">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredData.length > 0 ? (

              filteredData.map((s) => (

                <tr
                  key={s.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3 text-center">
                    {s.rollNumber}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    {s.name}
                  </td>

                  <td className="p-3 text-center">

                    {editId === s.id ? (

                      s.totalFees > 0 ? (

                        <span className="font-semibold text-green-700">
                          ₹ {s.totalFees}
                        </span>

                      ) : (

                        <input
                          type="number"
                          placeholder="Total"
                          value={totalFees}
                          onChange={(e) =>
                            setTotalFees(
                              e.target.value
                            )
                          }
                          className="border p-2 rounded w-24"
                        />
                      )

                    ) : (

                      <>₹ {s.totalFees || 0}</>
                    )}

                  </td>

                  <td className="p-3 text-center">

                    {editId === s.id ? (

                      <input
                        type="number"
                        placeholder="Add"
                        value={newPaidFees}
                        onChange={(e) =>
                          setNewPaidFees(
                            e.target.value
                          )
                        }
                        className="border p-2 rounded w-24"
                      />

                    ) : (

                      <>₹ {s.paidFees || 0}</>
                    )}

                  </td>

                  <td className="p-3 text-center font-semibold text-red-600">
                    ₹ {s.remainingFees || 0}
                  </td>

                  <td className="p-3">

                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        flex-nowrap
                      "
                    >

                      {editId === s.id ? (

                        <button
                          onClick={() =>
                            updateFees(s)
                          }
                          className="
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            text-xs
                            min-w-[80px]
                          "
                        >
                          Save
                        </button>

                      ) : (

                        <button
                          onClick={() => {

                            setEditId(s.id);

                            setTotalFees("");

                            setNewPaidFees("");
                          }}
                          className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            text-xs
                            min-w-[80px]
                          "
                        >
                          Update
                        </button>

                      )}

                      {s.remainingFees === 0 &&
                        s.totalFees > 0 && (

                          <button
                            onClick={() =>
                              generateClearance(s)
                            }
                            className="
                              bg-purple-600
                              hover:bg-purple-700
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              text-xs
                              min-w-[90px]
                            "
                          >
                            Clearance
                          </button>
                        )}

                    </div>

                  </td>

                </tr>
              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500"
                >
                  No Records Found
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default FeesReport;