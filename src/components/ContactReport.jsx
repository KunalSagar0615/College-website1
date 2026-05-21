import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API =
  "http://localhost:8081/api/contact";

const ContactReport = () => {

  const [messages, setMessages] =
    useState([]);

  const reportRef = useRef();

  // ================= FETCH =================
  const fetchMessages = async () => {

    try {

      const res =
        await axios.get(
          `${API}/all`
        );

      setMessages(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchMessages();

  }, []);

  // ================= DELETE =================
  const deleteMessage = async (id) => {

    if (
      !window.confirm(
        "Delete this message?"
      )
    ) return;

    try {

      await axios.delete(
        `${API}/${id}`
      );

      setMessages((prev) =>
        prev.filter(
          (m) => m.id !== id
        )
      );

    } catch (err) {

      console.log(err);

      alert("Delete failed ❌");
    }
  };

  // ================= GENERATE REPORT =================
  const generateReport = () => {

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
                        Contact Messages Report
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
                            padding: 10px;
                            text-align: center;
                            font-size: 13px;
                        }

                        th {
                            background: #1e3a8a;
                            color: white;
                        }

                    </style>

                </head>

                <body>

                    <h1>
                        Contact Messages Report
                    </h1>

                    <h3>
                        Total Messages :
                        ${messages.length}
                    </h3>

                    <table>

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Message</th>

                                <th>Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            ${messages.map((m) => `

                                <tr>

                                    <td>${m.name}</td>

                                    <td>${m.message}</td>

                                    <td>
                                        ${new Date(
      m.createdAt
    ).toLocaleString()}
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
                        Contact Messages
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
                            padding: 10px;
                            text-align: center;
                        }

                        th {
                            background: #1e3a8a;
                            color: white;
                        }

                    </style>

                </head>

                <body>

                    <h1>
                        Contact Messages
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
        "p",
        "mm",
        "a4"
      );

    pdf.text(
      "Contact Messages Report",
      60,
      10
    );

    pdf.addImage(
      img,
      "PNG",
      5,
      20,
      200,
      0
    );

    pdf.save(
      "contact-messages-report.pdf"
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
          📩 Contact Messages
        </h1>

        <div
          className="
                        flex flex-wrap gap-3
                    "
        >

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
        Total Messages :
        {" "}
        {messages.length}
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
                        min-w-[800px]
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
                Message
              </th>

              <th className="p-3">
                Date
              </th>

              <th className="p-3">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {messages.length > 0 ? (

              messages.map((m) => (

                <tr
                  key={m.id}
                  className="
                                        border-b
                                        hover:bg-gray-50
                                    "
                >

                  <td className="p-3">
                    {m.name}
                  </td>

                  <td className="p-3">
                    {m.message}
                  </td>

                  <td className="p-3">

                    {new Date(
                      m.createdAt
                    ).toLocaleString()}

                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        deleteMessage(
                          m.id
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
                  colSpan="4"
                  className="
                                        text-center
                                        p-6
                                        text-gray-500
                                    "
                >
                  No Messages Found
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ContactReport;