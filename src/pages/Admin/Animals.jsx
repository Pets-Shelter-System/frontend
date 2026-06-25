import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoIosSearch } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const Animals = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("adoption"); // "adoption" | "foster"
    const [animals, setAnimals] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const pageSize = 4;

    const currentBaseUrl = activeTab === "adoption" 
        ? "https://petmarket.runasp.net/api/Animals" 
        : "https://petmarket.runasp.net/api/FosterAnimals";

    // 🔥 Fetch
   const fetchAnimals = async () => {
    try {

        const res = await axios.get(
            currentBaseUrl,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },

                params: {
                    PageNumber: page,
                    PageSize: pageSize,
                    Search: search,
                },
            }
        );

        const response =
            res.data?.data ||
            res.data;

        setAnimals(
            response?.items || []
        );

        setTotalItems(
            response?.totalItemsCount || 0
        );

    } catch (err) {

        console.log(
            "Fetch Error:",
            err
        );

        setAnimals([]);

        setTotalItems(0);

    }
};

    useEffect(() => {
        fetchAnimals();
    }, [page, search, activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
        setSearch("");
    };

    // 🔥 Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: `This will delete the ${activeTab} animal`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#011749",
            cancelButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${currentBaseUrl}/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    fetchAnimals();

                    Swal.fire("Deleted!", "Animal removed.", "success");
                } catch (err) {
                    console.log(err);
                    Swal.fire("Error!", "Failed to delete animal.", "error");
                }
            }
        });
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <div className="font-inter tracking-wide text-[#011749] max-w-[1000px] p-6">

            {/* 🔥 Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

                {/* Search */}
                <div className="flex items-center gap-2 bg-[#D9D9D95C] px-4 py-2 rounded-xl shadow-sm w-full md:w-[50%]">
                    <IoIosSearch className="text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab} animals...`}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full outline-none bg-transparent text-sm"
                    />
                </div>

                {/* Add Button */}
                <button
                    onClick={() => navigate(activeTab === "adoption" ? "/admin/animals/add" : "/admin/animals/foster/add")}
                    className="bg-[#011749] text-white px-5 py-2 rounded-xl"
                >
                    + Add {activeTab === "adoption" ? "Animal" : "Foster"}
                </button>

            </div>

            {/* 🔥 Title / Tabs */}
            <div className="flex justify-center mb-10">
                <div className="flex gap-2 bg-white px-2 py-2 rounded-full shadow-sm border border-gray-100">
                    <button 
                        onClick={() => handleTabChange("adoption")}
                        className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                            activeTab === "adoption" ? "bg-[#011749] text-white shadow-md" : "text-gray-400 hover:text-[#011749]"
                        }`}
                    >
                        Adoption
                    </button>

                    <button 
                        onClick={() => handleTabChange("foster")}
                        className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                            activeTab === "foster" ? "bg-[#011749] text-white shadow-md" : "text-gray-400 hover:text-[#011749]"
                        }`}
                    >
                        Foster
                    </button>

                    <button disabled className="px-8 py-2 rounded-full text-sm font-bold text-gray-200 cursor-not-allowed">
                        Sponsor
                    </button>
                </div>
            </div>

            {/* 🔥 Cards */}
            <div className="flex flex-col gap-4 min-h-[400px]">
                {animals.length > 0 ? (
                    animals.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-transparent hover:border-[#01174910] transition-all"
                        >
                            {/* Left */}
                            <div className="flex items-center gap-4">
                                {/* Image */}
                                <img
                                    src={`https://petmarket.runasp.net${item.photos?.[0]?.imageUrl || "/placeholder.png"}`}
                                    alt={item.name}
                                    className="w-28 h-20 object-cover rounded-xl bg-gray-50"
                                />

                                {/* Info */}
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-400 text-sm">Cairo, Egypt</p>
                                    <p className="text-gray-400 text-sm">
                                        Size: {item.size} • Breed: {item.breed || "Mixed"}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate(`/admin/animals/${activeTab === "adoption" ? "" : "foster/"}edit/${item.id}`)}
                                    className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <MdModeEditOutline />
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
                                >
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                        <p className="text-lg font-medium">No {activeTab} animals found</p>
                    </div>
                )}
            </div>

            {/* 🔥 Pagination */}
            {totalItems > 0 && (
                <div className="flex justify-between items-center mt-8 text-sm text-gray-400">
                    <p>
                        Showing {(page - 1) * pageSize + 1} -{" "}
                        {Math.min(page * pageSize, totalItems)} of {totalItems}
                    </p>

                    <div className="flex gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-6 py-2 bg-white border border-gray-100 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>

                        <button
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-6 py-2 bg-[#011749] text-white rounded-xl font-bold shadow-md shadow-[#01174920] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Animals;