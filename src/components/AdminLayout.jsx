import Navbar from "./Navbar";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { CartContext } from "./context/CartContext";
import { FavoriteContext } from "./context/FavoriteContext";

import { IoPawOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { TbEdit, TbUsers } from "react-icons/tb";
import { IoIosHelpCircleOutline, IoIosArrowForward } from "react-icons/io";
import { HiOutlineShoppingBag } from "react-icons/hi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { setCartItems } = useContext(CartContext);
  const { setFavorites } = useContext(FavoriteContext);

  const handleLogout = () => {
    logout();
    setCartItems([]);
    setFavorites([]);
    navigate("/signup");
  };

  const getNavClass = (isActive) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 h-[48px] ${isActive
      ? "text-white shadow-sm"
      : "text-gray-500 hover:bg-gray-100"
    }`;

  const activeStyle = {
    background: "linear-gradient(90deg, #F9FAFB 0%, #D1D5DB 0%, #011749 100%)",
    position: "relative"
  };

  const getActiveIndicator = (isActive) => isActive && (
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
  );

  const isPathActive = (path) => {
    if (path === "/admin/animals") {
      return location.pathname.startsWith("/admin/animals");
    }
    if (path === "/admin/shop") {
      return location.pathname.startsWith("/admin/shop");
    }
    if (path === "/admin/orders") {
      return location.pathname.startsWith("/admin/orders");
    }
    if (path === "/admin/requests") {
      return location.pathname.startsWith("/admin/requests");
    }
    return location.pathname === path;
  };

  return (
    <>
      <Navbar />

      <div className="flex bg-[#F6F7F9] min-h-screen pt-[65px] relative">
        {/* Sidebar - Floating Pill for Mobile/Tablet, Standard for Desktop */}
        <aside className="w-[70px] lg:w-[300px] shrink-0 transition-all duration-300 flex flex-col gap-4 p-2 lg:p-5 h-[calc(100vh-65px)] sticky top-[65px] z-40 bg-[#F6F7F9]">
          
          {/* Top Section Card */}
          <div className="bg-white rounded-full lg:rounded-[32px] py-6 lg:p-4 flex flex-col gap-6 lg:gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 lg:border-gray-100 items-center lg:items-stretch">
            <NavLink to="/admin/users" className="w-full">
              {() => {
                const isActive = isPathActive("/admin/users");
                return (
                  <div
                    className={`${getNavClass(isActive)} justify-center lg:justify-between relative overflow-hidden ${isActive ? "shadow-md" : ""}`}
                    style={isActive ? activeStyle : {}}
                    title="Manage User"
                  >
                    {getActiveIndicator(isActive)}
                    <div className="flex items-center gap-3">
                      <TbUsers className={`text-[22px] lg:text-xl ${isActive ? "text-white" : "text-gray-400"}`} />
                      <span className={`font-medium hidden lg:block ${isActive ? "text-white" : ""}`}>Manage User</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg hidden lg:block" />}
                  </div>
                );
              }}
            </NavLink>

            <NavLink to="/admin/animals" className="w-full">
              {() => {
                const isActive = isPathActive("/admin/animals");
                return (
                  <div
                    className={`${getNavClass(isActive)} justify-center lg:justify-between relative overflow-hidden ${isActive ? "shadow-md" : ""}`}
                    style={isActive ? activeStyle : {}}
                    title="Manage Animal"
                  >
                    {getActiveIndicator(isActive)}
                    <div className="flex items-center gap-3">
                      <IoPawOutline className={`text-[22px] lg:text-xl ${isActive ? "text-white" : "text-gray-400"}`} />
                      <span className={`font-medium hidden lg:block ${isActive ? "text-white" : ""}`}>Manage Animal</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg hidden lg:block" />}
                  </div>
                );
              }}
            </NavLink>

            <NavLink to="/admin/shop" className="w-full">
              {() => {
                const isActive = isPathActive("/admin/shop");
                return (
                  <div
                    className={`${getNavClass(isActive)} justify-center lg:justify-between relative overflow-hidden ${isActive ? "shadow-md" : ""}`}
                    style={isActive ? activeStyle : {}}
                    title="Manage Shop"
                  >
                    {getActiveIndicator(isActive)}
                    <div className="flex items-center gap-3">
                      <HiOutlineShoppingBag className={`text-[22px] lg:text-xl ${isActive ? "text-white" : "text-gray-400"}`} />
                      <span className={`font-medium hidden lg:block ${isActive ? "text-white" : ""}`}>Manage Shop</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg hidden lg:block" />}
                  </div>
                );
              }}
            </NavLink>

            <NavLink to="/admin/orders" className="w-full">
              {() => {
                const isActive = isPathActive("/admin/orders");
                return (
                  <div
                    className={`${getNavClass(isActive)} justify-center lg:justify-between relative overflow-hidden ${isActive ? "shadow-md" : ""}`}
                    style={isActive ? activeStyle : {}}
                    title="Orders"
                  >
                    {getActiveIndicator(isActive)}
                    <div className="flex items-center gap-3">
                      <HiOutlineShoppingBag className={`text-[22px] lg:text-xl ${isActive ? "text-white" : "text-gray-400"}`} />
                      <span className={`font-medium hidden lg:block ${isActive ? "text-white" : ""}`}>Orders</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg hidden lg:block" />}
                  </div>
                );
              }}
            </NavLink>

            <NavLink to="/admin/requests" className="w-full">
              {() => {
                const isActive = isPathActive("/admin/requests");
                return (
                  <div
                    className={`${getNavClass(isActive)} justify-center lg:justify-between relative overflow-hidden ${isActive ? "shadow-md" : ""}`}
                    style={isActive ? activeStyle : {}}
                    title="Requests"
                  >
                    {getActiveIndicator(isActive)}
                    <div className="flex items-center gap-3">
                      <TbEdit className={`text-[22px] lg:text-xl ${isActive ? "text-white" : "text-gray-400"}`} />
                      <span className={`font-medium hidden lg:block ${isActive ? "text-white" : ""}`}>Requests</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg hidden lg:block" />}
                  </div>
                );
              }}
            </NavLink>

            <NavLink to="/admin/chat" className="w-full">
              {({ isActive }) => (
                <div
                  className={`${getNavClass(isActive)} justify-center lg:justify-between`}
                  style={isActive ? activeStyle : {}}
                  title="Chat Monitoring"
                >
                  <div className="flex items-center gap-3">
                    <TbEdit className={`text-[22px] lg:text-xl ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span className="font-medium hidden lg:block">Chat Monitoring</span>
                  </div>
                  {isActive && <IoIosArrowForward className="text-white text-lg hidden lg:block" />}
                </div>
              )}
            </NavLink>
          </div>

          {/* Bottom Section Card */}
          <div className="bg-white rounded-full lg:rounded-[32px] py-6 lg:p-4 flex flex-col gap-6 lg:gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 lg:border-gray-100 items-center lg:items-stretch">
            <NavLink to="/admin/settings" className="w-full">
              {({ isActive }) => (
                <div
                  className={`${getNavClass(isActive)} justify-center lg:justify-between`}
                  style={isActive ? activeStyle : {}}
                  title="Setting"
                >
                  <div className="flex items-center gap-3">
                    <IoSettingsOutline className={`text-[22px] lg:text-xl ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span className="font-medium hidden lg:block">Setting</span>
                  </div>
                  {isActive && <IoIosArrowForward className="text-white text-lg hidden lg:block" />}
                </div>
              )}
            </NavLink>

            <NavLink to="/admin/help" className="w-full">
              {({ isActive }) => (
                <div
                  className={`${getNavClass(isActive)} justify-center lg:justify-between`}
                  style={isActive ? activeStyle : {}}
                  title="Help & Support"
                >
                  <div className="flex items-center gap-3">
                    <IoIosHelpCircleOutline className={`text-[22px] lg:text-xl ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span className="font-medium hidden lg:block">Help & Support</span>
                  </div>
                  {isActive && <IoIosArrowForward className="text-white text-lg hidden lg:block" />}
                </div>
              )}
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center lg:justify-start gap-4 px-4 py-3 h-[48px] text-gray-400 hover:text-gray-600 transition-all duration-200"
              title="Logout"
            >
              <IoLogOutOutline className="text-2xl lg:text-xl" />
              <span className="font-medium hidden lg:block">Logout</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden pt-4 pb-12 px-2 lg:px-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;