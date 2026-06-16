import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoIosSearch } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://petmarket.runasp.net/api/Animals";

const Animals = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [animals, setAnimals] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const pageSize = 4;

    // 🔥 Fetch
    const fetchAnimals = async () => {
        try {
            const res = await axios.get(BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    PageNumber: page,
                    PageSize: pageSize,
                    Search: search,
                },
            });

            setAnimals(res.data.data.items);
            setTotalItems(res.data.data.totalItemsCount);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, [page, search]);

    // 🔥 Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the animal",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#011749",
            cancelButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BASE_URL}/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    fetchAnimals();

                    Swal.fire("Deleted!", "Animal removed.", "success");
                } catch (err) {
                    console.log(err);
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
                        placeholder="Search"
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
                    onClick={() => navigate("/admin/animals/add")}
                    className="bg-[#011749] text-white px-5 py-2 rounded-xl"
                >
                    + Add Animal
                </button>

            </div>

            {/* 🔥 Title */}
            <div className="flex justify-center mb-6">
                <div className="flex gap-6 bg-white px-4 py-2 rounded-full shadow-sm">

                    <button className="bg-[#011749] text-white px-5 py-2 rounded-full text-sm">
                        Adoption
                    </button>

                    <button className="text-gray-400 text-sm">
                        Foster
                    </button>

                    <button className="text-gray-400 text-sm">
                        Sponsor
                    </button>

                </div>
            </div>

            {/* 🔥 Cards */}
            <div className="flex flex-col gap-4">

                {animals.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
                    >

                        {/* Left */}
                        <div className="flex items-center gap-4">

                            {/* Image */}
                            <img
                                src={`http://petmarket.runasp.net${item.photos[0]?.imageUrl}`}
                                alt=""
                                className="w-28 h-20 object-cover rounded-xl"
                            />

                            {/* Info */}
                            <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>

                                <p className="text-gray-400 text-sm">
                                    Cairo, Egypt
                                </p>

                                <p className="text-gray-400 text-sm">
                                    Size: {item.size}
                                </p>
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => navigate(`/admin/animals/edit/${item.id}`)}
                                className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100"
                            >
                                <MdModeEditOutline />
                            </button>

                            <button
                                onClick={() => handleDelete(item.id)}
                                className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-red-100"
                            >
                                <RiDeleteBin6Line />
                            </button>

                        </div>

                    </div>
                ))}

            </div>

            {/* 🔥 Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-400">

                <p>
                    Showing {(page - 1) * pageSize + 1} -{" "}
                    {Math.min(page * pageSize, totalItems)} of {totalItems}
                </p>

                <div className="flex gap-2">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-1 bg-gray-100 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-1 bg-[#011749] text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Animals;