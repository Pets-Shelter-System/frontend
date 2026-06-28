import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "./context/AuthContext";
import { CartContext } from "./context/CartContext";
import { FavoriteContext } from "./context/FavoriteContext";
import {
  IoSettingsOutline,
  IoLogOutOutline,
  IoMailOutline,
} from "react-icons/io5";
import { IoIosHelpCircleOutline, IoIosArrowForward } from "react-icons/io";

const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const { setCartItems } = useContext(CartContext);
  const { setFavorites } = useContext(FavoriteContext);

  const handleLogout = () => {
    logout();
    setCartItems([]);
    setFavorites([]);
    navigate("/signup");
  };

  const activeStyle = {
    background: "linear-gradient(90deg, #F9FAFB 0%, #D1D5DB 0%, #011749 100%)",
    position: "relative"
  };

  const getActiveIndicator = (isActive) => isActive && (
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
  );

  return (
    <div className="bg-[#F6F7F9] min-h-screen">
      <Navbar />
      <div className="flex pt-[65px] min-h-screen max-w-[1440px] mx-auto">
        {/* Sidebar - Floating Pill version */}
        <aside className="w-[70px] lg:w-[302px] shrink-0 flex flex-col gap-4 p-2 lg:p-6 h-[calc(100vh-65px)] sticky top-[65px] overflow-y-auto items-center lg:items-stretch">
          {/* Main Actions Card */}
          <div className="bg-white rounded-full lg:rounded-[30px] py-6 lg:p-4 flex flex-col gap-6 lg:gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 lg:border-gray-100 items-center lg:items-stretch">
            <NavLink to="/profile" className="w-full">
              {() => {
                const isProfileActive = location.pathname === "/profile" || location.pathname.startsWith("/profile/");
                const isSettingsActive = isProfileActive && !location.pathname.includes("/help") && !location.pathname.includes("/applications") && !location.pathname.includes("/orders") && !location.pathname.includes("/my-animals");

                return (
                  <div
                    className={`h-[48px] lg:h-[54px] rounded-full lg:rounded-[16px] px-0 lg:px-5 flex items-center justify-center lg:justify-between transition-all duration-200 relative overflow-hidden ${
                      isSettingsActive ? "text-white shadow-md" : "text-[#777] hover:bg-[#F5F5F5]"
                    }`}
                    style={isSettingsActive ? activeStyle : {}}
                    title="Setting"
                  >
                    {getActiveIndicator(isSettingsActive)}
                    <div className="flex items-center gap-3">
                      <IoSettingsOutline className={`text-[22px] ${isSettingsActive ? "text-white" : "text-gray-400"}`} />
                      <span className={`font-medium hidden lg:block ${isSettingsActive ? "text-white" : ""}`}>Setting</span>
                    </div>
                    {isSettingsActive && <IoIosArrowForward className="text-[20px] text-white hidden lg:block" />}
                  </div>
                );
              }}
            </NavLink>

            <NavLink to="/profile/help" className="w-full">
              {({ isActive }) => (
                <div
                  className={`h-[48px] lg:h-[54px] rounded-full lg:rounded-[16px] px-0 lg:px-5 flex items-center justify-center lg:justify-between transition-all duration-200 relative overflow-hidden ${
                    isActive ? "text-white shadow-md" : "text-[#777] hover:bg-[#F5F5F5]"
                  }`}
                  style={isActive ? activeStyle : {}}
                  title="Help & Support"
                >
                  {getActiveIndicator(isActive)}
                  <div className="flex items-center gap-3">
                    <IoIosHelpCircleOutline className={`text-[22px] ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span className={`font-medium hidden lg:block ${isActive ? "text-white" : ""}`}>Help & Support</span>
                  </div>
                  {isActive && <IoIosArrowForward className="text-[20px] text-white hidden lg:block" />}
                </div>
              )}
            </NavLink>
          </div>

          {/* Logout Card */}
          <div className="bg-white rounded-full lg:rounded-[30px] py-6 lg:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 items-center lg:items-stretch">
            <button
              onClick={handleLogout}
              className="h-[48px] lg:h-[54px] w-full rounded-full lg:rounded-[16px] px-0 lg:px-5 flex items-center justify-center lg:justify-start gap-3 text-[#777] hover:bg-[#F5F5F5] transition-colors"
              title="Logout"
            >
              <IoLogOutOutline className="text-[22px]" />
              <span className="font-medium hidden lg:block">Logout</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-12">
          <div className="p-2 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
