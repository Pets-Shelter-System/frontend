import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "./context/AuthContext";
import { CartContext } from "./context/CartContext";
import { FavoriteContext } from "./context/FavoriteContext";
import { IoSettingsOutline, IoLogOutOutline, IoMailOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline, IoIosArrowForward } from "react-icons/io";

const ProfileLayout = () => {
    const navigate = useNavigate();
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
        background: "linear-gradient(90deg, rgba(153, 153, 153, 0) 0%, #011749 100%)"
    };

    return (
        <div className="bg-[#F6F7F9] min-h-screen">
            <Navbar />
           <div className="flex flex-col md:flex-row items-start pt-[65px] px-5 min-h-screen max-w-[1440px] mx-auto">
                {/* Sidebar / Navigation Card */}
                <div className="w-full md:w-[280px] lg:w-[302px] pt-6 shrink-0">
                    <div
                        className="
                            bg-white
                            rounded-[24px] lg:rounded-[30px]
                            px-[10px] md:px-[15px] lg:px-[10px]
                            py-[15px] md:py-[20px]
                            lg:h-[274px]
                            flex
                            flex-col
                            gap-4 md:gap-6 lg:gap-[33px]
                            shadow-sm
                            transition-all
                        "
                    >
                        {/* User Email Row */}
                        {/* <div className="px-4 py-2 border-b border-gray-50 flex items-center gap-3 text-[#011749]">
                            <IoMailOutline className="text-xl shrink-0" />
                            <span className="text-sm font-bold truncate">{user?.email || "User Account"}</span>
                        </div> */}

                        {/* Navigation Items */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 md:gap-4 lg:gap-[33px] flex-1">
                            {/* Settings */}
                            <NavLink to="/profile" end className="flex-1">
                                {({ isActive }) => (
                                    <div
                                        className={`
                                            h-[50px] md:h-[54px]
                                            rounded-[16px]
                                            px-5
                                            flex
                                            items-center
                                            justify-between
                                            transition-all
                                            duration-200
                                            ${isActive ? "text-white" : "text-[#777] hover:bg-[#F5F5F5]"}
                                        `}
                                        style={isActive ? activeStyle : {}}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IoSettingsOutline className="text-[22px]" />
                                            <span className="font-medium inline">Setting</span>
                                        </div>
                                        <IoIosArrowForward className={`text-[20px] transition-transform ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                                    </div>
                                )}
                            </NavLink>

                            {/* Help */}
                            <NavLink to="/profile/help" className="flex-1">
                                {({ isActive }) => (
                                    <div
                                        className={`
                                            h-[50px] md:h-[54px]
                                            rounded-[16px]
                                            px-5
                                            flex
                                            items-center
                                            justify-between
                                            transition-all
                                            duration-200
                                            ${isActive ? "text-white" : "text-[#777] hover:bg-[#F5F5F5]"}
                                        `}
                                        style={isActive ? activeStyle : {}}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IoIosHelpCircleOutline className="text-[22px]" />
                                            <span className="font-medium">Help & Support</span>
                                        </div>
                                        <IoIosArrowForward className={`text-[20px] transition-transform ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                                    </div>
                                )}
                            </NavLink>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="
                                    h-[50px] md:h-[54px]
                                    rounded-[16px]
                                    px-5
                                    flex
                                    items-center
                                    gap-3
                                    text-[#777]
                                    hover:bg-[#F5F5F5]
                                    transition-colors
                                    sm:ml-auto lg:ml-0
                                "
                            >
                                <IoLogOutOutline className="text-[22px]" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="p-4 md:p-0 lg:px-6 pb-6]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
