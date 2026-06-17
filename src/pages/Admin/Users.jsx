import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoIosSearch } from "react-icons/io";

const BASE_URL = "https://petmarket.runasp.net/api/Admin/GetAllUsers";
const IMG_BASE = "https://petmarket.runasp.net";

const Users = () => {
  const { token } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 4;

  // 🔥 Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          PageNumber: page,
          PageSize: pageSize,
          Search: search,
        },
      });

      setUsers(res.data.data.items);
      setTotalItems(res.data.data.totalItemsCount);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // 🔥 Helpers
  const totalPages = Math.ceil(totalItems / pageSize);

  const getFullName = (u) =>
    `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.userName;

  const getInitial = (u) =>
    (u.firstName?.[0] || u.userName?.[0] || "U").toUpperCase();

  const getRoleStyle = (role) => {
    switch (role) {
      case "Admin":
        return "bg-[#E7A01C] text-white font-medium";
      case "Customer":
        return "bg-gray-200 text-gray-600 font-medium";
      default:
        return "bg-blue-100 text-blue-600 font-medium";
    }
  };

  // 🔥 Fake Date Generator
  const getRandomDate = () => {
    const months = ["Oct", "Nov"];
    const month = months[Math.floor(Math.random() * months.length)];
    const day = Math.floor(Math.random() * 28) + 1;
    const year = 2023;
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="max-w-[1100px] p-6  font-inter tracking-wide">

      {/* 🔥 Header */}
      <div className="mb-10">
        <h1 className="text-[40px] font-bold text-[#011749]">
          User Registry
        </h1>
        <p className="text-[#44474E] mt-2 max-w-xl text-sm">
          Efficiently manage system access, roles, and veterinary staff credentials within
          the sanctuary ecosystem.
        </p>
      </div>

      {/* 🔥 Search + Stats */}
      <div className="max-w-[650px] mx-auto mb-8">

        <div className="grid md:grid-cols-3 gap-6 mb-8">


          {/* Search */}
          <div className="col-span-2 bg-white text-[#C4C6CF] rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <IoIosSearch />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full outline-none text-sm font-inter"
            />
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">
              TOTAL USERS
            </p>
            <h2 className="text-2xl font-bold text-[#011749]">
              {totalItems}
            </h2>
          </div>

        </div>
      </div>

      {/* 🔥 Table */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">

        <table className="w-full text-sm">

          {/* Header */}
          <thead className="bg-[#F3F4F5] text-[#44474E] text-xs font-medium">
            <tr>
              <th className="px-6 py-4 text-left">PROFILE</th>
              <th className="text-left">NAME & IDENTITY</th>
              <th className="text-center">ROLE</th>
              <th className="text-center">JOIN DATE</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.id}
                className={`border-b hover:bg-gray-50 ${i % 2 === 1 ? "bg-gray-50/40" : ""
                  }`}
              >

                {/* Profile */}
                <td className="px-6 py-5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-semibold text-[#011749]">
                    {u.personalPicture ? (
                      <img
                        src={IMG_BASE + u.personalPicture}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitial(u)
                    )}
                  </div>
                </td>

                {/* Name */}
                <td>
                  <div>
                    <p className="font-semibold text-[#011749]">
                      {getFullName(u)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {u.email}
                    </p>
                  </div>
                </td>

                {/* Role */}
                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getRoleStyle(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>
                </td>

                {/* Date */}
                <td className="text-center text-gray-500 text-sm">
                  {getRandomDate()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 🔥 Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-400">

        <p>
          Showing {(page - 1) * pageSize + 1} -{" "}
          {Math.min(page * pageSize, totalItems)} of {totalItems}
        </p>

        <div className="flex gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-1 bg-gray-100 text-[#001A3F] rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-1 bg-[#011749] text-white rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default Users;