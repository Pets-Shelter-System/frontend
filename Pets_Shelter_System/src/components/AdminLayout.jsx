import Navbar from "./Navbar";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import { IoPawOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { TbEdit, TbUsers } from "react-icons/tb";
import { IoIosHelpCircleOutline, IoIosArrowForward } from "react-icons/io";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getNavClass = (isActive) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
      ? "bg-gradient-to-r from-[#99999950]  to-[#011749] text-white shadow-sm"
      : "text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <>
      <Navbar />

      <div className="flex pt-[65px] bg-[#F6F7F9] min-h-screen">

        {/* Sidebar */}
        <div className="w-[300px] bg-[#F6F7F9] p-5 shrink-0">

          {/* Top Section */}
          <div className="bg-white rounded-[32px] p-4 flex flex-col gap-4 shadow">

            <NavLink to="/admin/users">
              {({ isActive }) => (
                <div className={`${getNavClass(isActive)} justify-between`}>

                  <span className="flex items-center gap-3">
                    <TbUsers className={isActive ? "text-white" : "text-gray-500"} />
                    Manage User
                  </span>

                  {isActive && (
                    <IoIosArrowForward className="text-white text-lg" />
                  )}

                </div>
              )}
            </NavLink>

            <NavLink to="/admin/animals">
              {({ isActive }) => (
                <div className={`${getNavClass(isActive)} justify-between`}>

                  <span className="flex items-center gap-1">
                    <IoPawOutline className={isActive ? "text-white" : "text-gray-500"} />
                    Manage Animal
                  </span>

                  {isActive && (
                    <IoIosArrowForward className="text-white text-lg" />
                  )}

                </div>
              )}
            </NavLink>

            <NavLink to="/admin/shop">
              {({ isActive }) => (
                <div className={`${getNavClass(isActive)} justify-between`}>

                  <span className="flex items-center gap-3">
                    <span>🛒</span>
                    Manage Shop
                  </span>

                  {isActive && (
                    <IoIosArrowForward className="text-white text-lg" />
                  )}

                </div>
              )}
            </NavLink>

            <NavLink to="/admin/requests">
              {({ isActive }) => (
                <div className={`${getNavClass(isActive)} justify-between`}>

                  <span className="flex items-center gap-3">
                    <TbEdit className={isActive ? "text-white" : "text-gray-500"} />
                    Requests
                  </span>

                  {isActive && (
                    <IoIosArrowForward className="text-white text-lg" />
                  )}

                </div>
              )}
            </NavLink>

            <NavLink to="/admin/chat">
              {({ isActive }) => (
                <div className={`${getNavClass(isActive)} justify-between`}>

                  <span className="flex items-center gap-3">
                    <TbEdit className={isActive ? "text-white" : "text-gray-500"} />
                    Chat Monitoring
                  </span>

                  {isActive && (
                    <IoIosArrowForward className="text-white text-lg" />
                  )}

                </div>
              )}
            </NavLink>

          </div>

          {/* Bottom Section */}
          <div className="bg-white rounded-[32px] p-4 flex flex-col gap-4 shadow mt-6">

            <NavLink to="/admin/settings">
              {({ isActive }) => (
                <div className={`${getNavClass(isActive)} justify-between`}>

                  <span className="flex items-center gap-3">
                    <TbEdit className={isActive ? "text-white" : "text-gray-500"} />
                    Setting
                  </span>

                  {isActive && (
                    <IoIosArrowForward className="text-white text-lg" />
                  )}

                </div>
              )}
            </NavLink>

            <NavLink to="/admin/help">
              {({ isActive }) => (
                <div className={`${getNavClass(isActive)} justify-between`}>

                  <span className="flex items-center gap-3">
                    <IoIosHelpCircleOutline className={isActive ? "text-white" : "text-gray-500"} />
                    Help & Support
                  </span>

                  {isActive && (
                    <IoIosArrowForward className="text-white text-lg" />
                  )}

                </div>
              )}
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <IoLogOutOutline />
              Logout
            </button>

          </div>

        </div>
        {/* Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>

      </div>
    </>
  );
};

export default AdminLayout;