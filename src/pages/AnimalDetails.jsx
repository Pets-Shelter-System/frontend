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


const BASE_URL = "https://petmarket.runasp.net";


const getImage = (img) =>
    img ? `${BASE_URL}${img}` : "https://via.placeholder.com/300";


const AnimalDetails = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/Animals/${id}`);
                const data = await res.json();
                setAnimal(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimal();
    }, [id]);

    if (loading) return <Spinner />;
    if (!animal) return null;
    ``
    return (
        <section className="bg-[#F6F7F9] py-16 px-4">
            <div className="max-w-[1200px] mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                    {/* LEFT */}
                    <div>
                        {/* Name */}
                        <h2 className="text-3xl font-bold text-[#011749] mb-6">
                            {animal.name}
                        </h2>

                        {/* Images */}
                        <div className="grid grid-cols-3 gap-[15px]">
                            {/* Big image */}
                            <img
                                src={getImage(animal.photos?.[0]?.imageUrl)}
                                className="col-span-1 row-span-2 rounded-2xl object-cover h-[320px]"
                                alt={animal.name}
                            />

                            {/* Small images column */}
                            <div className="flex flex-col gap-[10px]">
                                {animal.photos?.slice(1, 3).map((img) => (
                                    <img
                                        key={img.id}
                                        src={getImage(img.imageUrl)}
                                        className="rounded-xl object-cover h-[155px]"
                                        alt=""
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col justify-between">

                        {/* Breed + Description */}
                        <div>
                            <p className="text-sm text-gray-500 mb-2">
                                Breed : <span className="font-medium">{animal.petTypeName}</span>
                            </p>

                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                {animal.description}
                            </p>

                            {/* Info */}
                            <div className="space-y-4 text-sm bg-[#F8F9FB] p-6 rounded-2xl border border-gray-50">
                                <div className="flex items-center gap-3 text-[#011749]">
                                    <FaCalendarAlt className="text-[#F8B63D]" />
                                    <span className="font-medium">Age:</span>
                                    <span className="ml-auto text-gray-600">{animal.ageYears} years</span>
                                </div>


                                <div className="flex items-center gap-3 text-[#011749]">
                                    <FaRulerCombined className="text-[#F8B63D]" />
                                    <span className="font-medium">Size:</span>
                                    <span className="ml-auto text-gray-600">{animal.size}</span>
                                </div>


                                <div className="flex items-center gap-3 text-[#011749]">
                                    <FaVenusMars className="text-[#F8B63D]" />
                                    <span className="font-medium">Gender:</span>
                                    <span className="ml-auto text-gray-600">{animal.gender}</span>
                                </div>

                            </div>
                        </div>

                        {/* Buttons */}
                         <div className="flex flex-col sm:flex-row gap-4 mt-12">
                            <button
                                onClick={() => navigate(`/foster/${id}/foster-me`)}
                                className="bg-[#011749] text-white px-8 py-3 rounded-full text-sm font-bold hover:scale-[1.02] transition transform active:scale-95 flex-grow text-center"
                            >
                                Adopt Me
                            </button>
                        </div>
                    </div>
                </div>

                {/* RATINGS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F1F3F6] shadow-sm rounded-2xl mt-10 p-6 text-center text-sm">

                    <div>
                        <p className="font-medium mb-2">Animal-friendly</p>
                        <div className="flex justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaPaw
                                    key={i}
                                    className={
                                        i < animal.animalsFriendlyLevel
                                            ? "text-[#F8B63D]"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>

                    </div>

                    <div>
                        <p className="font-medium mb-2">Children-friendly</p>
                        <div className="flex justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaChild
                                    key={i}
                                    className={
                                        i < animal.childrenFriendlyLevel
                                            ? "text-[#F8B63D]"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>

                    </div>

                    <div>
                        <p className="font-medium mb-2">House-Trained</p>
                        <div className="flex justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaHome
                                    key={i}
                                    className={
                                        i < animal.houseTrainedLevel
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

export default AnimalDetails;
