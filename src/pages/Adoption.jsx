import heroImg from "../assets/adoption.png";
import dogImg from "../assets/adoption2.png";

import { useEffect, useState } from "react";
import { FaSearch, FaHeart } from "react-icons/fa";

import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://petmarket.runasp.net"




const getPetImage = (pet) => {
    if (pet.photos && pet.photos.length > 0) {
        return `${BASE_URL}${pet.photos[0].imageUrl}`;
    }
    // return "https://via.placeholder.com/150";
};



const Adoption = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate()
    const [type, setType] = useState("");     // 1 | 2
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

                const res = await fetch(`${BASE_URL}/api/Animals?${query}`);
                const data = await res.json();

                setPets(data.data.items || []);
                setTotalPages(data.data.totalPages || 1);
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
            {/* HERO SECTION */}
            <section
                className="
    w-full min-h-screen
    bg-cover bg-center bg-no-repeat
    relative overflow-hidden
"
                style={{ backgroundImage: `url(${heroImg})` }}
            >
                <div
                    className="
    relative z-10
    max-w-[1400px] mx-auto
    px-6
    pt-[140px] pb-24
    flex items-start
    "
                >
                    <div className="max-w-lg">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#011749] leading-tight">
                            EVERY PET <br />
                            DESERVE A <br />
                            HOME
                        </h1>

                        <p className="mt-6 text-gray-600 text-base md:text-lg">
                            Want to help your pet find a loving home?
                            You are just one adoption away.
                        </p>

                        <button className="mt-8 bg-[#011749] text-white px-10 py-3 rounded-full text-lg font-medium hover:scale-105 transition">
                            Add Pet
                        </button>
                    </div>
                </div>
            </section>

            {/* SECOND SECTION */}
            <section className="bg-white py-28 overflow-hidden">
                <div className="max-w-[1300px] mx-auto px-6 relative">

                    <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-16">

                        <div className="text-center lg:text-left lg:-translate-y-10">
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F8B63D] text-white">
                                    🔍
                                </span>
                                <h3 className="text-xl font-bold text-[#011749]">
                                    Search Pet
                                </h3>
                            </div>

                            <p className="text-gray-500 mt-2 leading-relaxed max-w-[318px]">
                                Adopt a dog or cat who's right for you.
                                Simply enter your city above to start your search.
                            </p>
                        </div>

                        {/* CENTER – CIRCLE */}
                        <div className="relative flex justify-center">

                            {/* Outer frame */}
                            <div className="
    w-[380px] h-[380px]
    rounded-full
    bg-gradient-to-r
    from-[#011749]/45
    to-[#F8B63D]/35
    flex items-center justify-center
">
                                {/* Inner gradient */}
                                <div className="
    w-[300px] h-[300px]
    rounded-full
    bg-gradient-to-r
    from-[#F8B63D]
    to-[#011749]
    flex items-center justify-center
    ">
                                    <img
                                        src={dogImg}
                                        alt="Dog"
                                        className="w-[240px] object-contain"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="text-center lg:text-left lg:translate-y-12">
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F8B63D] text-white">
                                    🏠
                                </span>
                                <h3 className="text-xl font-bold text-[#011749]">
                                    Adopt Love
                                </h3>
                            </div>

                            <p className="text-gray-500 mt-4 leading-relaxed max-w-[318px]">
                                The rescue or pet parents will walk you through their adoption process. once you complete the Adoption journey.
                                Simply enter your city above to start your search.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* THIRD SECTION */}
            <section className="bg-white py-24">
                <div className="max-w-[1300px] mx-auto px-6">

                    {/* Title */}
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
                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-4 mb-14">

                        {/* ========== Animal Type ========== */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setOpenType(!openType);
                                    setOpenGender(false);
                                    setOpenAge(false);
                                }}
                                className="
        flex items-center justify-between
        min-w-[160px]
        px-6 py-2.5
        rounded-full
        border border-gray-300
        text-sm bg-white
        hover:border-login-btn
        transition
      "
                            >
                                <span>{type === "1" ? "Dogs" : type === "2" ? "Cats" : "Animal Type"}</span>
                                <span className={`ml-3 text-xs transition ${openType ? "rotate-180" : ""}`}>▼</span>
                            </button>

                            {openType && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden z-20">
                                    <div
                                        onClick={() => { setType("1"); setOpenType(false); }}
                                        className="px-5 py-2 text-sm cursor-pointer hover:bg-login-btn hover:text-white"
                                    >
                                        Dogs
                                    </div>
                                    <div
                                        onClick={() => { setType("2"); setOpenType(false); }}
                                        className="px-5 py-2 text-sm cursor-pointer hover:bg-login-btn hover:text-white"
                                    >
                                        Cats
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ========== Gender ========== */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setOpenGender(!openGender);
                                    setOpenType(false);
                                    setOpenAge(false);
                                }}
                                className="flex items-center justify-between min-w-[140px] px-6 py-2.5 rounded-full border border-gray-300 text-sm bg-white hover:border-login-btn transition"
                            >
                                <span>{gender || "Gender"}</span>
                                <span className={`ml-3 text-xs transition ${openGender ? "rotate-180" : ""}`}>▼</span>
                            </button>

                            {openGender && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden z-20">
                                    {["Male", "Female"].map((g) => (
                                        <div
                                            key={g}
                                            onClick={() => { setGender(g); setOpenGender(false); }}
                                            className="px-5 py-2 text-sm cursor-pointer hover:bg-login-btn hover:text-white"
                                        >
                                            {g}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ========== Age ========== */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setOpenAge(!openAge);
                                    setOpenType(false);
                                    setOpenGender(false);
                                }}
                                className="flex items-center justify-between min-w-[150px] px-6 py-2.5 rounded-full border border-gray-300 text-sm bg-white hover:border-login-btn transition"
                            >
                                <span>{age || "Age"}</span>
                                <span className={`ml-3 text-xs transition ${openAge ? "rotate-180" : ""}`}>▼</span>
                            </button>

                            {openAge && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden z-20">
                                    {[
                                        { label: "1 – 3 Years", value: "1-3" },
                                        { label: "4 – 6 Years", value: "4-6" },
                                        { label: "7 – 9 Years", value: "7-9" },
                                    ].map((a) => (
                                        <div
                                            key={a.value}
                                            onClick={() => { setAge(a.value); setOpenAge(false); }}
                                            className="px-5 py-2 text-sm cursor-pointer hover:bg-login-btn hover:text-white"
                                        >
                                            {a.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ========== Clear ========== */}
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2.5 rounded-full text-sm bg-login-btn text-white hover:opacity-90 transition"
                        >
                            Clear Filter
                        </button>

                    </div>




                    {/* Cards */}
                    {loading ? (
                        <Spinner />
                    ) : (
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
                    )}

                    {/* Pagination */}
                    <Pagination
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />

                </div>
            </section>

        </>
    );
};

export default Adoption;
