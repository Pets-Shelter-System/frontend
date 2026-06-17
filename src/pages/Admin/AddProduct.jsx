import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoIosArrowBack, IoIosClose } from "react-icons/io";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlinePriceChange, MdOutlineInventory } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import Swal from "sweetalert2";

const BASE_URL = "https://petmarket.runasp.net/api/Products";

const AddProduct = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        petTypeId: "",
        price: "",
        stock: "",
        description: "",
    });

    const [categories, setCategories] = useState([]);

    const [petTypes, setPetTypes] = useState([]);

    const [showCategory, setShowCategory] = useState(false);
    const [showPetType, setShowPetType] = useState(false);


    const [images, setImages] = useState([]); // Array to hold multiple images
    const [previews, setPreviews] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            Swal.fire("Limit Exceeded", "You can only upload up to 5 images.", "warning");
            return;
        }

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...files]);
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!images.length) {
            Swal.fire(
                "Missing Image",
                "Please upload at least one product image.",
                "warning"
            );

            return;
        }

        try {

            Swal.fire({
                title:
                    "Registering Product...",
                didOpen: () =>
                    Swal.showLoading(),
                allowOutsideClick:
                    false,
            });

            const data =
                new FormData();

            data.append(
                "Name",
                formData.name
            );

            data.append(
                "Description",
                formData.description
            );

            data.append(
                "Price",
                Number(
                    formData.price
                )
            );

            data.append(
                "CategoryId",
                Number(
                    formData.categoryId
                )
            );

            data.append(
                "PetTypeId",
                Number(
                    formData.petTypeId
                )
            );

            images.forEach(
                (img) => {

                    data.append(
                        "Photos",
                        img,
                        img.name
                    );

                }
            );

            await axios.post(
                BASE_URL,
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title:
                    "Product Registered!",
                text:
                    "The item has been added successfully.",
                confirmButtonColor:
                    "#011749",
            }).then(() => {

                navigate(
                    "/admin/shop"
                );

            });

        }

        catch (err) {

            console.log(
                err.response?.data
            );

            Swal.fire({

                icon: "error",

                title:
                    "Request Failed",

                text:
                    err.response?.data?.message ||
                    JSON.stringify(
                        err.response
                            ?.data
                    ),

                confirmButtonColor:
                    "#011749",

            });

        }

    };


    useEffect(() => {

        const fetchDropdowns =
            async () => {

                try {

                    const [
                        categoryRes,
                        petTypeRes
                    ] =
                        await Promise.all([

                            axios.get(
                                "https://petmarket.runasp.net/api/Category"
                            ),

                            axios.get(
                                "https://petmarket.runasp.net/api/PetTypes"
                            ),

                        ]);

                    const categoryData =
                        categoryRes.data.data ||
                        categoryRes.data;

                    const petData =
                        petTypeRes.data.data ||
                        petTypeRes.data;

                    setCategories(
                        categoryData
                    );

                    setPetTypes(
                        petData
                    );

                    setFormData(
                        (prev) => ({
                            ...prev,

                            categoryId:
                                categoryData?.[0]
                                    ?.id || "",

                            petTypeId:
                                petData?.[0]
                                    ?.id || "",
                        })
                    );

                }

                catch (err) {

                    console.log(
                        err
                    );

                }

            };

        fetchDropdowns();

    }, []);
    return (
        <div className="max-w-[1200px] mx-auto p-4 md:p-8 font-inter tracking-wide animate-in fade-in duration-500">
            {/* Header Navigation */}
            <div className="flex items-center gap-6 mb-10">
                <button
                    onClick={() => navigate("/admin/shop")}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-all text-[#011749]"
                >
                    <IoIosArrowBack size={24} />
                </button>
                <h1 className="text-3xl font-black text-[#011749]">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Core Information & Business Details */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Core Information Card */}
                    <div className="bg-white rounded-[40px] p-8 shadow-[0_15px_50px_rgba(1,23,73,0.05)] border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-xl font-bold text-[#011749]">Core Information</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-[#011749] uppercase tracking-[2px] mb-3 ml-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Clinical Recovery Kibble - Large Breed"
                                    className="w-full bg-[#F4F4F7] rounded-[22px] px-6 py-5 text-sm text-[#011749] font-semibold outline-none border-2 border-transparent focus:border-[#011749]/10 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-[#011749] uppercase tracking-[2px] mb-3 ml-1">Category</label>

                                <div className="relative">

                                    <button
                                        type="button"
                                        onClick={() => setShowCategory(!showCategory)}
                                        className="w-full h-[60px] bg-[#F4F4F7] rounded-[18px] px-6 flex items-center justify-between text-sm text-[#011749] font-semibold border border-transparent hover:border-[#011749]/10 transition-all"
                                    >
                                        <span>{categories.find((c) => c.id === Number(formData.categoryId))?.name || "Select Category"}</span>

                                        <span className={`transition ${showCategory ? "rotate-180" : ""}`}>
                                            ⌄
                                        </span>
                                    </button>

                                    {showCategory && (
                                        <div className="absolute top-[70px] left-0 right-0 max-h-[180px] bg-white rounded-[18px] border border-[#ECECEC] shadow-[0_12px_35px_rgba(1,23,73,.08)] overflow-y-auto overflow-x-hidden z-50">

                                            {categories.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, categoryId: c.id }));
                                                        setShowCategory(false);
                                                    }}
                                                    className={`w-full min-h-[50px] px-6 flex items-center text-left text-[15px] font-semibold transition ${Number(formData.categoryId) === c.id ? "bg-[#011749] text-white" : "text-[#011749] hover:bg-[#F6F7F9]"}`}
                                                >
                                                    {c.name}
                                                </button>
                                            ))}

                                        </div>
                                    )}

                                </div>
                            </div>


                            <div>
                                <label className="block text-[11px] font-black text-[#011749] uppercase tracking-[2px] mb-3 ml-1">Pet Type</label>

                                <div className="relative">

                                    <button
                                        type="button"
                                        onClick={() => setShowPetType(!showPetType)}
                                        className="w-full h-[60px] bg-[#F4F4F7] rounded-[18px] px-6 flex items-center justify-between text-sm text-[#011749] font-semibold border border-transparent hover:border-[#011749]/10 transition-all"
                                    >
                                        <span>{petTypes.find((p) => p.id === Number(formData.petTypeId))?.name || "Select Pet Type"}</span>

                                        <span className={`transition ${showPetType ? "rotate-180" : ""}`}>
                                            ⌄
                                        </span>
                                    </button>

                                    {showPetType && (
                                        <div className="absolute top-[70px] left-0 right-0 max-h-[180px] bg-white rounded-[18px] border border-[#ECECEC] shadow-[0_12px_35px_rgba(1,23,73,.08)] overflow-y-auto overflow-x-hidden z-50">

                                            {petTypes.map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, petTypeId: p.id }));
                                                        setShowPetType(false);
                                                    }}
                                                    className={`w-full min-h-[50px] px-6 flex items-center text-left text-[15px] font-semibold transition ${Number(formData.petTypeId) === p.id ? "bg-[#011749] text-white" : "text-[#011749] hover:bg-[#F6F7F9]"}`}
                                                >
                                                    {p.name}
                                                </button>
                                            ))}

                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-[#011749] uppercase tracking-[2px] mb-3 ml-1">Detailed Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Specify clinical benefits, active ingredients, and usage guidelines..."
                                    className="w-full bg-[#F4F4F7] rounded-[22px] px-6 py-5 text-sm text-[#011749] font-semibold outline-none border-2 border-transparent focus:border-[#011749]/10 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Pricing Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-[0_15px_50px_rgba(1,23,73,0.05)] border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <MdOutlinePriceChange size={20} />
                                </div>
                                <h3 className="font-bold text-[#011749]">Pricing</h3>
                            </div>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="w-full bg-[#F4F4F7] rounded-[20px] pl-10 pr-6 py-4 text-sm text-[#011749] font-black outline-none border-2 border-transparent focus:border-[#011749]/10"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-3 ml-1 font-medium">MSRP will be calculated automatically</p>
                        </div>

                        {/* Stock Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-[0_15px_50px_rgba(1,23,73,0.05)] border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
                                    <MdOutlineInventory size={20} />
                                </div>
                                <h3 className="font-bold text-[#011749]">Initial Stock</h3>
                            </div>
                            <input
                                type="number"
                                name="stock"
                                required
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="w-full bg-[#F4F4F7] rounded-[20px] px-6 py-4 text-sm text-[#011749] font-black outline-none border-2 border-transparent focus:border-[#011749]/10"
                            />
                            <p className="text-[10px] text-gray-400 mt-3 ml-1 font-medium">Alerts triggered at 5 units remaining</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Visuals & Actions */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    {/* Product Visuals Card */}
                    <div className="bg-white rounded-[40px] p-8 shadow-[0_15px_50px_rgba(1,23,73,0.05)] border border-gray-100 flex-1">
                        <h2 className="text-xl font-bold text-[#011749] mb-8">Product Visuals</h2>

                        <div className="space-y-6">
                            {/* Main Upload Box */}
                            <label className="block relative aspect-square bg-[#F4F4F7] rounded-[32px] border-2 border-dashed border-gray-200 hover:border-[#011749] transition-all cursor-pointer group overflow-hidden">
                                {previews[0] ? (
                                    <img src={previews[0]} alt="Main preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                            <LuImagePlus size={32} className="text-[#011749]" />
                                        </div>
                                        <h4 className="font-bold text-[#011749] mb-1">Upload Studio Assets</h4>
                                        <p className="text-xs text-gray-400 max-w-[200px]">High-resolution PNG or JPG preferred. Minimum 1200 x 1200px.</p>
                                    </div>
                                )}
                                <input type="file" hidden accept="image/*" multiple onChange={handleImageChange} />
                            </label>

                            {/* Thumbnails Row */}
                            <div className="grid grid-cols-3 gap-4">
                                {previews.slice(1, 4).map((preview, i) => (
                                    <div key={i} className="relative aspect-square bg-[#F4F4F7] rounded-2xl overflow-hidden group">
                                        <img src={preview} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i + 1)}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <IoIosClose size={14} />
                                        </button>
                                    </div>
                                ))}
                                {previews.length < 4 && Array.from({ length: 3 - (previews.length - 1 || 0) }).map((_, i) => (
                                    <label key={i} className="aspect-square bg-[#F4F4F7] rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 cursor-pointer hover:border-[#011749] transition-all">
                                        <LuImagePlus size={24} />
                                        <input type="file" hidden accept="image/*" multiple onChange={handleImageChange} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#011749] text-white py-5 rounded-[22px] font-bold text-sm shadow-[0_20px_40px_rgba(1,23,73,0.2)] hover:bg-[#021d5a] transition-all flex items-center justify-center gap-3"
                        >
                            <HiOutlineDocumentText size={20} />
                            Register Product
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/shop")}
                            className="w-full bg-white text-[#011749] py-5 rounded-[22px] font-bold text-sm border-2 border-transparent hover:border-gray-100 transition-all flex items-center justify-center gap-3"
                        >
                            <IoIosClose size={24} />
                            Cancel Entry
                        </button>
                    </div>

                    {/* Entry Guidelines */}
                    <div className="bg-[#F9FAFB] rounded-[28px] p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Entry Guidelines</h4>
                        </div>
                        <ul className="space-y-2">
                            <li className="text-[11px] text-gray-500 leading-relaxed">• Products will be live in the customer portal immediately upon registration.</li>
                            <li className="text-[11px] text-gray-500 leading-relaxed">• Clinical descriptions must be reviewed by the Lead Veterinarian before external publishing.</li>
                        </ul>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
