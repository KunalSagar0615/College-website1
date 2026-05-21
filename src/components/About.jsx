import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
        About Us
      </h1>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Zeal Institute of Technology, Sangli
        </h2>

        <p className="text-gray-600 mb-4">
          Zeal Institute of Technology, Sangli is a part of Zeal Education Society.
          The institute provides quality technical education and focuses on building
          skilled professionals with practical knowledge and strong values.
        </p>

        <p className="text-gray-600 mb-6">
          The college offers modern infrastructure, experienced faculty, and
          industry-oriented learning to help students succeed in their careers.
        </p>

        {/* Vision */}
        <h3 className="text-xl font-semibold text-blue-600 mb-2">
          Our Vision
        </h3>
        <p className="text-gray-600 mb-4">
          To develop skilled professionals with strong technical knowledge,
          ethical values, and leadership qualities.
        </p>

        {/* Mission */}
        <h3 className="text-xl font-semibold text-blue-600 mb-2">
          Our Mission
        </h3>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Provide quality education with modern facilities</li>
          <li>Encourage innovation and research</li>
          <li>Prepare students for industry challenges</li>
          <li>Develop responsible professionals</li>
        </ul>

        {/* Why Choose Us */}
        <h3 className="text-xl font-semibold text-blue-600 mb-2">
          Why Choose Us
        </h3>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Experienced faculty</li>
          <li>Modern labs and infrastructure</li>
          <li>Industry-oriented training</li>
          <li>Focus on practical learning</li>
        </ul>

      </div>
    </div>
  );
};

export default About;