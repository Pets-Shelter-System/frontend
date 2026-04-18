import { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../components/context/AuthContext";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://petmarket.runasp.net/api/Animals";

const AddAnimal = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Name: "",
        Description: "",
        AgeYears: "",
        Size: "",
        WeightKg: "",
        Gender: "",
        PetTypeId: "",
        AnimalsFriendlyLevel: 1,
        ChildrenFriendlyLevel: 1,
        HouseTrainedLevel: 1,
    });
    const [photos, setPhotos] = useState([]);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);

        if (photos.length + files.length > 3) {
            alert("Max 3 images only");
            return;
        }

        const newPhotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setPhotos((prev) => [...prev, ...newPhotos]);
    };

    const removePhoto = (index) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();

            Object.keys(formData).forEach((key) => {
                form.append(key, formData[key]);
            });

            photos.forEach((p) => {
                form.append("Photos", p.file);
            });

            await axios.post(BASE_URL, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                icon: "success",
                title: "Added!",
                text: "Animal added successfully",
                confirmButtonColor: "#011749",
            });
            navigate("/admin/animals");

        } catch (err) {
            console.log(err.response?.data || err);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Something went wrong",
            });
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto">

            {/* 🔥 Container */}
            <div className="bg-white rounded-3xl shadow-sm p-6 font-inter tracking-wide text-[#011749]">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <IoArrowBack />

                    </button>
                    <h1 className="text-2xl font-semibold">Back to Animals</h1>
                </div>

                <form className="space-y-10" onSubmit={handleSubmit} >

                    {/* 🔹 Basic Info */}
                    <section>
                        <h2 className="text-xl font-bold mb-8">Basic Information</h2>

                        {/* Photo */}
                        <div className="mb-8">
                            <div className="flex items-center gap-6 mb-4">
                                <span className="text-sm text-gray-400">Add Photos</span>

                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    id="photoInput"
                                />

                                {/* Upload Box */}
                                {photos.length < 3 && (
                                    <label
                                        htmlFor="photoInput"
                                        className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-gray-400 transition"
                                    >
                                        <span className="text-xl">+</span>
                                        <span className="text-xs mt-1">Add Photo</span>
                                    </label>
                                )}
                            </div>

                            {/* Preview Images */}
                            <div className="flex gap-4 flex-wrap">
                                {photos.map((photo, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={photo.preview}
                                            alt="preview"
                                            className="w-24 h-24 object-cover rounded-lg border"
                                        />

                                        {/* Delete button */}
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="grid md:grid-cols-2 gap-6">

                            <input
                                placeholder="Enter Animal Name"
                                name="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#011749]"
                            />

                            <select className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#011749] text-gray-500" name="PetTypeId" value={formData.PetTypeId} onChange={handleChange}>
                                <option value="">Select Type</option>
                                <option value="1">Dogs</option>
                                <option value="2">Cats</option>
                            </select>

                            <input
                                placeholder="Enter Animal Size"
                                name="Size"
                                value={formData.Size}
                                onChange={handleChange}
                                className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                            />

                            <input
                                placeholder="Enter Animal Location"
                                className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                            />
                            <input
                                type="number"
                                name="AgeYears"
                                value={formData.AgeYears}
                                onChange={handleChange}
                                placeholder="Age"
                                className="px-6 py-4 bg-gray-50 border rounded-2xl"
                            />

                            <input
                                type="number"
                                name="WeightKg"
                                value={formData.WeightKg}
                                onChange={handleChange}
                                placeholder="Weight"
                                className="px-6 py-4 bg-gray-50 border rounded-2xl"
                            />

                            <textarea
                                placeholder="Enter a Brief Description..."
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                className="md:col-span-2 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                            />
                        </div>

                        {/* Radios */}
                        <div className="grid md:grid-cols-2 gap-12 mt-8">

                            <div>
                                <p className="text-sm text-gray-500 mb-4">
                                    Select Adoption Type:
                                </p>

                                <div className="space-y-3">
                                    {["Adoption", "Foster", "Sponsor"].map((item) => (
                                        <label key={item} className="flex items-center gap-3 text-gray-400">
                                            <input type="radio"
                                                name="AdoptionType"
                                                value="Adoption"
                                                onChange={handleChange} />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-4">
                                    Select Animal Gender
                                </p>

                                <div className="flex gap-10">
                                    <label className="flex items-center gap-3 text-gray-400">
                                        <input type="radio" name="Gender" value='Male' onChange={handleChange} />
                                        Male
                                    </label>

                                    <label className="flex items-center gap-3 text-gray-400">
                                        <input type="radio" name="Gender" value="Female" onChange={handleChange} />
                                        Female
                                    </label>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* 🔹 Health */}
                    <section>
                        <h2 className="text-xl font-bold mb-8">Health Information</h2>

                        <div className="space-y-8">

                            <input
                                placeholder="Enter Health Status"
                                className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                            />

                            <div className="grid md:grid-cols-2 gap-12">

                                <div>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Has This Animal been Vaccinated?
                                    </p>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 text-gray-400">
                                            <input type="checkbox" />
                                            Yes
                                        </label>

                                        <label className="flex items-center gap-3 text-gray-400">
                                            <input type="checkbox" />
                                            No
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Neutered / Spayed?
                                    </p>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 text-gray-400">
                                            <input type="checkbox" />
                                            Yes
                                        </label>

                                        <label className="flex items-center gap-3 text-gray-400">
                                            <input type="checkbox" />
                                            No
                                        </label>
                                    </div>
                                </div>

                            </div>

                            <textarea
                                placeholder="Medical Notes..."
                                className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                            />
                        </div>
                    </section>

                    {/* 🔥 Save */}
                    <div className="flex justify-center">
                        <button className="bg-[#011749] text-white px-16 py-4 rounded-xl font-bold shadow-md hover:opacity-90">
                            Save
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default AddAnimal;