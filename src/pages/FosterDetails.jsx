import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

import {
    FaCalendarAlt,
    FaRulerCombined,
    FaVenusMars,
    FaPaw,
    FaChild,
    FaHome,
} from "react-icons/fa";


const BASE_URL = "http://petmarket.runasp.net";


const getImage = (img) =>
    img ? `${BASE_URL}${img}` : "https://via.placeholder.com/300";


const FosterDetails = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/FosterAnimals/${id}`);
                const data = await res.json();

                console.log("Foster Details", data);

                
                const petData = data.data || data;
                setPet(petData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPet();
    }, [id]);

    if (loading) return <Spinner />;
    if (!pet) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div>
                <h2 className="text-2xl font-bold text-[#011749] mb-4">Foster companion not found</h2>
                <button
                    onClick={() => navigate("/foster")}
                    className="bg-[#011749] text-white px-8 py-2 rounded-full font-semibold"
                >
                    Back to Search
                </button>
            </div>
        </div>
    );

    return (
        <section className="bg-[#F6F7F9] py-16 px-4">
            <div className="max-w-[1200px] mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* LEFT - Gallery */}
                    <div className="space-y-6">
                        {/* Name */}
                        <h2 className="text-3xl font-bold text-[#011749]">
                            {pet.name}
                        </h2>

                        {/* Images */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Big image */}
                            <div className="md:col-span-2">
                                <img
                                    src={getImage(pet.photos?.[0]?.imageUrl)}
                                    className="w-full h-[320px] md:h-[400px] rounded-2xl object-cover shadow-sm"
                                    alt={pet.name}
                                />
                            </div>

                            {/* Small images column */}
                            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                                {pet.photos?.slice(1, 3).map((img) => (
                                    <img
                                        key={img.id}
                                        src={getImage(img.imageUrl)}
                                        className="rounded-xl object-cover h-[100px] md:h-[190px] min-w-[120px] md:min-w-0"
                                        alt=""
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT - Info */}
                    <div className="flex flex-col justify-between pt-6 lg:pt-14">

                        {/* Breed + Description */}
                        <div>
                            <p className="text-sm text-gray-500 mb-2">
                                Breed : <span className="font-medium">{pet.petTypeName || pet.petType?.name || "N/A"}</span>
                            </p>

                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                {pet.description}
                            </p>

                            {/* Info */}
                            <div className="space-y-4 text-sm bg-[#F8F9FB] p-6 rounded-2xl border border-gray-50">
                                <div className="flex items-center gap-3 text-[#011749]">
                                    <FaCalendarAlt className="text-[#F8B63D]" />
                                    <span className="font-medium">Age:</span>
                                    <span className="ml-auto text-gray-600">{pet.ageYears} years</span>
                                </div>


                                <div className="flex items-center gap-3 text-[#011749]">
                                    <FaRulerCombined className="text-[#F8B63D]" />
                                    <span className="font-medium">Size:</span>
                                    <span className="ml-auto text-gray-600">{pet.size}</span>
                                </div>


                                <div className="flex items-center gap-3 text-[#011749]">
                                    <FaVenusMars className="text-[#F8B63D]" />
                                    <span className="font-medium">Gender:</span>
                                    <span className="ml-auto text-gray-600">{pet.gender}</span>
                                </div>

                            </div>
                        </div>

                        {/* Buttons - Same placement as AnimalDetails */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-12">
                            <button
                                onClick={() => navigate(`/foster/${id}/foster-me`)}
                                className="bg-[#011749] text-white px-8 py-3 rounded-full text-sm font-bold hover:scale-[1.02] transition transform active:scale-95 flex-grow text-center"
                            >
                                Foster Me
                            </button>
                            {/* secondary button from AnimalDetails reference if exists: and it does in the original but user asked to keep only if AnimalDetails has it. The original had Foster Me as secondary, Adopt Me as Primary. We swap it here for Foster. */}
                        </div>
                    </div>
                </div>

                {/* RATINGS - Matching AnimalDetails */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F1F3F6] shadow-sm rounded-2xl mt-12 p-8 text-center text-sm">

                    <div className="p-4 rounded-xl">
                        <p className="font-bold text-[#011749] mb-3">Animal-friendly</p>
                        <div className="flex justify-center gap-1.5 text-lg">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaPaw
                                    key={i}
                                    className={
                                        i < pet.animalsFriendlyLevel
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
                                        i < pet.childrenFriendlyLevel
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
                                        i < pet.houseTrainedLevel
                                            ? "text-[#F8B63D]"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </section>

    );
};

export default FosterDetails;
