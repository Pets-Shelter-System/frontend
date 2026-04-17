import { useContext, useState } from "react";
import { FaBars, FaTimes, FaRegUser } from "react-icons/fa";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import logo from "../assets/logo.png";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { CartContext } from "./context/CartContext";
import { FavoriteContext } from "./context/FavoriteContext";
import { AuthContext } from "./context/AuthContext";

const Navbar = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { favorites, setFavorites } = useContext(FavoriteContext);
  const { token, setToken } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteCount = favorites.length;

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleCartClick = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please login to view your cart",
        confirmButtonText: "Login",
        showCancelButton: true,
      }).then(res => res.isConfirmed && navigate("/login"));
      return;
    }
    navigate("/cart");
  };

  const handleFavoriteClick = () => {
    if (!token) {
      toast.warning("Please login to view favorites ❤️");
      navigate("/login");
      return;
    }
    navigate("/favorite");
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCartItems([]);
    setFavorites([]);

    navigate("/");
  };

  const handleUserClick = () => {
    setUserMenuOpen(prev => !prev);
  };

  return (
    <nav className="bg-[#011749] text-white px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50 h-[65px]">

      {/* Logo */}
      <Link to="/" onClick={() => setMenuOpen(false)}>
        <img src={logo} alt="Petopia" className="w-[110px]" />
      </Link>

      {/* Toggle button */}
      <button
        className="md:hidden text-yellow-400 text-2xl"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Desktop menu */}
      <ul className="hidden md:flex gap-6 items-center">
        <li><Link to="/" className={`px-4 py-1 rounded-full font-medium ${location.pathname === "/" ? "bg-login-btn" : ""}`}>Home</Link></li>
        <li><Link to="/shop" className={`px-4 py-1 rounded-full font-medium ${location.pathname === "/shop" ? "bg-login-btn" : ""}`}>Shop</Link></li>
        <li><Link to="/adoption" className={`px-4 py-1 rounded-full font-medium ${location.pathname.startsWith("/adoption") ? "bg-login-btn" : ""}`}>Adopt</Link></li>
        <li><span className="font-medium">Foster</span></li>
        <li><span className="font-medium">Sponsor</span></li>
        <li><span className="font-medium">Contact</span></li>
      </ul>

      {/* Desktop Icons */}
      <div className="hidden md:flex items-center gap-4">

        {/* Cart */}
        <span onClick={handleCartClick} className="bg-login-btn p-2 rounded-full relative cursor-pointer">
          <IoCartOutline className="text-white text-xl" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </span>

        {/* Fav */}
        <span onClick={handleFavoriteClick} className="bg-[#E7A01C] p-2 rounded-full relative cursor-pointer">
          <IoHeartOutline className="text-white text-lg" />
          {favoriteCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {favoriteCount}
            </span>
          )}
        </span>

        {/* User */}
        <div className="relative">
          <span
            onClick={handleUserClick}
            className="bg-login-btn w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
          >
            <FaRegUser />
          </span>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white text-[#011749] rounded-xl shadow-lg flex flex-col">

              {!token ? (
                <>
                  <Link to="/login" className="px-4 py-2 hover:bg-gray-100">Login</Link>
                  <Link to="/signup" className="px-4 py-2 hover:bg-gray-100">Sign up</Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/admin/requests")}
                    className="px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 text-left text-red-500"
                  >
                    Logout
                  </button>
                </>
              )}

            </div>
          )}
        </div>

      </div>

      {/* Mobile Menu */}
      <div
        className={`
          absolute top-[65px] left-0 w-full bg-[#011749] flex flex-col items-center gap-5 py-6 z-40 shadow-md
          transition-all duration-500 ease-in-out
          ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
      >
        <Link to="/" onClick={() => setMenuOpen(false)} className="text-lg text-white">Home</Link>
        <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-lg text-white">Shop</Link>
        <Link to="/adoption" className="text-white text-lg">Adopt</Link>

        <hr className="w-[90%] border-gray-600" />

        <div className="flex gap-4">
          <button onClick={() => { handleCartClick(); setMenuOpen(false); }} className="bg-login-btn p-3 rounded-full">
            <IoCartOutline />
          </button>

          <button onClick={() => { handleFavoriteClick(); setMenuOpen(false); }} className="bg-[#E7A01C] p-3 rounded-full">
            <IoHeartOutline />
          </button>

          {!token ? (
            <Link to="/login" className="bg-login-btn px-5 py-2 rounded-full">
              Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="bg-login-btn px-5 py-2 rounded-full">
              Logout
            </button>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;