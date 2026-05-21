import React, { useState } from "react";
import axios from "axios";

const Contact = () => {

  const [name, setName] =
    useState("");

  const [message, setMessage] =
    useState("");

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    if (!name || !message) {

      alert("Please fill all fields ❌");

      return;
    }

    try {

      // 🔥 SAVE IN DATABASE
      await axios.post(
        "http://localhost:8081/api/contact/add",
        {
          name,
          message
        }
      );

      // 🔥 OPTIONAL WHATSAPP
      const phone =
        "917499799393";

      const text =
        `Hello, my name is ${name}. ${message}`;

      const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

      window.open(
        url,
        "_blank"
      );

      alert(
        "Message Sent Successfully ✅"
      );

      setName("");

      setMessage("");

    } catch (err) {

      console.log(err);

      alert("Failed To Send ❌");
    }
  };

  return (

    <div
      className="
                bg-gradient-to-br
                from-blue-50
                to-gray-100
                min-h-screen
                flex items-center justify-center
                p-4
            "
    >

      <div
        className="
                    w-full max-w-5xl
                    bg-white
                    shadow-2xl
                    rounded-3xl
                    grid md:grid-cols-2
                    overflow-hidden
                "
      >

        {/* LEFT SIDE */}
        <div
          className="
                        bg-blue-700
                        text-white
                        p-8
                        flex flex-col justify-center
                    "
        >

          <h2
            className="
                            text-3xl
                            font-bold
                            mb-4
                        "
          >
            Get in Touch
          </h2>

          <p
            className="
                            mb-6
                            text-blue-100
                        "
          >
            Contact us directly on WhatsApp
            or follow us on social media.
          </p>

          <p className="mb-2">
            📍 Zeal Institute Of Technology
            Sangli, Maharashtra
          </p>

          <p className="mb-4">
            📞 +91 7499799393
          </p>

          {/* SOCIAL LINKS */}
          <div className="space-y-3">

            <a
              href="https://www.instagram.com/zits_sangli/"
              target="_blank"
              rel="noreferrer"
              className="
                                block
                                bg-pink-500
                                hover:bg-pink-600
                                text-white
                                px-4 py-2
                                rounded-lg
                                text-center
                                transition
                            "
            >
              Visit Instagram
            </a>

            <a
              href="https://www.facebook.com/people/Zeal-Institute-Of-Technology-Sangli/61581540354948/#"
              target="_blank"
              rel="noreferrer"
              className="
                                block
                                bg-blue-500
                                hover:bg-blue-600
                                text-white
                                px-4 py-2
                                rounded-lg
                                text-center
                                transition
                            "
            >
              Visit Facebook
            </a>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-8">

          <h2
            className="
                            text-2xl
                            font-semibold
                            mb-6
                        "
          >
            Send Message
          </h2>

          <div className="space-y-4">

            {/* NAME */}
            <input
              type="text"
              placeholder="Full Name"
              className="
                                w-full
                                p-3
                                border
                                rounded-xl
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-400
                            "
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

            {/* MESSAGE */}
            <textarea
              placeholder="Your Message"
              className="
                                w-full
                                p-3
                                border
                                rounded-xl
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-400
                            "
              rows="5"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
            />

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              className="
                                w-full
                                bg-green-600
                                text-white
                                py-3
                                rounded-xl
                                font-semibold
                                hover:bg-green-700
                                transition
                            "
            >
              Send Message
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;