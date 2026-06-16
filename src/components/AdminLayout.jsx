import Navbar from "./Navbar";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
    background: "linear-gradient(90deg, rgba(153, 153, 153, 0) 0%, #011749 100%)"
  };

  return (
    <>
      <Navbar />

      <div className="flex pt-[65px] bg-[#F6F7F9] min-h-screen">
        {/* Sidebar */}
        <div className="w-[300px] bg-[#F6F7F9] p-5 shrink-0 hidden md:block">
          <div className="bg-white rounded-[32px] p-4 flex flex-col gap-4 shadow-sm border border-gray-100 h-full overflow-y-auto">

            {/* Top Section */}
            <div className="flex flex-col gap-2">
              <NavLink to="/admin/users">
                {({ isActive }) => (
                  <div
                    className={`${getNavClass(isActive)} justify-between`}
                    style={isActive ? activeStyle : {}}
                  >
                    <div className="flex items-center gap-3">
                      <TbUsers className={isActive ? "text-white" : "text-gray-500"} />
                      <span className="font-medium">Manage User</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg" />}
                  </div>
                )}
              </NavLink>

              <NavLink to="/admin/animals">
                {({ isActive }) => (
                  <div
                    className={`${getNavClass(isActive)} justify-between`}
                    style={isActive ? activeStyle : {}}
                  >
                    <div className="flex items-center gap-3">
                      <IoPawOutline className={isActive ? "text-white" : "text-gray-500"} />
                      <span className="font-medium">Manage Animal</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg" />}
                  </div>
                )}
              </NavLink>

              <NavLink to="/admin/shop">
                {({ isActive }) => (
                  <div
                    className={`${getNavClass(isActive)} justify-between`}
                    style={isActive ? activeStyle : {}}
                  >
                    <div className="flex items-center gap-3">
                      <HiOutlineShoppingBag className={isActive ? "text-white" : "text-gray-500"} />
                      <span className="font-medium">Manage Shop</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg" />}
                  </div>
                )}
              </NavLink>

              <NavLink to="/admin/requests">
                {({ isActive }) => (
                  <div
                    className={`${getNavClass(isActive)} justify-between`}
                    style={isActive ? activeStyle : {}}
                  >
                    <div className="flex items-center gap-3">
                      <TbEdit className={isActive ? "text-white" : "text-gray-500"} />
                      <span className="font-medium">Requests</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg" />}
                  </div>
                )}
              </NavLink>

              <NavLink to="/admin/chat">
                {({ isActive }) => (
                  <div
                    className={`${getNavClass(isActive)} justify-between`}
                    style={isActive ? activeStyle : {}}
                  >
                    <div className="flex items-center gap-3">
                      <TbEdit className={isActive ? "text-white" : "text-gray-500"} />
                      <span className="font-medium">Chat Monitoring</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg" />}
                  </div>
                )}
              </NavLink>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-2">
              <NavLink to="/admin/settings">
                {({ isActive }) => (
                  <div
                    className={`${getNavClass(isActive)} justify-between`}
                    style={isActive ? activeStyle : {}}
                  >
                    <div className="flex items-center gap-3">
                      <IoSettingsOutline className={isActive ? "text-white" : "text-gray-500"} />
                      <span className="font-medium">Setting</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg" />}
                  </div>
                )}
              </NavLink>

              <NavLink to="/admin/help">
                {({ isActive }) => (
                  <div
                    className={`${getNavClass(isActive)} justify-between`}
                    style={isActive ? activeStyle : {}}
                  >
                    <div className="flex items-center gap-3">
                      <IoIosHelpCircleOutline className={isActive ? "text-white" : "text-gray-500"} />
                      <span className="font-medium">Help & Support</span>
                    </div>
                    {isActive && <IoIosArrowForward className="text-white text-lg" />}
                  </div>
                )}
              </NavLink>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 h-[48px] text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <IoLogOutOutline className="text-xl" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;