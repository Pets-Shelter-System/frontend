import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../API/api";
import { AuthContext } from "../components/context/AuthContext";
import {
    IoArrowBackOutline,
    IoTimeOutline,
    IoPawOutline,
    IoPersonOutline,
    IoMailOutline,
    IoCallOutline,
    IoLocationOutline,
    IoDocumentTextOutline,
    IoCheckmarkCircleOutline
} from "react-icons/io5";

const ApplicationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useContext(AuthContext);

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [type, setType] = useState(location.state?.type || null);

    const fetchDetails = async (appType) => {
        try {
            const endpoint = appType === "adoption"
                ? `/AdoptionApplications/${id}`
                : `/FosterApplications/${id}`;

            const res = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            if (err.response?.status === 404) return null;
            throw err;
        }
    };

    const loadData = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            let data = null;
            let finalType = type;

            if (type) {
                data = await fetchDetails(type);
            } else {
                // Fallback logic: try adoption then foster
                data = await fetchDetails("adoption");
                if (data) {
                    finalType = "adoption";
                } else {
                    data = await fetchDetails("foster");
                    if (data) {
                        finalType = "foster";
                    }
                }
            }

            if (data) {
                setApplication(data.data || data); // Adjust based on actual API response wrapper
                setType(finalType);
            } else {
                setError("Application not found.");
            }
        } catch (err) {
            console.error("Failed to fetch application details", err);
            setError("Something went wrong while fetching details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        console.log(application)

    }, [id, token]);

    // const getStatusColor = (statusName) => {
    //     switch (statusName?.toLowerCase()) {
    //         case "pending": return "bg-orange-100 text-orange-600";
    //         case "approved": return "bg-green-100 text-green-600";
    //         case "rejected": return "bg-red-100 text-red-600";
    //         default: return "bg-gray-100 text-gray-600";
    //     }
    // };

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

            case 3:
                return {
                    text: "Rejected",
                    color: "#EF4444"
                };

            default:
                return {
                    text: "Pending",
                    color: "#F59E0B"
                };
        }
    };

    const status = getStatus(application?.status);

    if (loading) {
        return (
            <div className="bg-[#F6F7F9] min-h-screen flex items-center justify-center p-4">
                <div className="animate-pulse text-[#011749] font-bold text-xl">Loading Application Details...</div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="bg-[#F6F7F9] min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
                <div className="text-red-500 font-bold text-xl">{error || "Application not found"}</div>
                <button
                    onClick={() => navigate("/profile/applications")}
                    className="bg-[#011749] text-white px-8 py-2 rounded-xl font-bold"
                >
                    Back to Applications
                </button>
            </div>
        );
    }

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
        });
    };

    return (
        <div className="bg-[#F6F7F9] min-h-screen pt-8 pb-12 transition-all duration-500">
            <div className="max-w-[1000px] mx-auto px-4 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate("/profile/applications")}
                            className="p-3 bg-[#F6F7F9] rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            <IoArrowBackOutline size={24} className="text-[#011749]" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">

                                <h1 className="text-2xl font-bold text-[#011749]">
                                    Application Details
                                </h1>

                                <div className="flex items-center gap-2">

                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: status.color,
                                            boxShadow: `0 0 12px ${status.color}`
                                        }}
                                    />

                                    <span
                                        className="text-sm font-semibold"
                                        style={{
                                            color: status.color
                                        }}
                                    >
                                        {status.text}
                                    </span>

                                </div>

                            </div>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                <IoDocumentTextOutline /> {type === "adoption" ? "Adoption" : "Foster"} Request ID: #{id}
                            </p>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Submitted At</p>
                        <p className="text-[#011749] font-medium">{formatDate(application.submittedAt, true)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Animal & Applicant Summary */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Animal Card */}
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={application.animalPictureUrl ? `http://petmarket.runasp.net${application.animalPictureUrl}` : "https://via.placeholder.com/400x300"}
                                    alt={application.animalName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300"; }}
                                />
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-[#011749]">{application.animalName || "Unknown Pet"}</h2>
                                    <IoPawOutline className="text-[#E7A01C] text-xl" />
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between text-sm">
                                    <span className="text-gray-400">Animal ID</span>
                                    <span className="text-[#011749] font-bold">#{application.animalId || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Applicant Card */}
                        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6">
                            <h3 className="font-bold text-[#011749] flex items-center gap-2 border-b border-gray-50 pb-4">
                                <IoPersonOutline className="text-[#E7A01C]" /> Applicant Information
                            </h3>
                            <div className="space-y-4">
                                <DetailItem icon={<IoPersonOutline />} label="Full Name" value={`${application.firstName} ${application.lastName}`} />
                                <DetailItem icon={<IoMailOutline />} label="Email" value={application.email} />
                                <DetailItem icon={<IoCallOutline />} label="Phone" value={application.phoneNumber || "Not provided"} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Full Application Data */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
                            <h3 className="text-xl font-bold text-[#011749] flex items-center gap-2 border-b border-gray-50 pb-6">
                                <IoDocumentTextOutline className="text-[#E7A01C]" /> Application Questionnaire
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SectionBlock title="Location Details">
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                        {application.address}, {application.city}, {application.country} {application.zipCode}
                                    </p>
                                </SectionBlock>

                                <SectionBlock title="Household Details">
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                                        "{application.householdDetails || "No details provided."}"
                                    </p>
                                </SectionBlock>

                                <SectionBlock title="Pet Care Responsibility">
                                    <div className="space-y-4">
                                        <SubItem label="Responsible Person" value={application.responsiblePerson} />
                                        <SubItem label="Reason for Request" value={application.adoptionReason} />
                                    </div>
                                </SectionBlock>

                                <SectionBlock title="Living Environment">
                                    <div className="space-y-4">
                                        <SubItem label="Alone Time" value={application.aloneTimeDetails} />
                                        <SubItem label="Fenced/Indoor" value={application.livingEnvironment} />
                                    </div>
                                </SectionBlock>
                            </div>

                            {/* Booleans / Options */}
                            <div className="pt-8 border-t border-gray-50">
                                <SectionBlock title="General Information">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <OptionTag label="House Trained" checked={application.houseTrained} />
                                        <OptionTag label="Working" checked={application.working} />
                                        <OptionTag label="Declawed" checked={application.declawed} />
                                        <OptionTag label="Young" checked={application.young} />
                                        <OptionTag label="Special Cons." checked={application.specialConsiderations} />
                                        <OptionTag label="Multiple Pets" checked={application.multiplePets} />
                                    </div>
                                </SectionBlock>
                            </div>

                            {/* Agreements */}
                            <div className="pt-8 border-t border-gray-50 space-y-4">
                                <div className={`p-4 rounded-2xl flex items-start gap-3 text-sm ${application.accepted ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                                    <IoCheckmarkCircleOutline className="mt-1 shrink-0" size={18} />
                                    <p>Accepted the general terms and conditions of the application process.</p>
                                </div>
                                <div className={`p-4 rounded-2xl flex items-start gap-3 text-sm ${application.authorizedInvestigation ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                                    <IoCheckmarkCircleOutline className="mt-1 shrink-0" size={18} />
                                    <p>Authorized investigation of all statements contained in this application.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2 text-sm text-[#011749] font-medium">
            {icon && <span className="text-gray-400">{icon}</span>}
            <p className="truncate">{value || "N/A"}</p>
        </div>
    </div>
);

const SectionBlock = ({ title, children }) => (
    <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#E7A01C] uppercase tracking-wider">{title}</h4>
        {children}
    </div>
);

const SubItem = ({ label, value }) => (
    <div>
        <p className="text-[11px] font-bold text-gray-400 leading-tight mb-1">{label}</p>
        <p className="text-sm text-[#011749] font-medium">{value || "None"}</p>
    </div>
);

const OptionTag = ({ label, checked }) => (
    <div className={`px-3 py-2 rounded-xl border text-[11px] font-bold text-center transition-all ${checked
        ? "bg-[#011749] border-[#011749] text-white"
        : "bg-gray-50 border-gray-100 text-gray-400"
        }`}>
        {label}
    </div>
);

export default ApplicationDetails;
