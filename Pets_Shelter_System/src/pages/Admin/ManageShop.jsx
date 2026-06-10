import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoIosSearch, IoMdMore, IoIosClose, IoIosWarning } from "react-icons/io";
import { LuFilter, LuImagePlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const BASE_URL = "http://petmarket.runasp.net/api/Products";
const IMG_BASE = "http://petmarket.runasp.net";

const ManageShop = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 12;

    // Modals state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null); // ID of product with open dropdown

    // Forms State
    const [editFormData, setEditFormData] = useState({
        name: "",
        categoryName: "",
        petTypeName: "",
        price: "",
        stock: "",
        description: "",
        sku: "",
    });
    const [addFormData, setAddFormData] = useState({
        name: "",
        categoryName: "Food",
        petTypeName: "Dogs",
        price: "",
        stock: "",
        description: "",
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);



    // 🔥 Fetch Products
    const fetchProducts = async () => {
        try {
            const res = await axios.get(BASE_URL, {
                params: {
                    pageNumber: page,
                    pageSize: pageSize,
                },
            });

            setProducts(res.data.data.items);
            setTotalItems(res.data.data.totalItemsCount);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const totalPages = Math.ceil(totalItems / pageSize);

    // 🔥 Actions
    const openEditModal = (product) => {
        try {
            setActiveProduct(product);
            setEditFormData({
                name: product.name,
                categoryName: product.categoryName,
                petTypeName: product.petTypeName,
                price: product.price,
                stock: product.stock || 48,
                description: product.description,
                sku: product.id ? String(product.id).slice(0, 8).toUpperCase() : "",
            });
            setImagePreview(product.photos?.[0] ? IMG_BASE + product.photos[0].imageName : null);
            setSelectedImage(null);
            setShowEditModal(true);
            setShowDropdown(null);
        } catch (err) {
            console.error("Error opening edit modal:", err);
            Swal.fire("Error", "Could not open edit modal.", "error");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openDeleteModal = (product) => {
        setActiveProduct(product);
        setShowDeleteModal(true);
        setShowDropdown(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/${activeProduct.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowDeleteModal(false);
            fetchProducts();
            Swal.fire("Deleted!", "Product has been removed.", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to delete product.", "error");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append("Id", activeProduct.id);
            form.append("Name", editFormData.name);
            form.append("Description", editFormData.description);
            form.append("Price", Number(editFormData.price));
            form.append("CategoryName", editFormData.categoryName);
            form.append("PetTypeName", editFormData.petTypeName);

            if (selectedImage) {
                form.append("Photos", selectedImage);
            }

            await axios.put(`${BASE_URL}/${activeProduct.id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setShowEditModal(false);
            fetchProducts();
            Swal.fire("Updated!", "Product updated successfully.", "success");
        } catch (err) {
            console.error(err.response?.data);
            Swal.fire("Error", err.response?.data?.message || "Failed to update product.", "error");
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append("Name", addFormData.name);
            form.append("Description", addFormData.description);
            form.append("Price", Number(addFormData.price));
            form.append("CategoryName", addFormData.categoryName);
            form.append("PetTypeName", addFormData.petTypeName);
            form.append("Stock", Number(addFormData.stock));

            if (selectedImage) {
                form.append("Photos", selectedImage);
            }

            await axios.post(BASE_URL, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setShowAddModal(false);
            setAddFormData({
                name: "",
                categoryName: "Food",
                petTypeName: "Dogs",
                price: "",
                stock: "",
                description: "",
            });
            setSelectedImage(null);
            setImagePreview(null);
            fetchProducts();
            Swal.fire("Success", "Product added successfully.", "success");
        } catch (err) {
            console.error(err.response?.data);
            Swal.fire("Error", err.response?.data?.message || "Failed to add product.", "error");
        }
    };


    // Filter products based on search
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(search.toLowerCase()) ||
        p.petTypeName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-[1100px] p-6 font-inter tracking-wide">
            {/* 🔥 Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[40px] font-bold text-[#011749]">
                        Shop Inventory
                    </h1>
                    <p className="text-[#44474E] mt-2 max-w-xl text-sm">
                        Precision management for high-end veterinary supplies and specialty animal care products.
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#44474E] shadow-sm hover:bg-gray-50 transition-colors">
                        <LuFilter className="text-gray-400" />
                        Filter
                    </button> */}
                    <button
                        onClick={() => {
                            navigate("/admin/shop/add")
                            setAddFormData({
                                name: "",
                                categoryName: "Food",
                                petTypeName: "Dogs",
                                price: "",
                                stock: "",
                                description: "",
                            });
                            setSelectedImage(null);
                            setImagePreview(null);
                        }}
                        className="px-6 py-2 bg-[#011749] text-white rounded-lg text-sm font-semibold hover:bg-[#022572] transition-colors"
                    >
                        + Add New Product
                    </button>

                </div>
            </div>

            {/* 🔥 Stats Card */}
            <div className="mb-8 max-w-[280px]">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                        Total Items
                    </p>
                    <h2 className="text-4xl font-bold text-[#011749]">
                        {totalItems.toLocaleString()}
                    </h2>
                </div>
            </div>

            {/* 🔥 Search Bar */}
            <div className="mb-6 relative max-w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C4C6CF]">
                    <IoIosSearch size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#011749] outline-none shadow-sm transition-all"
                />
            </div>

            {/* 🔥 Table */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-[#F9FAFB] border-b border-gray-100">
                        <tr className="text-[#44474E] text-[11px] font-bold uppercase tracking-widest">
                            <th className="px-6 py-5 text-left">Product</th>
                            <th className="px-6 py-5 text-left">Category</th>
                            <th className="px-6 py-5 text-left">Pet Type</th>
                            <th className="px-6 py-5 text-left">Price</th>
                            <th className="px-6 py-5 text-left">Rating</th>
                            <th className="px-6 py-5 text-center w-20">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                {/* Product Name & Image */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                            <img
                                                src={p.photos?.[0] ? IMG_BASE + p.photos[0].imageName : "/placeholder.png"}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="font-bold text-[#011749]">{p.name}</span>
                                    </div>
                                </td>

                                {/* Category Badge */}
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600">
                                        {p.categoryName}
                                    </span>
                                </td>

                                {/* Pet Type */}
                                <td className="px-6 py-4 text-gray-500 font-medium">
                                    {p.petTypeName}
                                </td>

                                {/* Price */}
                                <td className="px-6 py-4">
                                    <span className="font-bold text-[#011749]">EGP {(p.price || 0).toFixed(2)}</span>
                                </td>

                                {/* Rating */}
                                <td className="px-6 py-4 text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-yellow-400">★</span>
                                        <span className="text-xs font-bold text-[#011749]">{p.rating.toFixed(1)}</span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-center relative">
                                    <button
                                        onClick={() => setShowDropdown(showDropdown === p.id ? null : p.id)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 focus:outline-none"
                                    >
                                        <IoMdMore size={20} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showDropdown === p.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowDropdown(null)}
                                            ></div>
                                            <div className={`absolute right-0 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 overflow-hidden ${products.indexOf(p) >= products.length - 3 ? "bottom-full mb-2" : "mt-2"
                                                }`}>
                                                <button
                                                    onClick={() => openEditModal(p)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/shop/product/${p.id}`)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(p)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🔥 Pagination */}
            <div className="flex justify-between items-center mt-8 text-sm px-2">
                <p className="text-gray-400 font-medium">
                    Showing <span className="text-[#011749]">{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)}</span> items
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                    >
                        Previous
                    </button>
                    {[...Array(Math.min(totalPages, 3))].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-all ${page === i + 1
                                ? "bg-[#011749] text-white shadow-md shadow-[#011749]/20"
                                : "text-gray-400 hover:bg-gray-50"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    {totalPages > 3 && <span className="flex items-end px-1 text-gray-400 text-lg">...</span>}
                    {totalPages > 3 && (
                        <button
                            onClick={() => setPage(totalPages)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${page === totalPages ? "bg-[#011749] text-white" : "text-gray-400"
                                }`}
                        >
                            {totalPages}
                        </button>
                    )}
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-1.5 bg-[#011749] text-white rounded-lg hover:bg-[#022572] disabled:opacity-50 transition-colors font-bold ml-2 shadow-md shadow-[#011749]/20"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* 🔥 Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 pb-4 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <IoIosWarning className="text-red-500 text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#011749] mb-4">Confirm Deletion</h3>
                            <p className="text-[#44474E] text-sm leading-relaxed px-6">
                                Are you sure you want to delete this product? <br />
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="bg-[#F9FAFB] p-6 flex flex-col gap-3">
                            <button
                                onClick={handleDelete}
                                className="w-full py-4 bg-[#C9241E] text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-[#A81E19] transition-all transform active:scale-95"
                            >
                                Delete Product
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-4 text-[#44474E] font-bold text-sm hover:bg-gray-100 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔥 Edit Product Modal */}
{showEditModal && (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[5px] flex items-center justify-center p-5">

        <div
            className="
            bg-white
            w-full
            max-w-[700px]
            h-[88vh]
            rounded-[42px]
            overflow-hidden
            shadow-[0_25px_90px_rgba(1,23,73,.18)]
            flex
            flex-col
        "
        >

            {/* Header */}

            <div className="relative px-8 pt-7 pb-5 shrink-0">

                <button
                    onClick={() => setShowEditModal(false)}
                    className="
                    absolute
                    right-6
                    top-6
                    p-2
                    rounded-full
                    hover:bg-gray-100
                    text-gray-400
                "
                >
                    <IoIosClose size={28} />
                </button>

                <h3 className="text-[30px] font-bold text-[#011749]">
                    Edit Product
                </h3>

                <p className="text-[#9AA0AE] text-sm mt-2">
                    Modify inventory details for item ID:
                    <span className="ml-1 text-[#011749]">
                        {editFormData.sku}
                    </span>
                </p>

            </div>

            {/* BODY */}

            <form
                onSubmit={handleEditSubmit}
                className="flex flex-col flex-1 min-h-0"
            >

                <div
                    className="
                    px-8
                    pb-6
                    overflow-y-auto
                    flex-1
                "
                >

                    {/* Image */}

                    <div className="bg-[#F8F8FA] rounded-[28px] p-5 flex items-center gap-5 mb-6">

                        <div className="w-[92px] h-[92px] rounded-[24px] overflow-hidden">

                            <img
                                src={
                                    imagePreview ||
                                    "/placeholder.png"
                                }
                                alt=""
                                className="w-full h-full object-cover"
                            />

                        </div>

                        <div>

                            <p className="font-bold text-[#011749]">
                                Product Image
                            </p>

                            <p className="text-sm text-gray-400">
                                JPG or PNG, max 5MB
                            </p>

                            <label className="cursor-pointer text-[#011749] font-bold mt-2 inline-flex items-center gap-2">

                                <LuImagePlus />

                                Change image

                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                />

                            </label>

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-x-5 gap-y-5">

                        <div className="col-span-2">

                            <label className="text-xs font-bold text-[#011749]">
                                PRODUCT NAME
                            </label>

                            <input
                                value={editFormData.name}
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        name:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full mt-2 h-[58px] rounded-[18px] bg-[#F5F5F7] px-5"
                            />

                        </div>

                        <div>

                            <label className="text-xs font-bold text-[#011749]">
                                CATEGORY
                            </label>

                            <select
                                value={
                                    editFormData.categoryName
                                }
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        categoryName:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full mt-2 h-[58px] rounded-[18px] bg-[#F5F5F7] px-5"
                            >
                                <option>
                                    Food
                                </option>

                            </select>

                        </div>

                        <div>

                            <label className="text-xs font-bold text-[#011749]">
                                PRICE
                            </label>

                            <input
                                value={
                                    editFormData.price
                                }
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        price:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full mt-2 h-[58px] rounded-[18px] bg-[#F5F5F7] px-5"
                            />

                        </div>

                        <div>

                            <label className="text-xs font-bold text-[#011749]">
                                SKU
                            </label>

                            <input
                                disabled
                                value={
                                    editFormData.sku
                                }
                                className="w-full mt-2 h-[58px] rounded-[18px] bg-[#F5F5F7] px-5"
                            />

                        </div>

                        <div>

                            <label className="text-xs font-bold text-[#011749]">
                                STOCK
                            </label>

                            <input
                                value={
                                    editFormData.stock
                                }
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        stock:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full mt-2 h-[58px] rounded-[18px] bg-[#F5F5F7] px-5"
                            />

                        </div>

                        <div className="col-span-2">

                            <label className="text-xs font-bold text-[#011749]">
                                PET TYPE
                            </label>

                            <select
                                value={
                                    editFormData.petTypeName
                                }
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        petTypeName:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full mt-2 h-[58px] rounded-[18px] bg-[#F5F5F7] px-5"
                            >
                                <option>
                                    Dogs
                                </option>

                            </select>

                        </div>

                        <div className="col-span-2">

                            <label className="text-xs font-bold text-[#011749]">
                                DESCRIPTION
                            </label>

                            <textarea
                                rows={3}
                                value={
                                    editFormData.description
                                }
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        description:
                                            e.target
                                                .value,
                                    })
                                }
                                className="
                                w-full
                                mt-2
                                rounded-[18px]
                                bg-[#F5F5F7]
                                p-5
                                resize-none
                            "
                            />

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="px-8 py-5 border-t flex justify-end gap-5 shrink-0">

                    <button
                        type="button"
                        onClick={() =>
                            setShowEditModal(false)
                        }
                        className="text-gray-500 font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="
                        h-[52px]
                        px-8
                        rounded-[18px]
                        bg-[#011749]
                        text-white
                        font-bold
                    "
                    >
                        Save Changes
                    </button>

                </div>

            </form>

        </div>

    </div>
)}
        </div>
    );
};

export default ManageShop;
