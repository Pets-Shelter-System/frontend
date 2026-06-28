import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

const Request = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const IMG_BASE = "https://petmarket.runasp.net";

    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("Adoption");
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

    const getRequests = async (tab = activeTab) => {
        try {
            const baseUrl = tab === "Foster"
                ? "https://petmarket.runasp.net/api/Admin/GetAllFosterApplications"
                : "https://petmarket.runasp.net/api/Admin/GetAllApplications";

            const res = await axios.get(
                baseUrl,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data.data;

            setRequests(data.pagedResult?.items || []);

            setStats({
                pending: data.pendingRequestsCount || 0,
                approved: data.approvedRequestsCount || 0,
                rejected: data.rejectedRequestsCount || 0,
                successRate: data.successRate || 0,
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (token) {
            getRequests(activeTab);
        }
    }, [activeTab, token]);

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
            <div className="mt-6 flex flex-col xl:flex-row gap-6 items-stretch xl:items-start">

                {/* LEFT SIDE */}
                <div className="flex gap-6 flex-wrap">

                    {/* Pending */}
                    <div className="bg-white rounded-[20px] px-6 py-5 shadow-sm min-w-[200px] flex-1">
                        <p className="font-inter font-bold text-[#6F84AE]  tracking-wide">PENDING REVIEW</p>
                        <h2 className="text-2xl font-bold text-[#011749] mt-2">
                            {stats.pending}
                        </h2>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-[2px] h-[80px] bg-gray-200 self-center"></div>

                    {/* Active */}
                    <div className="bg-white rounded-[20px] px-6 py-5 shadow-sm min-w-[200px] flex-1">
                        <p className="font-inter font-bold text-[#6F84AE]  tracking-wide">ACTIVE REQUESTS</p>

                        <h2 className="text-2xl font-bold text-[#011749] mt-2">
                            {requests.length}
                        </h2>


                    </div>

                </div>

                {/* RIGHT SIDE (Success Rate) */}
                <div className="bg-[#011749] text-white rounded-[20px] px-6 py-5 w-full xl:w-[260px]">

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
            <div className="mt-8 bg-white p-4 sm:p-6 rounded-2xl shadow overflow-hidden">

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex gap-2 sm:gap-4 items-center overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
                        <button
                            onClick={() => { setActiveTab("Adoption"); setCurrentPage(1); }}
                            className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                                activeTab === "Adoption"
                                    ? "bg-[#011749] text-white font-semibold"
                                    : "text-gray-400 hover:text-[#011749]"
                            }`}
                        >
                            Adoption
                        </button>
                        <button
                            onClick={() => { setActiveTab("Foster"); setCurrentPage(1); }}
                            className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                                activeTab === "Foster"
                                    ? "bg-[#011749] text-white font-semibold"
                                    : "text-gray-400 hover:text-[#011749]"
                            }`}
                        >
                            Foster
                        </button>
                        <button className="text-gray-400 text-xs sm:text-sm font-medium whitespace-nowrap cursor-not-allowed">Sponsor</button>
                    </div>

                    {/* Search */}
                    <div className="w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search petitioner..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-[#F6F7F9] px-4 py-2 rounded-full outline-none text-sm w-full sm:w-[220px]"
                        />
                    </div>

                </div>

                {/* Table with wrapper */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm text-left min-w-[700px]">

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
                                    <img
                                        src={IMG_BASE + item.applicantPicture}
                                        alt="user"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />

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
                                            src={`https://petmarket.runasp.net${item.animalPictureUrl}`}
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
                                    <span className={`font-inter font-bold tracking-wide px-2 py-1 rounded-full ${
                                        activeTab === "Foster"
                                            ? "text-[#047857] bg-[#ECFDF5]"
                                            : "text-[#1D4ED8] bg-[#EFF6FF]"
                                    }`}>
                                        {activeTab === "Foster" ? "FOSTER" : "ADOPTION"}
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
                                <td>
                                    <button className="text-[#011749] text-lg mx-auto block" onClick={() =>
                                        navigate(`/admin/requests/${item.animalName}?type=${activeTab === "Foster" ? "Foster" : "Adoption"}`)
                                    }>
                                        <IoEyeOutline />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                    </table>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-sm text-gray-400">
                    <p className="order-2 sm:order-1">
                        Showing {currentRequests.length} of {filteredRequests.length} requests
                    </p>

                    <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <span className="px-2 text-gray-600 flex items-center">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="bg-[#011749] text-white px-4 py-1 rounded hover:bg-[#022572] disabled:opacity-50"
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