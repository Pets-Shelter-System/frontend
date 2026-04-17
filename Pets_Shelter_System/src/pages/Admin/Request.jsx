import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

const Request = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        successRate: 0,
    });

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, []);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 4;
    const filteredRequests = requests.filter((item) =>
        `${item.applicantFirstName} ${item.applicantLastName} ${item.applicantEmail}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRequests = filteredRequests.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const getRequests = async () => {
        try {
            const res = await axios.get(
                "http://petmarket.runasp.net/api/Admin/GetAllApplications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data.data;

            setRequests(data.pagedResult.items);

            setStats({
                pending: data.pendingRequestsCount,
                approved: data.approvedRequestsCount,
                rejected: data.rejectedRequestsCount,
                successRate: data.successRate,
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getRequests();
    }, []);

    // 🎨 Status color
    const getStatusStyle = (status) => {
        switch (status) {
            case "Pending":
                return "flex items-center justify-center gap-2 text-[#B45309]";
            case "Approved":
                return "flex items-center justify-center gap-2 text-[#047857]";
            case "Rejected":
                return "flex items-center justify-center gap-2 text-[#BA1A1A]";
            default:
                return "";
        }
    };

    return (
        <div className="p-6">

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#011749]">
                Requests Management
            </h1>
            <p className="text-[#6F84AE] mt-1">
                Review and process all pending animal care applications.
            </p>

            {/* Stats */}
            <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">

                {/* LEFT SIDE */}
                <div className="flex gap-6 flex-wrap">

                    {/* Pending */}
                    <div className="bg-white rounded-[20px] px-6 py-5 shadow-sm w-[220px]">
                        <p className="font-inter font-bold text-[#6F84AE]  tracking-wide">PENDING REVIEW</p>
                        <h2 className="text-2xl font-bold text-[#011749] mt-2">
                            {stats.pending}
                        </h2>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-[2px] h-[80px] bg-gray-200 self-center"></div>

                    {/* Active */}
                    <div className="bg-white rounded-[20px] px-6 py-5 shadow-sm w-[220px]">
                        <p className="font-inter font-bold text-[#6F84AE]  tracking-wide">ACTIVE REQUESTS</p>

                        <h2 className="text-2xl font-bold text-[#011749] mt-2">
                            {requests.length}
                        </h2>


                    </div>

                </div>

                {/* RIGHT SIDE (Success Rate) */}
                <div className="bg-[#011749] text-white rounded-[20px] px-6 py-5 w-[260px]">

                    <p className="font-inter font-bold text-[#B0CDFF]  tracking-wide">SUCCESS RATE</p>

                    <h2 className="text-2xl font-bold mt-2">
                        {stats.successRate}%
                    </h2>

                    {/* Progress */}
                    <div className="w-full bg-white/20 h-2 rounded mt-4">
                        <div
                            className="bg-white h-2 rounded"
                            style={{ width: `${stats.successRate}%` }}
                        ></div>
                    </div>

                </div>

            </div>

            {/* Table */}
            <div className="mt-8 bg-white p-5 rounded-2xl shadow">

                <div className="flex items-center justify-between mb-6">
                    {/* Tabs */}
                    <div className="flex gap-4 items-center">
                        <button className="bg-[#011749] text-white px-5 py-1.5 rounded-full text-sm font-medium">
                            Adoption
                        </button>
                        <button className="text-gray-400 text-sm font-medium">Foster</button>
                        <button className="text-gray-400 text-sm font-medium">Sponsor</button>
                    </div>

                    {/* Search */}
                    <div className="ml-auto">
                        <input
                            type="text"
                            placeholder="Search petitioner..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-[#F6F7F9] px-4 py-2 rounded-full outline-none text-sm w-[220px]"
                        />
                    </div>

                </div>

                {/* Table */}
                <table className="w-full text-sm text-left mt-5">

                    <thead className="border-b">
                        <tr className="text-[#6F84AE] font-inter text-xs tracking-wide text-center">
                            <th className="text-[#6F84AE] font-inter text-xs tracking-wide py-3 text-left">PETITIONER</th>
                            <th className="text-[#6F84AE] font-inter text-xs tracking-wide text-center">ANIMAL</th>
                            <th className="text-[#6F84AE] font-inter text-xs tracking-wide text-center">TYPE</th>
                            <th className="text-[#6F84AE] font-inter text-xs tracking-wide text-center">DATE SUBMITTED</th>
                            <th className="text-[#6F84AE] font-inter text-xs tracking-wide text-center">STATUS</th>
                            <th className="text-[#6F84AE] font-inter text-xs tracking-wide text-center">ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentRequests.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50 text-center">

                                {/* User */}
                                <td className="py-3 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                        {item.applicantFirstName[0]}
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            {item.applicantFirstName} {item.applicantLastName}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            {item.applicantEmail}
                                        </p>
                                    </div>
                                </td>

                                {/* Animal */}
                                <td className="py-3">
                                    <div className="flex flex-col items-center gap-1">
                                        <img
                                            src={`http://petmarket.runasp.net${item.animalPictureUrl}`}
                                            alt=""
                                            className="w-10 h-10 rounded-md object-cover"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {item.animalName}
                                        </span>
                                    </div>
                                </td>

                                {/* Type */}
                                <td>
                                    <span className="font-inter font-bold tracking-wide text-[#1D4ED8] bg-[#EFF6FF] px-2 py-1 rounded-full">
                                        ADOPTION
                                    </span>
                                </td>

                                {/* Date */}
                                <td>
                                    {new Date(item.submittedAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                    })}
                                </td>

                                {/* Status */}
                                <td className="align-middle">
                                    <div className={getStatusStyle(item.statusName)}>
                                        <span
                                            className={`w-2 h-2 rounded-full shadow-md ${item.statusName === "Pending"
                                                ? "bg-[#F59E0B] shadow-[#F59E0B99]"
                                                : item.statusName === "Approved"
                                                    ? "bg-[#10B981] shadow-[#10B98199]"
                                                    : "bg-[#BA1A1A] shadow-[#BA1A1A99]"
                                                }`}
                                        ></span>

                                        {item.statusName}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="text-center">
                                    <button className="text-[#011749] text-lg">
                                        <IoEyeOutline />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                    <p>
                        Showing {currentRequests.length} of {filteredRequests.length} requests
                    </p>

                    <div className="flex gap-2">

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="px-3 py-1 rounded border text-gray-500"
                        >
                            Previous
                        </button>

                        <span className="px-2 text-gray-600">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            className="bg-[#011749] text-white px-4 py-1 rounded"
                        >
                            Next
                        </button>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default Request;