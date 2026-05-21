import React, {
  useState,
  useEffect,
  useContext
} from "react";

import axios from "axios";

import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

const Student = () => {

  const { user } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const [data, setData] =
    useState({});

  const [editMode, setEditMode] =
    useState(false);

  useEffect(() => {

    if (!user) {

      return navigate("/login");
    }

    axios
      .get(
        `http://localhost:8081/api/users/students/${user.id}`
      )
      .then((res) =>
        setData(res.data)
      )
      .catch(() =>
        alert("Failed to load")
      );

  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {

    setData({
      ...data,
      [e.target.name]:
        e.target.value
    });
  };

  // ================= UPDATE =================
  const update = async () => {

    try {

      await axios.put(
        `http://localhost:8081/api/users/students/${user.id}`,
        data
      );

      alert("Updated ✅");

      setEditMode(false);

    } catch {

      alert("Update failed ❌");
    }
  };

  return (

    // 🔥 NAVBAR KHLI SPACE
    <div
      className="
        pt-24
        px-3 md:px-6
        pb-6
        bg-gray-100
        min-h-screen
      "
    >

      {/* HEADER */}
      <div
        className="
          flex flex-col lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4 mb-6
        "
      >

        <h2
          className="
            text-2xl md:text-3xl
            font-bold text-blue-900
          "
        >
          🎓 Student Profile
        </h2>

        {/* 🔥 FEES CARD */}
        <div
          className="
            bg-white
            shadow-lg
            rounded-xl
            px-5 py-4
            border-l-4 border-red-500
            w-full sm:w-72
          "
        >

          <p
            className="
              text-sm text-gray-500
            "
          >
            Remaining Fees
          </p>

          <h3
            className="
              text-2xl md:text-3xl
              font-bold text-red-600
            "
          >
            ₹ {data.remainingFees || 0}
          </h3>

        </div>

      </div>

      {/* ================= VIEW ================= */}
      {!editMode && (

        <div
          className="
            bg-white
            rounded-xl
            shadow
            overflow-hidden
          "
        >

          <div className="overflow-x-auto">

            <table
              className="
                w-full
                text-sm md:text-base
              "
            >

              <tbody>

                {[
                  ["Name", data.name],
                  ["Email", data.email],
                  ["Mobile", data.mobile],
                  ["Course", data.course],
                  ["Roll Number", data.rollNumber],
                  ["Year", data.year],
                  ["Division", data.division],
                  ["Semester", data.semester],
                  ["Father Name", data.fatherName],
                  ["Mother Name", data.motherName],
                  ["Gender", data.gender],
                  ["CGPA", data.cgpa],
                  ["Address", data.address]
                ].map(([label, value], i) => (

                  <tr
                    key={i}
                    className="border-t"
                  >

                    <th
                      className="
                        text-left
                        p-3 md:p-4
                        bg-gray-50
                        font-semibold
                        w-[40%]
                      "
                    >
                      {label}
                    </th>

                    <td
                      className="
                        p-3 md:p-4
                        break-words
                      "
                    >
                      {value || "-"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* BUTTON */}
          <div className="p-4">

            <button
              onClick={() =>
                setEditMode(true)
              }
              className="
                bg-yellow-500
                hover:bg-yellow-600
                text-white
                px-5 py-2
                rounded-lg
                font-medium
                w-full sm:w-auto
              "
            >
              Edit Profile
            </button>

          </div>

        </div>
      )}

      {/* ================= EDIT ================= */}
      {editMode && (

        <div
          className="
            bg-white
            p-4 md:p-6
            rounded-xl
            shadow
          "
        >

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >

            <Input
              label="Name"
              value={data.name}
              disabled
            />

            <Input
              label="Email"
              value={data.email}
              disabled
            />

            <Input
              label="Mobile"
              name="mobile"
              value={data.mobile}
              onChange={handleChange}
            />

            <Input
              label="Course"
              name="course"
              value={data.course}
              onChange={handleChange}
            />

            <Input
              label="Roll Number"
              value={data.rollNumber}
              disabled
            />

            <Input
              label="Year"
              value={data.year}
              disabled
            />

            <Input
              label="Division"
              value={data.division}
              disabled
            />

            <Input
              label="Semester"
              name="semester"
              value={data.semester}
              onChange={handleChange}
            />

            <Input
              label="Father Name"
              name="fatherName"
              value={data.fatherName}
              onChange={handleChange}
            />

            <Input
              label="Mother Name"
              name="motherName"
              value={data.motherName}
              onChange={handleChange}
            />

            <Input
              label="Gender"
              name="gender"
              value={data.gender}
              onChange={handleChange}
            />

            <Input
              label="CGPA"
              name="cgpa"
              value={data.cgpa}
              onChange={handleChange}
            />

            <div className="md:col-span-2">

              <Input
                label="Address"
                name="address"
                value={data.address}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* BUTTONS */}
          <div
            className="
              mt-5
              flex flex-col sm:flex-row
              gap-3
            "
          >

            <button
              onClick={update}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-5 py-2
                rounded-lg
                w-full sm:w-auto
              "
            >
              Save Changes
            </button>

            <button
              onClick={() =>
                setEditMode(false)
              }
              className="
                bg-gray-400
                hover:bg-gray-500
                text-white
                px-5 py-2
                rounded-lg
                w-full sm:w-auto
              "
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

// ================= INPUT =================
const Input = ({
  label,
  ...props
}) => (

  <div>

    <label
      className="
        block text-sm
        font-medium mb-1
      "
    >
      {label}
    </label>

    <input
      {...props}
      className={`
        w-full
        border
        rounded-lg
        px-3 py-2
        outline-none

        ${props.disabled
          ? "bg-gray-100 cursor-not-allowed"
          : "focus:ring-2 focus:ring-blue-400"
        }
      `}
    />

  </div>
);

export default Student;