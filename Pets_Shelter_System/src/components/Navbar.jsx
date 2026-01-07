import { useContext, useState } from "react";
import { FaBars, FaTimes, FaRegUser  } from "react-icons/fa";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import logo from "../assets/logo.png";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
 import { toast } from "react-toastify";

import { CartContext } from "./context/CartContext";
import { FavoriteContext } from "./context/FavoriteContext";

const Navbar = () => {
   
  const { cartItems } = useContext(CartContext);
const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

const cartCount = cartItems.reduce(
  (sum, item) => sum + item.quantity,
  0
);

 

  const toggleMenu = () => setMenuOpen(!menuOpen);


const handleCartClick = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login required",
      text: "Please login or sign up to view your cart",
      confirmButtonText: "Login",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
    return;
  }

  navigate("/cart");
};

const favoriteCount = favorites.length;

const handleFavoriteClick = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.warning("Please login to view your favorites ❤️");
    navigate("/login");
    return;
  }
  navigate("/favorite");
};


  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

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

      <div className="hidden md:flex items-center justify-center gap-4">
        <span
  onClick={handleCartClick}
  className="bg-login-btn p-2 rounded-full relative flex items-center justify-center cursor-pointer"
>
  <IoCartOutline className="text-white text-xl" />
 {cartCount > 0 && (
  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
    {cartCount}
  </span>
)}

</span>

 <span
  onClick={handleFavoriteClick}
  className="bg-[#E7A01C] p-2 rounded-full relative flex items-center justify-center cursor-pointer"
>
  <IoHeartOutline className="text-white text-lg" />
  {favoriteCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {favoriteCount}
    </span>
  )}
</span>



        {token ? (
  // ✅ Logged in
  <button
    onClick={handleLogout}
    className="bg-login-btn px-4 py-1 rounded-full font-medium"
  >
    Logout
  </button>
) : (
  // ❌ Not logged in
  <div className="relative">
    <span
      onClick={() => setUserMenuOpen(!userMenuOpen)}
      className="bg-login-btn p-[8px] rounded-full flex items-center justify-center cursor-pointer"
    >
      <FaRegUser className="text-sm" />
    </span>

    {userMenuOpen && (
      <div className="absolute right-0 mt-2 w-32 bg-white text-[#011749] rounded-xl shadow-lg flex flex-col z-50">
        <Link
          to="/login"
          className="px-4 py-2 hover:bg-gray-100 rounded-t-xl"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 hover:bg-gray-100 rounded-b-xl"
        >
          Sign up
        </Link>
      </div>
    )}
  </div>
)}

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
          <span
  onClick={() => {
    setMenuOpen(false);
    handleCartClick();
  }}
  className="bg-login-btn p-2 rounded-full relative flex items-center justify-center cursor-pointer"
>
  <IoCartOutline className="text-white text-xl" />
   <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
       
    </span>
</span>


          {token ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-login-btn text-white px-4 py-1 rounded-full font-medium"
            >
              Logout
            </button>
          ) : (
            <div className="relative">
              <span
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="bg-login-btn p-[9px] rounded-full flex items-center justify-center"
              >
                <FaRegUser className="text-white text-xl" />
              </span>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white text-[#011749] rounded-xl shadow-lg flex flex-col z-50">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100 rounded-t-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100 rounded-b-xl"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
