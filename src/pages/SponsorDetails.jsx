import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";
import {
    FaCalendarAlt,
    FaRulerCombined,
    FaVenusMars,
    FaPaw,
    FaChild,
    FaHome,
    FaHeart,
    FaArrowLeft,
    FaRegClock,
    FaUser,
    FaUsers
} from "react-icons/fa";

const BASE_URL = "https://petmarket.runasp.net";

const DEFAULT_PET_PLACEHOLDER = `data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style='background-color: %23F3F4F6;'><path d='M12 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-4.5-2c-.83 0-1.5-.67-1.5-1.5S6.67 9 7.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-8-5.5C8 5.67 7.33 5 6.5 5S5 5.67 5 6.5 5.67 8 6.5 8 8 7.33 8 6.5zm7 0c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5z' fill='%23011749' fill-opacity='0.15'/></svg>`;
const DEFAULT_DONOR_PLACEHOLDER = `data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style='background-color: %23F3F4F6;'><circle cx="12" cy="12" r="12" fill="%23011749" fill-opacity="0.05"/><path d="M12 11C13.66 11 15 9.66 15 8s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm6 8c0-2.76-2.24-5-5-5H11c-2.76 0-5 2.24-5 5" stroke="%23011749" stroke-opacity="0.2" stroke-width="2" stroke-linecap="round"/></svg>`;

const SponsorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showDonateModal, setShowDonateModal] = useState(false);
    const [donateAmount, setDonateAmount] = useState("");
    const [donateMessage, setDonateMessage] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchAnimalDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/api/DonationAnimals/${id}`);
                const data = await res.json();
                setAnimal(data.data || data);
            } catch (err) {
                console.error("Failed to fetch donation animal details:", err);
                toast.error("Failed to load companion details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnimalDetails();
    }, [id]);

    const handleDonationSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first to make a donation.");
            navigate("/login");
            return;
        }

        const amt = parseFloat(donateAmount);
        if (isNaN(amt) || amt <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch(`${BASE_URL}/api/Donations/donation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    donationAnimalId: Number(id),
                    amount: amt,
                    message: donateMessage.trim() || "No",
                    isAnonymous: isAnonymous
                })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to initiate donation");
            }

            toast.success("Donation registered! Redirecting to Stripe checkout...");

            if (result.data) {
                setTimeout(() => {
                    window.location.href = result.data;
                }, 1000);
            } else {
                toast.error("Checkout link was not found in response.");
            }
        } catch (err) {
            console.error("Donation gateway failure:", err);
            toast.error(err.message || "Failed to execute donation process.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner />;
    if (!animal) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div>
                <h2 className="text-2xl font-bold text-[#011749] mb-4">Companion not found</h2>
                <button
                    onClick={() => navigate("/sponsor")}
                    className="bg-[#011749] text-white px-8 py-2 rounded-full font-semibold"
                >
                    Back to Sponser
                </button>
            </div>
        </div>
    );

    const decodeImageUrl = (path) => {
        if (!path) return DEFAULT_PET_PLACEHOLDER;
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${BASE_URL}${cleanPath}`;
    };

    const getDonorImage = (url) => {
        if (!url) return DEFAULT_DONOR_PLACEHOLDER;
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        return `${BASE_URL}${cleanPath}`;
    };

    const progressPercent = Math.round(animal.progressPercentage || 0);

    return (
        <section className="bg-[#F6F7F9] py-16 px-4">
            <div className="max-w-[1240px] mx-auto space-y-6">
                
                {/* Back button */}
                <button 
                  onClick={() => navigate("/sponsor")}
                  className="flex items-center gap-2 text-gray-500 hover:text-[#011749] transition font-semibold"
                >
                  <FaArrowLeft /> Back to Sponser
                </button>

                <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* LEFT - Gallery (like Foster) */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-[#011749]">
                                {animal.name}
                            </h2>

                            {/* Images Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Big image */}
                                <div className="md:col-span-2">
                                    <img
                                        src={decodeImageUrl(animal.photos?.[0]?.imageUrl)}
                                        onError={(e) => {
                                            e.target.src = DEFAULT_PET_PLACEHOLDER;
                                        }}
                                        className="w-full h-[320px] md:h-[400px] rounded-2xl object-cover shadow-sm"
                                        alt={animal.name}
                                    />
                                </div>

                                {/* Small images column */}
                                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                                    {animal.photos?.slice(1, 3).map((img) => (
                                        <img
                                            key={img.id}
                                            src={decodeImageUrl(img.imageUrl)}
                                            onError={(e) => {
                                                e.target.src = DEFAULT_PET_PLACEHOLDER;
                                            }}
                                            className="rounded-xl object-cover h-[100px] md:h-[190px] min-w-[120px] md:min-w-0"
                                            alt=""
                                        />
                                    ))}
                                    {(!animal.photos || animal.photos.length <= 1) && (
                                        <div className="hidden md:flex flex-col gap-4 w-full">
                                            <div className="bg-gray-100 rounded-xl h-[190px] min-w-[120px] md:min-w-0 flex items-center justify-center text-gray-300">
                                                <FaPaw size={32} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT - Info + Progress Indicator + Sponsor Action */}
                        <div className="flex flex-col justify-between pt-6 lg:pt-14">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">
                                    Breed : <span className="font-medium">{animal.petTypeName || animal.breed || "N/A"}</span>
                                </p>

                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    {animal.description || "No detailed description available for this rescue companion."}
                                </p>

                                {/* Info Card (like Foster) */}
                                <div className="space-y-4 text-sm bg-[#F8F9FB] p-6 rounded-2xl border border-gray-50">
                                    <div className="flex items-center gap-3 text-[#011749]">
                                        <FaCalendarAlt className="text-[#F8B63D]" />
                                        <span className="font-medium">Age:</span>
                                        <span className="ml-auto text-gray-600">{animal.ageYears || 0} years</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-[#011749]">
                                        <FaRulerCombined className="text-[#F8B63D]" />
                                        <span className="font-medium">Size:</span>
                                        <span className="ml-auto text-gray-600">{animal.size || "Unknown"}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-[#011749]">
                                        <FaVenusMars className="text-[#F8B63D]" />
                                        <span className="font-medium">Gender:</span>
                                        <span className="ml-auto text-gray-600">{animal.gender || "Unknown"}</span>
                                    </div>
                                    
                                    {animal.weightKg && (
                                        <div className="flex items-center gap-3 text-[#011749]">
                                            <FaRulerCombined className="text-[#F8B63D] rotate-90" />
                                            <span className="font-medium">Weight:</span>
                                            <span className="ml-auto text-gray-600">{animal.weightKg} kg</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Beautiful Progress Bar Segment */}
                            <div className="mt-8 space-y-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between text-xs font-bold text-[#011749]">
                                    <span>Fundraising Progress</span>
                                    <span className="text-[#E7A01C]">{progressPercent}% Completed</span>
                                </div>
                                <div className="w-full bg-[#0117490B] rounded-full h-3.5 overflow-hidden shadow-inner relative">
                                    <div 
                                        style={{ width: `${Math.min(progressPercent, 100)}%` }} 
                                        className="bg-gradient-to-r from-[#F8B63D] via-[#F1A21A] to-[#E7A01C] h-full rounded-full transition-all duration-700 relative shadow-[0_1px_6px_rgba(231,160,28,0.4)]"
                                    >
                                        {/* Glossy top highlight */}
                                        <div className="absolute top-0.5 left-0.5 right-0.5 h-1 bg-white/25 rounded-full"></div>
                                        
                                        {/* End target pulsating dot if not 100% */}
                                        {progressPercent > 0 && progressPercent < 100 && (
                                            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-ping"></span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 font-bold">
                                    <span className="text-[#E7A01C]">{animal.collectedAmount || 0} EGP Raised</span>
                                    <span>{animal.remainingAmount || 0} EGP Left</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-semibold text-center mt-1">
                                    Goal target: {animal.goalAmount || 0} EGP
                                </div>
                            </div>

                            {/* Sponsor Action button */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                <button
                                    onClick={() => setShowDonateModal(true)}
                                    className="bg-[#011749] text-white px-8 py-3.5 rounded-full text-sm font-bold hover:scale-[1.02] transition transform active:scale-95 flex-grow text-center flex items-center justify-center gap-2"
                                >
                                    <FaHeart /> Sponsor {animal.name}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                                * 100% of your contributions go directly toward rescue medical bills.
                            </p>
                        </div>
                    </div>

                    {/* RATINGS - Matching FosterDetails */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F1F3F6] shadow-sm rounded-2xl mt-12 p-8 text-center text-sm">
                        <div className="p-4 rounded-xl">
                            <p className="font-bold text-[#011749] mb-3">Animal-friendly</p>
                            <div className="flex justify-center gap-1.5 text-lg">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaPaw
                                        key={i}
                                        className={
                                            i < (animal.animalsFriendlyLevel ?? 3)
                                                ? "text-[#F8B63D]"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl">
                            <p className="font-bold text-[#011749] mb-3">Children-friendly</p>
                            <div className="flex justify-center gap-1.5 text-lg">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaChild
                                        key={i}
                                        className={
                                            i < (animal.childrenFriendlyLevel ?? 4)
                                                ? "text-[#F8B63D]"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl">
                            <p className="font-bold text-[#011749] mb-3">House-Trained</p>
                            <div className="flex justify-center gap-1.5 text-lg">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaHome
                                        key={i}
                                        className={
                                            i < (animal.houseTrainedLevel ?? 5)
                                                ? "text-[#F8B63D]"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SPONSOR CONTRIBUTORS (Donors Registry) */}
                    <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-100">
                            <div className="flex items-center gap-2 text-[#011749]">
                                <span className="p-2 bg-orange-50 rounded-xl text-[#E7A01C]">
                                    <FaUsers size={20} />
                                </span>
                                <h3 className="text-lg font-bold">Donations</h3>
                            </div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                {animal.donations?.length || 0} Donors
                            </span>
                        </div>

                        {animal.donations && animal.donations.length > 0 ? (
                            <div className="space-y-6">
                                {animal.donations.map((donation) => {
                                    const getInitials = (name) => {
                                        if (!name) return "SP";
                                        const parts = name.trim().split(" ");
                                        if (parts.length >= 2) {
                                            return (parts[0][0] + parts[1][0]).toUpperCase();
                                        }
                                        return name.slice(0, 2).toUpperCase();
                                    };

                                    const colors = [
                                        "bg-blue-100 text-blue-700",
                                        "bg-green-100 text-green-700",
                                        "bg-purple-100 text-purple-700",
                                        "bg-pink-100 text-pink-700",
                                        "bg-indigo-100 text-indigo-700",
                                        "bg-teal-100 text-teal-700"
                                    ];
                                    const colorClass = colors[donation.donorName?.length % colors.length || 0];

                                    return (
                                        <div key={donation.id} className="flex justify-between items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                            <div className="flex items-start gap-4">
                                                {donation.donorPictureUrl ? (
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0 bg-white">
                                                        <img 
                                                            src={getDonorImage(donation.donorPictureUrl)} 
                                                            alt=""
                                                            onError={(e) => {
                                                                e.target.src = DEFAULT_DONOR_PLACEHOLDER;
                                                            }}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${colorClass}`}>
                                                        {getInitials(donation.donorName)}
                                                    </div>
                                                )}

                                                <div className="min-w-0 space-y-1">
                                                    <h4 className="font-bold text-sm text-[#011749] tracking-tight">
                                                        {donation.donorName || "Anonymous Sponsor"}
                                                    </h4>
                                                    <p className="text-xs text-gray-550 italic font-medium leading-relaxed max-w-xl">
                                                        "{donation.message || "Supported this rescue companion."}"
                                                    </p>
                                                    <div className="text-[10px] text-gray-400 font-bold block pt-1">
                                                        {new Date(donation.donatedAt).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className="font-extrabold text-[#E7A01C] text-sm md:text-base">
                                                    {donation.amount || 0} EGP
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 flex flex-col items-center">
                                <FaHeart className="text-gray-300 mb-2 text-3xl animate-pulse" />
                                <p className="text-sm text-gray-500 font-bold mb-1">No donations logged yet</p>
                                <p className="text-xs text-gray-400">Be the first to sponsor {animal.name}!</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Donation Overlay Modal */}
            {showDonateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-[32px] w-full max-w-[460px] shadow-2xl p-6 md:p-8 relative transform scale-100 transition-all duration-300">
                        {/* Close Button */}
                        <button 
                            type="button"
                            onClick={() => setShowDonateModal(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 font-bold text-lg"
                        >
                            ✕
                        </button>

                        {/* Top Header */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-orange-50 rounded-xl text-[#E7A01C]">
                                    <FaPaw size={18} />
                                </span>
                                <h3 className="text-xl font-extrabold text-[#011749] tracking-tight">
                                    Donate <span className="text-[#E7A01C] font-black">·</span> Care
                                </h3>
                            </div>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleDonationSubmit} className="space-y-5">
                            {/* Input Amount */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-[#011749] mb-2 uppercase tracking-wide">
                                    <span className="text-sm">✍️</span> Amount <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="number"
                                    placeholder="e.g. 25.00"
                                    required
                                    min="1"
                                    value={donateAmount}
                                    onChange={(e) => setDonateAmount(e.target.value)}
                                    className="w-full rounded-2xl bg-[#F8F9FB] border border-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-[#E7A01C] text-sm text-[#011749] font-semibold"
                                />
                            </div>

                            {/* Message Custom */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-[#011749] uppercase tracking-wide">
                                        <span className="text-sm">✍️</span> Message
                                    </label>
                                    <span className="text-[9px] uppercase bg-blue-50 text-blue-600 font-extrabold px-1.5 py-0.5 rounded">
                                        Optional
                                    </span>
                                </div>
                                <textarea 
                                    placeholder="Write a personal message..."
                                    rows="3"
                                    value={donateMessage}
                                    onChange={(e) => setDonateMessage(e.target.value)}
                                    className="w-full rounded-2xl bg-[#F8F9FB] border border-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-[#E7A01C] text-sm text-[#011749] font-medium resize-none"
                                />
                            </div>

                            {/* Anonymous Toggle */}
                            <div className="flex items-center justify-between p-4 bg-[#F8F9FB] border border-gray-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 rounded-xl text-[#E7A01C]">
                                        <FaUser size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#011749]">Donate anonymously</p>
                                        <p className="text-[9px] text-gray-400 font-medium">Your name will not appear publicly</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAnonymous(!isAnonymous)}
                                    className={`w-10 h-5.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                                        isAnonymous ? 'bg-[#011749]' : 'bg-gray-300'
                                    }`}
                                >
                                    <div
                                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${
                                            isAnonymous ? 'translate-x-4.5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[#011749] text-white py-3.5 rounded-full text-sm font-bold hover:scale-[1.01] transition transform active:scale-95 flex items-center justify-center gap-2 disabled:bg-gray-400"
                                >
                                    {submitting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <FaHeart className="text-[#E7A01C]" /> Donate now ➔
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Footer Badges */}
                        <div className="flex justify-center gap-2 mt-6 text-[9px] font-extrabold text-[#011749]/60">
                            <span className="bg-gray-100 px-2.5 py-1 rounded-full">
                                🛡️ 100% SECURE
                            </span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-full">
                                🧡 HELPS RESCUE
                            </span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-full">
                                ✔️ THANK YOU
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SponsorDetails;
