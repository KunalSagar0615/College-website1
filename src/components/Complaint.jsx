import React, { useState } from "react";

const Complaint = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const adminNumber = "917499799393"; // 👉 your WhatsApp number

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields");
      return false;
    }
    return true;
  };

  const sendComplaint = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const text = `
📢 *New Complaint*

👤 Name: ${form.name}
📧 Email: ${form.email}
📌 Subject: ${form.subject || "N/A"}

📝 Message:
${form.message}
      `;

      const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(text)}`;

      window.open(url, "_blank");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl p-6">

        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Complaint Form
        </h2>

        <form onSubmit={sendComplaint} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Your Name *"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email *"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <textarea
            name="message"
            placeholder="Write your complaint *"
            value={form.message}
            onChange={handleChange}
            className="w-full border p-2 rounded h-32"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Sending..." : "Send Complaint on WhatsApp"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Complaint;