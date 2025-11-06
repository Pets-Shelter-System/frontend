import { useState } from "react";
import { FaBars, FaTimes, FaRegUser  } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-[#011749] text-white px-10 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      <div className="flex items-center">
        <Link to="/">
          <img
            src={logo}
            alt="Petopia-Logo"
            className="w-[110px] h-auto object-contain"
          />
        </Link>
      </div>

      <ul className="hidden md:flex flex-row gap-6 items-center ml-8">
        <li>
          <Link
            to="/"
            className={`px-4 py-1 rounded-full font-medium transition ${
              location.pathname === "/" ? "bg-login-btn" : ""
            }`}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/shop"
            className={`font-medium px-4 py-1 rounded-full transition ${
              location.pathname === "/shop" ? "bg-login-btn" : ""
            }`}
          >
            Shop
          </Link>
        </li>

        <li>
          <a className="font-medium">Adopt</a>
        </li>
        <li>
          <a className="font-medium">Foster</a>
        </li>
        <li>
          <a className="font-medium">Sponsor</a>
        </li>
        <li>
          <a className="font-medium">Contact</a>
        </li>
      </ul>

      <div className="hidden md:flex items-center gap-4">
        <Link to="/cart">
          <span className="bg-login-btn p-2 rounded-full flex items-center justify-center cursor-pointer">
            <IoCartOutline className="text-white text-xl" />
          </span>
        </Link>

        <Link to="/login">
          <button className="bg-login-btn px-4 py-1 rounded-full font-medium">
            Login
          </button>
        </Link>

        <Link to="/login">
          <span className="bg-login-btn p-[8px] rounded-full flex items-center justify-center cursor-pointer">
            <FaRegUser  className="text-sm cursor-pointer" />
          </span>
        </Link>
      </div>

      <button
        className="md:hidden text-yellow-400 focus:outline-none text-2xl ml-auto z-30"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

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
            className={`px-4 py-1 rounded-full font-medium text-center block ${
              location.pathname === "/" ? "bg-login-btn text-white" : "bg-yellow-400 text-[#011749]"
            }`}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
            className={`text-center block font-medium px-4 py-1 rounded-full ${
              location.pathname === "/shop"
                ? "bg-login-btn text-white"
                : "text-white hover:text-yellow-400"
            }`}
          >
            Shop
          </Link>
        </li>

        <li>
          <a className="text-white text-center block hover:text-yellow-400 font-medium">
            Adopt
          </a>
        </li>

        <li>
          <a className="text-white text-center block hover:text-yellow-400 font-medium">
            Foster
          </a>
        </li>

        <li>
          <a className="text-white text-center block hover:text-yellow-400 font-medium">
            Sponsor
          </a>
        </li>

        <li>
          <a className="text-white text-center block hover:text-yellow-400 font-medium">
            Contact
          </a>
        </li>

        <div className="flex justify-center gap-3 pt-3 border-t border-gray-700">
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            <span className="bg-login-btn p-2 rounded-full flex items-center justify-center">
              <IoCartOutline className="text-white text-xl" />
            </span>
          </Link>

          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <button className="bg-login-btn text-white px-4 py-1 rounded-full font-medium">
              Login
            </button>
          </Link>

          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <span className="bg-login-btn p-[9px] rounded-full flex items-center justify-center">
              <FaRegUser  className="text-white text-xl" />
            </span>
          </Link>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
