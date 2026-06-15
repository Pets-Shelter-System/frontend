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
  const { token, setToken, user } = useContext(AuthContext);
  console.log(user)

  // const imageUrl = user?.pictureUrl
  //   ? `http://petmarket.runasp.net${user.personalPicture}?v=${Date.now()}`
  //   : null;

  // const avatarFallback =
  //   user?.firstName?.charAt(0)?.toUpperCase() ||
  //   user?.email?.charAt(0)?.toUpperCase() ||
  //   "U";

  const imageUrl = user?.pictureUrl
    ? `http://petmarket.runasp.net${user.pictureUrl}?v=${Date.now()}`
    : null;

  const avatarFallback =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.username?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleUserClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    const rawRole =
      user?.role ||
      user?.roles?.[0] ||
      user?.userRole ||
      user?.Role ||
      "";

    const role = String(rawRole).toLowerCase();

    if (role === "admin") {
      navigate("/admin/users");
    } else {
      navigate("/profile");
    }
  };

  const renderAvatar = (size = "40px") => (
    <button
      onClick={() => { handleUserClick(); setMenuOpen(false); }}
      className={`
        rounded-full
        overflow-hidden
        cursor-pointer
        border-2
        border-white/20
        shadow-md
        hover:scale-105
        transition
        bg-[#EDEDED]
        flex
        items-center
        justify-center
        shrink-0
      `}
      style={{ width: size, height: size }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.innerHTML = `<span class="text-[#011749] font-bold text-sm">${avatarFallback}</span>`;
          }}
        />
      ) : (
        <span className="text-[#011749] font-bold text-sm">
          {avatarFallback}
        </span>
      )}
    </button>
  );

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
        <li><Link to="/foster" className={`px-4 py-1 rounded-full font-medium ${location.pathname.startsWith("/foster") ? "bg-login-btn" : ""}`}>Foster</Link></li>
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

        {/* User Avatar */}
        {token ? (
          renderAvatar("40px")
        ) : (
          <span
            onClick={() => navigate("/login")}
            className="bg-login-btn w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition"
          >
            <FaRegUser />
          </span>
        )}

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
        <Link to="/adoption" onClick={() => setMenuOpen(false)} className="text-white text-lg">Adopt</Link>
        <Link to="/foster" onClick={() => setMenuOpen(false)} className="text-white text-lg">Foster</Link>

        <hr className="w-[90%] border-gray-600" />

        <div className="flex items-center gap-4">
          <button onClick={() => { handleCartClick(); setMenuOpen(false); }} className="bg-login-btn p-3 rounded-full relative">
            <IoCartOutline className="text-white text-xl" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>

          <button onClick={() => { handleFavoriteClick(); setMenuOpen(false); }} className="bg-[#E7A01C] p-3 rounded-full relative">
            <IoHeartOutline className="text-white text-lg" />
            {favoriteCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{favoriteCount}</span>}
          </button>

          {token ? (
            <div className="flex items-center gap-2">
              {renderAvatar("45px")}
              <span className="text-sm font-medium text-white/80">{user?.username || user?.firstName}</span>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-login-btn px-6 py-2 rounded-full font-bold">
              Login
            </Link>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;