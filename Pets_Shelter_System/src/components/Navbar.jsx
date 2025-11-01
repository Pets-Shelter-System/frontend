import { useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-[#011749] text-white px-10 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src={logo}
            alt="Petopia-Logo"
            className="w-[110px] h-auto object-contain"
          />
        </Link>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex flex-row gap-6 items-center ml-8">
        <li>
          <Link
            to="/"
            className="bg-[#FFC862] px-4 py-1 rounded-full font-medium transition"
          >
            Home
          </Link>
        </li>
        <li><a className="font-medium">Shop</a></li>
        <li><a className="font-medium">Adopt</a></li>
        <li><a className="font-medium">Foster</a></li>
        <li><a className="font-medium">Sponsor</a></li>
        <li><a className="font-medium">Contact</a></li>
      </ul>

      {/* Desktop Login */}
      <div className="hidden md:flex items-center gap-3">
        <Link to="/login">
          <button className="bg-[#E7A01C] px-4 py-1 rounded-full font-medium">
            Login
          </button>
        </Link>
        <Link to="/login">
          <span className="bg-[#E7A01C] p-[8px] rounded-full flex items-center justify-center cursor-pointer">
            <FaUser className="text-sm cursor-pointer" />
          </span>
        </Link>
      </div>

      {/* Toggle Button */}
      <button
        className="md:hidden text-yellow-400 focus:outline-none text-2xl ml-auto z-30"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      <ul
        className={`flex flex-col absolute top-full left-0 w-full bg-[#011749] px-6 py-4 space-y-3 shadow-md z-20 transform transition-all duration-500 ease-in-out ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-5 pointer-events-none"
        } md:hidden`}
      >
        <li>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="bg-yellow-400 text-[#011749] px-4 py-1 rounded-full font-medium text-center block"
          >
            Home
          </Link>
        </li>
        <li>
          <a className="text-white hover:text-yellow-400 transition font-medium text-center block">
            Shop
          </a>
        </li>
        <li>
          <a className="text-white hover:text-yellow-400 transition font-medium text-center block">
            Adopt
          </a>
        </li>
        <li>
          <a className="text-white hover:text-yellow-400 transition font-medium text-center block">
            Foster
          </a>
        </li>
        <li>
          <a className="text-white hover:text-yellow-400 transition font-medium text-center block">
            Sponsor
          </a>
        </li>
        <li>
          <a className="text-white hover:text-yellow-400 transition font-medium text-center block">
            Contact
          </a>
        </li>

        <div className="flex justify-center gap-3 pt-3 border-t border-gray-700">
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <button className="bg-yellow-400 text-[#011749] px-4 py-1 rounded-full font-medium">
              Login
            </button>
          </Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <span className="bg-yellow-400 p-[9px] rounded-full flex items-center justify-center">
              <FaUser className="text-[#011749] text-xl" />
            </span>
          </Link>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
