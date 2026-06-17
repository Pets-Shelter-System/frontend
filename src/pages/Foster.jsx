import fosterImg from "../assets/foster1.png";
import { useEffect, useState, useContext } from "react";
import { FaSearch, FaHeart } from "react-icons/fa";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { FavoriteContext } from "../components/context/FavoriteContext";

const BASE_URL = "https://petmarket.runasp.net";

const getPetImage = (pet) => {
    if (pet.photos && pet.photos.length > 0) {
        return `${BASE_URL}${pet.photos[0].imageUrl}`;
    }
    return "https://via.placeholder.com/150";
};

const Foster = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    // const { toggleFavorite, isFavorite } = useContext(FavoriteContext);

    const [type, setType] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [openType, setOpenType] = useState(false);
    const [openGender, setOpenGender] = useState(false);
    const [openAge, setOpenAge] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

                const res = await fetch(`${BASE_URL}/api/FosterAnimals?${query}`);
                const data = await res.json();

                const items = data.data?.items || data.items || [];
                const total = data.data?.totalPages || data.totalPages || 1;

                setPets(items);
                setTotalPages(total);
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
        setPage(1);
    };

    return (
        <>
            {/* SECTION 1 — HERO */}
            <section
                className="w-full min-h-screen bg-[#F3F4F5] relative overflow-hidden"
            >
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-[140px] pb-24 flex items-center lg:items-start flex-col lg:flex-row gap-12 lg:gap-24">
                    <div className="max-w-lg text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#011749] leading-tight">
                            Open Your <br />
                            Home, <br />
                            Save a Life
                        </h1>

                        <p className="mt-6 text-gray-600 text-base md:text-lg">
                            Become a temporary sanctuary for our residents and help them transition to their forever homes with clinical-grade support and unconditional love.
                        </p>

                        <button
                            onClick={() => navigate("/add-foster")}
                            className="mt-8 bg-[#011749] text-white px-10 py-3 rounded-full text-lg font-medium hover:scale-105 transition"
                        >
                            Add Pet
                        </button>
                    </div>

                    <div className="flex-grow flex justify-center lg:justify-end w-full max-w-xl">
                        <img
                            src={fosterImg}
                            alt="Foster Care"
                            className="w-full h-auto object-cover rounded-[32px] shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 2 — FOSTER PROCESS */}
            <section className="bg-white py-28 overflow-hidden">
                <div className="max-w-[1300px] mx-auto px-6">
                    <h2 className="text-center text-2xl font-bold text-[#011749] mb-12">
                        The Path to Guardianship
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-center">
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F8B63D] text-white mx-auto mb-6 text-xl">
                                🔍
                            </span>
                            <h3 className="text-xl font-bold text-[#011749] mb-4">
                                Match with a Companion
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Browse our curated directory of residents currently seeking temporary clinical care and social integration.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-center">
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F8B63D] text-white mx-auto mb-6 text-xl">
                                🏠
                            </span>
                            <h3 className="text-xl font-bold text-[#011749] mb-4">
                                Prepare Your Space
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Receive personalized guidance, premium supplies, and 24/7 pre-foster support from our clinical-grade specialists.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-center">
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F8B63D] text-white mx-auto mb-6 text-xl">
                                ❤️
                            </span>
                            <h3 className="text-xl font-bold text-[#011749] mb-4">
                                Provide Love & Care
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Nurture their recovery in a safe space until we finalize their permanent placement within our high-end adoption network.
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
                        <div className="relative">
                            <button
                                onClick={() => { setOpenType(!openType); setOpenGender(false); setOpenAge(false); }}
                                className="flex items-center justify-between min-w-[160px] px-6 py-2.5 rounded-full border border-gray-300 text-sm bg-white hover:border-[#E7A01C] transition"
                            >
                                <span>{type === "1" ? "Dogs" : type === "2" ? "Cats" : "Animal Type"}</span>
                                <span className={`ml-3 text-xs transition ${openType ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            {openType && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden z-20">
                                    <div onClick={() => { setType("1"); setOpenType(false); }} className="px-5 py-2 text-sm cursor-pointer hover:bg-[#E7A01C] hover:text-white">Dogs</div>
                                    <div onClick={() => { setType("2"); setOpenType(false); }} className="px-5 py-2 text-sm cursor-pointer hover:bg-[#E7A01C] hover:text-white">Cats</div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => { setOpenGender(!openGender); setOpenType(false); setOpenAge(false); }}
                                className="flex items-center justify-between min-w-[140px] px-6 py-2.5 rounded-full border border-gray-300 text-sm bg-white hover:border-[#E7A01C] transition"
                            >
                                <span>{gender || "Gender"}</span>
                                <span className={`ml-3 text-xs transition ${openGender ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            {openGender && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden z-20">
                                    {["Male", "Female"].map((g) => (
                                        <div key={g} onClick={() => { setGender(g); setOpenGender(false); }} className="px-5 py-2 text-sm cursor-pointer hover:bg-[#E7A01C] hover:text-white">{g}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => { setOpenAge(!openAge); setOpenType(false); setOpenGender(false); }}
                                className="flex items-center justify-between min-w-[150px] px-6 py-2.5 rounded-full border border-gray-300 text-sm bg-white hover:border-[#E7A01C] transition"
                            >
                                <span>{age || "Age"}</span>
                                <span className={`ml-3 text-xs transition ${openAge ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            {openAge && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden z-20">
                                    {[{ label: "1 – 3 Years", value: "1-3" }, { label: "4 – 6 Years", value: "4-6" }, { label: "7 – 9 Years", value: "7-9" }].map((a) => (
                                        <div key={a.value} onClick={() => { setAge(a.value); setOpenAge(false); }} className="px-5 py-2 text-sm cursor-pointer hover:bg-[#E7A01C] hover:text-white">{a.label}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2.5 rounded-full text-sm bg-[#E7A01C] text-white hover:opacity-90 transition shadow-sm"
                        >
                            Clear Filter
                        </button>
                    </div>

                    {/* Cards */}
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {pets.map((pet) => (
                                    <div
                                        key={pet.id}
                                        className="bg-white rounded-2xl shadow-md p-5 relative transition hover:shadow-lg flex flex-col group h-full"
                                    >


                                        <div className="w-full h-44 overflow-hidden rounded-xl mb-4">
                                            <img
                                                src={getPetImage(pet)}
                                                alt={pet.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <h3 className="text-center font-bold text-[#F8B63D] text-lg">
                                            {pet.name}
                                        </h3>
                                        <p className="text-center text-sm text-gray-400 mb-6 flex items-center justify-center gap-1">
                                            <span className="text-xs"></span> {pet.city || "Cairo, Egypt"}
                                        </p>

                                        <div className="mt-auto flex justify-center">
                                            <button
                                                onClick={() => navigate(`/foster/${pet.id}`)}
                                                className="border-2 border-[#011749] text-[#011749] px-6 py-1.5 rounded-full text-sm font-bold hover:bg-[#011749] hover:text-white transition transform active:scale-95"
                                            >
                                                View Animal
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pets.length === 0 && !loading && (
                                <div className="text-center py-20 text-gray-400 font-medium">
                                    No companion found matching your search.
                                </div>
                            )}

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

export default Foster;
