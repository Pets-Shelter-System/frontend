import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../API/api";
import { AuthContext } from "../components/context/AuthContext";
import Pagination from "../components/Pagination";
import { IoArrowBackOutline, IoTimeOutline, IoPawOutline } from "react-icons/io5";

const UserApplications = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("adoption"); // "adoption" or "foster"
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchApplications = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const endpoint = activeTab === "adoption"
                ? "/AdoptionApplications/my"
                : "/FosterApplications/my";

            const res = await api.get(endpoint, {
                params: { pageNumber: page, pageSize: 12 },
                headers: { Authorization: `Bearer ${token}` }
            });

            // The response structure provided: { data: { items: [...], totalPages: ... } }
            setApplications(res.data.data.items);
            setTotalPages(res.data.data.totalPages);
        } catch (err) {
            console.error("Failed to fetch applications", err);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [activeTab, page, token]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1); // Reset to first page when tab changes
    };

    const getStatus = (status) => {
        switch (status) {
            case 1:
                return {
                    text: "Pending",
                    color: "#F59E0B"
                };

            case 2:
                return {
                    text: "Accepted",
                    color: "#22C55E"
                };

            default:
                return {
                    text: "Rejected",
                    color: "#EF4444"
                };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    return (
        <div className="bg-[#F6F7F9] min-h-screen pt-8 pb-12">
            <div className="max-w-[1000px] mx-auto px-4 space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/profile")}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <IoArrowBackOutline size={20} className="text-[#011749]" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#011749]">My Applications</h1>
                        <p className="text-gray-400 text-sm">Manage and track your adoption and foster requests.</p>
                    </div>
                </div>

                {/* Segmented Tab Bar */}
                <div className="flex justify-center">
                    <div className="bg-white p-1.5 rounded-2xl shadow-sm flex items-center gap-1 border border-gray-100">
                        <button
                            onClick={() => handleTabChange("adoption")}
                            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === "adoption"
                                ? "bg-[#011749] text-white shadow-lg"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Adoption
                        </button>
                        <button
                            onClick={() => handleTabChange("foster")}
                            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === "foster"
                                ? "bg-[#011749] text-white shadow-lg"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Foster
                        </button>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-[#011749] mb-4">
                        {activeTab === "adoption" ? "Adoption" : "Foster"} Submissions
                    </h2>

                    {loading ? (
                        <div className="py-20 text-center text-gray-400 animate-pulse">Fetching your applications...</div>
                    ) : applications.length > 0 ? (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    onClick={() => navigate(`/profile/applications/${app.id}`, { state: { type: activeTab } })}
                                    className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-[24px] border border-gray-50 hover:border-[#01174910] hover:bg-[#F6F7F950] transition-all cursor-pointer group"
                                >
                                    {/* Animal Image */}
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                        <img
                                            src={app.animalPictureUrl ? `http://petmarket.runasp.net${app.animalPictureUrl}` : "https://via.placeholder.com/150"}
                                            alt={app.animalName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                        />
                                    </div>

                                    {/* Animal & Applicant Info */}
                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                                            <h3 className="font-bold text-lg text-[#011749]">{app.animalName}</h3>
                                            <span className="text-[10px] bg-[#01174910] text-[#011749] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                {activeTab}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            Applicant: <span className="text-gray-600 font-medium">{app.applicantFirstName} {app.applicantLastName}</span>
                                        </p>
                                        <div className="flex items-center justify-center md:justify-start gap-4 text-[12px] text-gray-400">
                                            <span className="flex items-center gap-1"><IoTimeOutline /> {formatDate(app.submittedAt)}</span>
                                            <span className="flex items-center gap-1"><IoPawOutline /> ID: #{app.animalId}</span>
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex flex-col items-center md:items-end gap-3">
                                        <div className="flex items-center gap-2">

                                            <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor: getStatus(app.status).color,
                                                    boxShadow: `0px 0px 12px ${getStatus(app.status).color}`
                                                }}
                                            />

                                            <span
                                                className="text-sm font-semibold"
                                                style={{
                                                    color: getStatus(app.status).color
                                                }}
                                            >
                                                {getStatus(app.status).text}
                                            </span>

                                        </div>
                                        <span className="text-[#011749] text-sm font-bold group-hover:translate-x-1 transition-transform">
                                            Details →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center text-center space-y-4">
                            <div className="bg-gray-50 p-6 rounded-full text-gray-300">
                                <IoPawOutline size={48} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#011749]">No Applications Found</h3>
                                <p className="text-gray-400 text-sm max-w-[300px]">You haven't submitted any {activeTab} applications yet.</p>
                            </div>
                        </div>
                    )}

                    <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
};

export default UserApplications;
