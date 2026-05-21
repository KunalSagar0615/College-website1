import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Department from "./components/Department.jsx";
import Complaint from "./components/Complaint.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Gallarysection from "./components/Gallarysection.jsx";

import Student from "./components/Student.jsx";
import Admin from "./components/Admin.jsx";
import Report from "./components/Report.jsx";

const App = () => {

  // ================= PROTECTED ROUTE =================
  const ProtectedRoute = ({ children, role }) => {

    const admin =
      JSON.parse(localStorage.getItem("admin"));

    const student =
      JSON.parse(localStorage.getItem("user"));

    // 🔥 ADMIN CHECK
    if (role === "ADMIN") {

      if (!admin) {
        return <Navigate to="/login" replace />;
      }

      return children;
    }

    // 🔥 STUDENT CHECK
    if (role === "STUDENT") {

      if (!student) {
        return <Navigate to="/login" replace />;
      }

      return children;
    }

    return <Navigate to="/login" replace />;
  };

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />}>
          <Route
            path="gallarysection"
            element={<Gallarysection />}
          />
        </Route>

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/department" element={<Department />} />

        <Route path="/complaint" element={<Complaint />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================= REPORT ================= */}

        <Route path="/report" element={<Report />} />

        {/* ================= STUDENT ROUTE ================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute role="STUDENT">
              <Student />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTE ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
};

export default App;