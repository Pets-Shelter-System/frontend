import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoHeartOutline } from "react-icons/io5";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://petmarket.runasp.net";

const DEFAULT_PET_PLACEHOLDER = `data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style='background-color: %23F3F4F6;'><path d='M12 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-4.5-2c-.83 0-1.5-.67-1.5-1.5S6.67 9 7.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-8-5.5C8 5.67 7.33 5 6.5 5S5 5.67 5 6.5 5.67 8 6.5 8 8 7.33 8 6.5zm7 0c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5z' fill='%23011749' fill-opacity='0.15'/></svg>`;

const getPetImage = (pet) => {
    if (pet.photos && pet.photos.length > 0) {
        const path = pet.photos[0].imageUrl;
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${BASE_URL}${cleanPath}`;
    }
    return DEFAULT_PET_PLACEHOLDER;
};

const Sponsor = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    
    const [type, setType] = useState("");     // 1 = Dogs | 2 = Cats
    const [gender, setGender] = useState(""); // Male | Female
    const [age, setAge] = useState("");       // 1-3 | 4-6 | 7-9
    const [openType, setOpenType] = useState(false);
    const [openGender, setOpenGender] = useState(false);
    const [openAge, setOpenAge] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ===== Fetch API =====
    useEffect(() => {
        const fetchPets = async () => {
            try {
                setLoading(true);

                const ageParams = getAgeParams();

                const query = new URLSearchParams({
                    pageNumber: page,
                    pageSize: 12,
                    ...(type && { petTypeId: type }),
                    ...(gender && { gender }),
                    ...(search && { Search: search }),
                    ...ageParams,
                }).toString();

                const res = await fetch(`${BASE_URL}/api/DonationAnimals?${query}`);
                const data = await res.json();

                setPets(data.data?.items || data.items || []);
                setTotalPages(data.data?.totalPages || data.totalPages || 1);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [page, type, gender, age, search]);

    const getAgeParams = () => {
        if (!age) return {};
        const [from, to] = age.split("-");
        return {
            AgeFromYears: Number(from),
            AgeToYears: Number(to),
        };
    };

    const handleClearFilters = () => {
        setType("");
        setGender("");
        setAge("");
        setSearch("");
        setPage(1);
    };

    return (
        <>
            {/* HERO SECTION */}
            <section className="w-full bg-[#F3F5F9] relative overflow-hidden py-24 md:py-32">
                {/* Background overlay details */}
                <div className="absolute right-0 top-0 h-full w-[45%] bg-[#01174905] rounded-l-[100px] hidden md:block"></div>
                <div className="relative z-10 max-w-[1300px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                    <div className="space-y-6">
                        <span className="bg-[#01174910] text-[#011749] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Sponsor Program</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#011749] leading-tight">
                            Find Your <br />
                            Sponsorship <br />
                            Companion
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg max-w-md">
                            Providing world-class clinical care and sanctuary comforts for our residents. Every sponsorship ensures a patch toward recovery and lifelong wellness.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-[#011749] text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition">
                                Start Sponsoring
                            </button>
                            <button className="border-2 border-[#011749] text-[#011749] px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#011749] hover:text-white transition">
                                View Success Stories
                            </button>
                        </div>
                    </div>
                    {/* Visual Cat Banner representation */}
                    <div className="flex justify-center relative">
                        <div className="w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-[48px] overflow-hidden shadow-2xl relative border-8 border-white bg-white">
                            <img
                                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800"
                                alt="Cat"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* THREE STEPS SEGMENT */}
            <section className="bg-white py-20 border-b border-gray-50">
                <div className="max-w-[1300px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-[#F8F9FB] rounded-[24px] p-8 border border-gray-100 flex flex-col items-center text-center space-y-4">
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#01174910] text-[#011749] text-xl font-bold">1</span>
                            <h3 className="text-lg font-bold text-[#011749]">CHOOSE A RESIDENT</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Browse our registry of animals who need medical treatments, surgeries, or special support.
                            </p>
                        </div>
                        {/* Step 2 */}
                        <div className="bg-[#F8F9FB] rounded-[24px] p-8 border border-gray-100 flex flex-col items-center text-center space-y-4">
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F8B63D15] text-[#F8B63D] text-xl font-bold">2</span>
                            <h3 className="text-lg font-bold text-[#011749]">SELECT YOUR PLAN</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Decide on the contribution scale that works best for you and complete your micro-transaction safely.
                            </p>
                        </div>
                        {/* Step 3 */}
                        <div className="bg-[#F8F9FB] rounded-[24px] p-8 border border-gray-100 flex flex-col items-center text-center space-y-4">
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#10B98115] text-[#10B981] text-xl font-bold">3</span>
                            <h3 className="text-lg font-bold text-[#011749]">RECEIVE ANIMAL UPDATES</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Watch them grow, recover, and eventually move to their forever homes with standard status logs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3 — FIND YOUR COMPANION */}
            <section className="bg-white py-24">
                <div className="max-w-[1300px] mx-auto px-6">
                    <h2 className="text-center text-2xl font-bold text-[#011749] mb-10">
                        Find your companion ✨
                    </h2>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-8">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by pet name..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-200 focus:outline-none"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-4 mb-14">
                        {/* Animal Type */}
                        <div className="relative">
                            <button
                                onClick={() => { setOpenType(!openType); setOpenGender(false); setOpenAge(false); }}
                                className="flex items-center justify-between min-w-[160px] px-6 py-2.5 rounded-full border border-gray-300 text-sm bg-white hover:border-[#E7A01C] transition"
                            >
                                <span>{type === "1" ? "Dogs" : type === "2" ? "Cats" : "Animal Type"}</span>
                                <span className={`ml-3 text-xs transition ${openType ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            {openType && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                                    <div
                                        onClick={() => { setType("1"); setOpenType(false); }}
                                        className="px-5 py-2 text-sm cursor-pointer hover:bg-[#E7A01C] hover:text-white"
                                    >
                                        Dogs
                                    </div>
                                    <div
                                        onClick={() => { setType("2"); setOpenType(false); }}
                                        className="px-5 py-2 text-sm cursor-pointer hover:bg-[#E7A01C] hover:text-white"
                                    >
                                        Cats
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="relative">
                            <button
                                onClick={() => { setOpenGender(!openGender); setOpenType(false); setOpenAge(false); }}
                                className="flex items-center justify-between min-w-[140px] px-6 py-2.5 rounded-full border border-gray-300 text-sm bg-white hover:border-[#E7A01C] transition"
                            >
                                <span>{gender || "Gender"}</span>
                                <span className={`ml-3 text-xs transition ${openGender ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            {openGender && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                                    {["Male", "Female"].map((g) => (
                                        <div
                                            key={g}
                                            onClick={() => { setGender(g); setOpenGender(false); }}
                                            className="px-5 py-2 text-sm cursor-pointer hover:bg-[#E7A01C] hover:text-white"
                                        >
                                            {g}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Age */}
                        <div className="relative">
                            <button
                                onClick={() => { setOpenAge(!openAge); setOpenType(false); setOpenGender(false); }}
                                className="flex items-center justify-between min-w-[150px] px-6 py-2.5 rounded-full border border-gray-300 text-sm bg-white hover:border-[#E7A01C] transition"
                            >
                                <span>{age ? `${age.replace("-", " – ")} Years` : "Age"}</span>
                                <span className={`ml-3 text-[10px] transition-transform duration-300 ${openAge ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            {openAge && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                                    {[
                                        { label: "1 – 3 Years", value: "1-3" },
                                        { label: "4 – 6 Years", value: "4-6" },
                                        { label: "7 – 9 Years", value: "7-9" },
                                    ].map((a) => (
                                        <div
                                            key={a.value}
                                            onClick={() => { setAge(a.value); setOpenAge(false); }}
                                            className="px-5 py-2 text-sm cursor-pointer hover:bg-[#E7A01C] hover:text-white"
                                        >
                                            {a.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2.5 rounded-full text-sm bg-[#E7A01C] text-white hover:opacity-90 transition shadow-sm"
                        >
                            Clear Filter
                        </button>
                    </div>

                    {/* Companion Cards Layout */}
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center justify-items-center">
                                {pets.map((pet) => {
                                    const roundedProgress = Math.round(pet.progressPercentage || 0);
                                    return (
                                        <div
                                            key={pet.id}
                                            className="bg-white rounded-2xl shadow-md p-5 relative transition hover:shadow-lg flex flex-col group h-full w-full max-w-[280px]"
                                        >
                                            {/* Image Section */}
                                            <div className="w-full h-44 overflow-hidden rounded-xl mb-4">
                                                <img
                                                    src={getPetImage(pet)}
                                                    alt={pet.name}
                                                    onError={(e) => {
                                                        e.target.src = DEFAULT_PET_PLACEHOLDER;
                                                    }}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            <h3 className="text-center font-bold text-[#F8B63D] text-lg">
                                                {pet.name}
                                            </h3>
                                            <p className="text-center text-sm text-gray-400 mb-6 flex items-center justify-center gap-1">
                                                <span className="text-xs"></span> {pet.city || "Cairo, Egypt"}
                                            </p>

                                            {/* Progress Bar before detail button */}
                                            <div className="space-y-2 mb-6">
                                                <div className="flex justify-between text-[11px] font-bold text-gray-500">
                                                    <span>{pet.collectedAmount || 0} EGP Raised</span>
                                                    <span className="text-[#011749]">{roundedProgress}%</span>
                                                </div>
                                                <div className="w-full bg-[#0117490B] rounded-full h-3 overflow-hidden shadow-inner relative">
                                                    <div 
                                                        style={{ width: `${Math.min(roundedProgress, 100)}%` }} 
                                                        className="bg-gradient-to-r from-[#F8B63D] via-[#F1A21A] to-[#E7A01C] h-full rounded-full transition-all duration-500 relative shadow-[0_1px_5px_rgba(231,160,28,0.3)]"
                                                    >
                                                        {/* Glossy top highlight */}
                                                        <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-white/20 rounded-full"></div>
                                                        
                                                        {/* End target pulsating dot if not 100% */}
                                                        {roundedProgress > 0 && roundedProgress < 100 && (
                                                            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.9)] animate-ping"></span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-[10px] text-gray-450 font-semibold mt-1">
                                                    <span>Goal: {pet.goalAmount || 0} EGP</span>
                                                    <span>{pet.remainingAmount || 0} EGP Left</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto flex justify-center">
                                                <button
                                                    onClick={() => navigate(`/sponsor/${pet.id}`)}
                                                    className="border-2 border-[#011749] text-[#011749] px-6 py-1.5 rounded-full text-sm font-bold hover:bg-[#011749] hover:text-white transition transform active:scale-95"
                                                >
                                                    View Animal
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {pets.length === 0 && !loading && (
                                <div className="text-center py-20 text-gray-400 font-medium">
                                    No companion found matching your search.
                                </div>
                            )}

                            {/* Pagination */}
                            <Pagination
                                page={page}
                                setPage={setPage}
                                totalPages={totalPages}
                            />
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Sponsor;
