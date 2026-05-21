import React from "react";

const Department = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        MCA Department
      </h1>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8">

        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Master of Computer Applications (MCA)
        </h2>

        <p className="text-gray-600 mb-6">
          The MCA Department focuses on advanced computing concepts including
          software development, database management, networking, and modern
          technologies. It prepares students for professional careers in IT
          industries with both theoretical and practical knowledge.
        </p>

        {/* Highlights */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-700 mb-2">💻 Key Subjects</h3>
            <ul className="text-gray-600 text-sm">
              <li>Java Programming</li>
              <li>Database Management System</li>
              <li>Web Development</li>
              <li>Data Structures</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-700 mb-2">🎯 Skills Developed</h3>
            <ul className="text-gray-600 text-sm">
              <li>Problem Solving</li>
              <li>Software Development</li>
              <li>Database Handling</li>
              <li>Teamwork</li>
            </ul>
          </div>

        </div>

        {/* Extra Info */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-blue-700 mb-2">📌 Career Opportunities</h3>
          <p className="text-gray-600 text-sm">
            MCA graduates can work as Software Developers, Web Developers,
            Database Administrators, System Analysts, and IT Consultants.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Department;