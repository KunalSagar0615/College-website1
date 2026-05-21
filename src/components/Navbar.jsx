import React, { useState } from 'react'
import { Link } from "react-router-dom"
import logo from "../assets/logo.png"

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-linear-to-r from-slate-900 via-blue-900 to-slate-800 text-white shadow-lg">

      <div className="flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-10 filter brightness-0 invert" />
          <span className="font-semibold text-lg">
            Zeal Institute of Technology ,Sangli
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-lg items-center">
          <li className="hover:text-blue-300 transition">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-blue-300 transition">
            <Link to="/department">Department</Link>
          </li>
          <li className="hover:text-blue-300 transition">
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-blue-300 transition">
            <Link to="/contact">Contact</Link>
          </li>
          <li className="hover:text-blue-300 transition">
            <Link to="/complaint">Complaint</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>

        {/* Mobile Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="flex flex-col items-center gap-5 pb-5 md:hidden text-lg bg-slate-900">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/department">Department</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/complaint">Complaint</Link></li>
        </ul>
      )}

    </nav>
  )
}

export default Navbar