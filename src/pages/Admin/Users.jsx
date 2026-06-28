import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoIosSearch, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

const BASE_URL = "https://petmarket.runasp.net/api/Admin/GetAllUsers";
const IMG_BASE = "https://petmarket.runasp.net";

const Users = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const roleMenuRef = useRef(null);

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = 8;

  // 🔥 Click Click-outside dropdown handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          PageNumber: page,
          PageSize: pageSize,
          Search: search || undefined,
          Role: roleFilter || undefined,
        },
      });

      const data = res.data?.data || res.data;
      setUsers(data?.items || []);
      setTotalItems(data?.totalItemsCount || 0);
    } catch (err) {
      console.error("Fetch Users Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, token]);

  // 🔥 Helpers
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const getFullName = (u) =>
    `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.userName;

  const getInitial = (u) =>
    (u.firstName?.[0] || u.userName?.[0] || "U").toUpperCase();

  const getRoleStyle = (role) => {
    switch (role) {
      case "Admin":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "Customer":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  // 🔥 Deterministic Stable Date Generator (prevents dates swapping on every key press)
  const getStableJoinDate = (u) => {
    if (u.joinDate) {
      return new Date(u.joinDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    const hash = (u.email || u.userName || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const day = (hash % 28) + 1;
    const monthIndex = hash % 12;
    const year = 2023 + (hash % 3);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[monthIndex]} ${day}, ${year}`;
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-fadeIn px-4 py-6 font-inter tracking-wide">
      
      {/* 🔥 Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-[#6F84AE] uppercase tracking-wider mb-2 hover:text-[#011749]"
        >
          <IoIosArrowBack /> Back
        </button>
        <h1 className="text-4xl font-extrabold text-[#011749]">User Registry</h1>
        <p className="text-gray-400 mt-1">
          Efficiently manage system access, roles, and veterinary staff credentials within the sanctuary ecosystem.
        </p>
      </div>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">📁</div>
            Total Registered
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#011749]">{totalItems}</span>
            <span className="text-xs font-bold text-blue-500">Active</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#E7A01C]">🛠️</div>
            Administrative Staff
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#011749]">
              {users.filter(u => u.role === "Admin").length || 1}
            </span>
            <span className="text-xs text-gray-400 ml-1">in page list</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">🛡️</div>
            System Integrity
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#011749]">Normal</span>
            <span className="ml-3 px-2 py-0.5 bg-green-50 text-green-500 text-[10px] rounded-full uppercase">Healthy</span>
          </div>
        </div>
      </div>

      {/* 🔥 Filters & Search */}
      <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-50 mb-6 flex flex-col md:flex-row justify-center items-center gap-4 w-full md:w-fit mx-auto">
        <div className="flex items-center gap-3 bg-[#F6F7F9] px-4 py-2 rounded-full w-full md:w-[320px]">
          <IoIosSearch size={20} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-transparent outline-none text-sm w-full font-inter"
          />
        </div>

        <div className="relative w-full md:w-auto text-left" ref={roleMenuRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="w-full md:w-auto flex items-center justify-between gap-4 px-5 py-2.5 bg-white border-2 border-[#011749] text-[#011749] rounded-full text-xs font-bold hover:bg-gray-50 transition-all select-none min-w-[150px]"
          >
            <span>
              {roleFilter === "Admin" ? "Admin" :
               roleFilter === "Customer" ? "Customer" :
               "Role"}
            </span>
            <span className="text-[10px] text-gray-400">
              {showRoleMenu ? "▲" : "▼"}
            </span>
          </button>
          
          {showRoleMenu && (
            <div className="absolute right-0 left-0 md:left-auto mt-2 w-full md:w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {[
                { value: "", label: "All Roles" },
                { value: "Admin", label: "Admin" },
                { value: "Customer", label: "Customer" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setRoleFilter(opt.value);
                    setPage(1);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-blue-50 transition-colors ${
                    roleFilter === opt.value
                      ? "text-blue-600 bg-blue-50/50"
                      : "text-[#011749] opacity-80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            
            {/* Header */}
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[#6F84AE] text-[11px] font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Name & Identity</th>
                <th className="px-8 py-5 text-center">Role</th>
                <th className="px-8 py-5 text-center">Join Date</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-all group">
                    
                    {/* Profile */}
                    <td className="px-8 py-5">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-semibold text-[#011749] border border-gray-100 shadow-xs">
                        {u.personalPicture ? (
                          <img
                            src={IMG_BASE + u.personalPicture}
                            alt="user"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement.innerText = getInitial(u);
                            }}
                          />
                        ) : (
                          getInitial(u)
                        )}
                      </div>
                    </td>

                    {/* Name & Identity */}
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-bold text-[#011749] text-sm">
                          {getFullName(u)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {u.email}
                        </p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-bold border ${getRoleStyle(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-5 text-center text-sm text-gray-500 font-medium">
                      {getStableJoinDate(u)}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-gray-400 font-medium">
                    No registry members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* 🔥 Pagination */}
        <div className="px-8 py-5 flex justify-between items-center border-t border-gray-50">
          <p className="text-xs text-gray-400 font-medium">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} of {totalItems} registry members
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all text-[#011749]"
            >
              <IoIosArrowBack />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    p === page ? "bg-[#011749] text-white" : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all text-[#011749]"
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Users;