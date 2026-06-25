import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../components/context/AuthContext";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IoIosArrowDown } from "react-icons/io";

const AnimalForm = ({ type = "adoption", mode = "create", initialData = null }) => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        ageYears: "",
        size: "Small",
        weightKg: "",
        gender: "Male",
        petTypeId: "",
        animalsFriendlyLevel: 1,
        childrenFriendlyLevel: 1,
        houseTrainedLevel: 1,
        // Foster specific
        fosterStartDate: "",
        fosterEndDate: "",
        fosterNotes: "",
        isUrgent: false,
    });

    const [photos, setPhotos] = useState([]); // { file, preview, existingUrl }

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                ageYears: initialData.ageYears || "",
                size: initialData.size || "Small",
                weightKg: initialData.weightKg || "",
                gender: initialData.gender || "Male",
                petTypeId: initialData.petTypeId || "",
                animalsFriendlyLevel: initialData.animalsFriendlyLevel || 1,
                childrenFriendlyLevel: initialData.childrenFriendlyLevel || 1,
                houseTrainedLevel: initialData.houseTrainedLevel || 1,
                fosterStartDate: initialData.fosterStartDate?.split("T")[0] || "",
                fosterEndDate: initialData.fosterEndDate?.split("T")[0] || "",
                fosterNotes: initialData.fosterNotes || "",
                isUrgent: initialData.isUrgent || false,
            });

            if (initialData.photos) {
                setPhotos(initialData.photos.map(p => ({
                    existingUrl: p.imageUrl,
                    preview: `https://petmarket.runasp.net${p.imageUrl}`
                })));
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === "checkbox" ? checked : value
        }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (photos.length + files.length > 3) {
            toast.error("Max 3 photos allowed");
            return;
        }

        const newPhotos = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const removePhoto = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.description || !formData.petTypeId) {
            toast.error("Please fill required fields");
            return;
        }

        if (photos.length === 0) {
            toast.error("At least one photo is required");
            return;
        }

        setIsSaving(true);
        try {
            const data = new FormData();
            
            // Common Fields
            data.append("Name", formData.name);
            data.append("Description", formData.description);
            data.append("AgeYears", formData.ageYears ? Number(formData.ageYears) : 0);
            data.append("Size", formData.size);
            data.append("WeightKg", formData.weightKg ? Number(formData.weightKg) : 0);
            data.append("Gender", formData.gender);
            data.append("PetTypeId", Number(formData.petTypeId));
            data.append("AnimalsFriendlyLevel", Number(formData.animalsFriendlyLevel));
            data.append("ChildrenFriendlyLevel", Number(formData.childrenFriendlyLevel));
            data.append("HouseTrainedLevel", Number(formData.houseTrainedLevel));

            // Type Specific Fields
            if (type === "foster") {
                if (formData.fosterStartDate) data.append("FosterStartDate", formData.fosterStartDate);
                if (formData.fosterEndDate) data.append("FosterEndDate", formData.fosterEndDate);
                data.append("FosterNotes", formData.fosterNotes || "");
                data.append("IsUrgent", formData.isUrgent);
                if (formData.status) data.append("Status", formData.status);
            }

            if (mode === "edit") {
                data.append("Id", initialData.id);
            }

            // Handle photos
            photos.forEach(p => {
                if (p.file) {
                    data.append("Photos", p.file);
                }
            });

            const baseUrl = type === "adoption" 
                ? "https://petmarket.runasp.net/api/Animals" 
                : "https://petmarket.runasp.net/api/FosterAnimals";
            
            const url = mode === "create" ? baseUrl : `${baseUrl}/${initialData.id}`;
            const method = mode === "create" ? "post" : "put";

            await axios({
                method,
                url,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success(`${type === "adoption" ? "Animal" : "Foster"} ${mode === "create" ? "created" : "updated"}`);
            navigate("/admin/animals");
        } catch (err) {
            console.error("Submit Error:", err.response?.data || err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const LevelSelector = ({ label, name, value }) => (
        <div className="space-y-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(lvl => (
                    <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, [name]: lvl }))}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                            value >= lvl ? "bg-[#F8B63D] text-white shadow-md scale-110" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                    >
                        {lvl}
                    </button>
                ))}
            </div>
        </div>
    );

    const CustomSelect = ({ label, name, options, value, onChange, placeholder }) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectedOption = options.find(opt => String(opt.value) === String(value));

        return (
            <div className="space-y-1.5 relative">
                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white border border-gray-200 rounded-[24px] py-4 px-6 flex justify-between items-center cursor-pointer hover:border-[#011749] transition-all shadow-sm"
                >
                    <span className={`font-medium ${selectedOption ? "text-[#011749]" : "text-gray-400"}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <IoIosArrowDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </div>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[24px] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                {options.map((opt) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => {
                                            onChange({ target: { name, value: opt.value } });
                                            setIsOpen(false);
                                        }}
                                        className={`px-6 py-4 hover:bg-[#F8B63D] hover:text-white cursor-pointer transition-colors font-medium text-sm ${
                                            String(value) === String(opt.value) ? "bg-[#011749] text-white" : "text-[#011749]"
                                        }`}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Header / Back Link */}
            <button 
                onClick={() => navigate("/admin/animals")} 
                className="flex items-center gap-2 text-[#011749] font-medium mb-6 hover:opacity-70 transition-all text-sm"
            >
                <IoArrowBack size={18} />
                <span>Back to Animals</span>
            </button>

            <form onSubmit={handleSubmit} className="bg-[#F8F9FB] rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 space-y-12">
                
                {/* 🔹 Basic Information */}
                <section className="space-y-8">
                    <h2 className="text-[28px] font-bold text-[#011749] mb-8">Basic Information</h2>

                    {/* Photos */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-10">
                        <div className="flex flex-wrap justify-center gap-6">
                            {photos.map((photo, idx) => (
                                <div key={idx} className="relative w-[120px] h-[120px] group animate-fadeIn">
                                    <img src={photo.preview} alt="preview" className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(idx)}
                                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                                    >
                                        <IoClose size={16} />
                                    </button>
                                </div>
                            ))}
                            {photos.length < 3 && (
                                <label className="w-[120px] h-[120px] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#011749] hover:bg-white transition-all text-gray-400">
                                    <span className="text-2xl font-light text-gray-300">+</span>
                                    <span className="text-[10px] font-semibold text-gray-400">Add Photo</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter Animal Name"
                                className="w-full bg-white border border-gray-200 rounded-[24px] py-4 px-6 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] placeholder:text-gray-400 font-medium shadow-sm transition-all"
                                required
                            />
                        </div>

                        {/* Pet Type */}
                        <CustomSelect 
                            name="petTypeId"
                            value={formData.petTypeId}
                            placeholder="Animal Type"
                            options={[
                                { value: "1", label: "Dog" },
                                { value: "2", label: "Cat" }
                            ]}
                            onChange={handleChange}
                        />

                        {/* Size */}
                        <div className="space-y-1.5">
                            <input
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="Enter Animal Size"
                                className="w-full bg-white border border-gray-200 rounded-[24px] py-4 px-6 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] placeholder:text-gray-400 font-medium shadow-sm transition-all"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                            <input
                                name="location"
                                value={formData.location || ""}
                                onChange={handleChange}
                                placeholder="Enter Animal Location"
                                className="w-full bg-white border border-gray-200 rounded-[24px] py-4 px-6 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] placeholder:text-gray-400 font-medium shadow-sm transition-all"
                            />
                        </div>

                        {/* Age & Weight (needed for API but showing only if not in screenshot) */}
                         <div className="space-y-1.5">
                            <input
                                type="number"
                                name="ageYears"
                                value={formData.ageYears}
                                onChange={handleChange}
                                placeholder="Enter Age (Years)"
                                step="0.1"
                                className="w-full bg-white border border-gray-200 rounded-[24px] py-4 px-6 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] placeholder:text-gray-400 font-medium shadow-sm transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <input
                                type="number"
                                name="weightKg"
                                value={formData.weightKg}
                                onChange={handleChange}
                                placeholder="Enter Weight (Kg)"
                                step="0.1"
                                className="w-full bg-white border border-gray-200 rounded-[24px] py-4 px-6 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] placeholder:text-gray-400 font-medium shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter a Brief Description of the Animal..."
                            rows="5"
                            className="w-full bg-white border border-gray-200 rounded-[24px] py-6 px-8 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] placeholder:text-gray-400 font-medium shadow-sm transition-all resize-none"
                            required
                        />
                    </div>

                    {/* Radios Group */}
                    <div className="grid md:grid-cols-2 gap-12 pt-4">
                        {/* Adoption Type */}
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-400">Select Adoption Type:</p>
                            <div className="space-y-3">
                                {[
                                    { id: "adoption", label: "Adoption" },
                                    { id: "foster", label: "Foster" },
                                    { id: "sponsor", label: "Sponsor" }
                                ].map(opt => (
                                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input 
                                                type="radio" 
                                                name="type" 
                                                checked={type === opt.id} 
                                                onChange={() => {
                                                    // This is just UI demonstration as per user request to not change logic
                                                    // but we can allow switching if the parent allows it or keep it static
                                                }}
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#011749] transition-all" 
                                            />
                                            <div className="absolute w-2.5 h-2.5 bg-[#011749] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-400 text-right md:text-left">Select Animal Gender</p>
                            <div className="flex gap-8 md:justify-start justify-end">
                                {[
                                    { id: "Male", label: "Male" },
                                    { id: "Female", label: "Female" }
                                ].map(opt => (
                                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                         <div className="relative flex items-center justify-center">
                                            <input 
                                                type="radio" 
                                                name="gender" 
                                                checked={formData.gender === opt.id} 
                                                onChange={() => setFormData(p => ({ ...p, gender: opt.id }))}
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#011749] transition-all" 
                                            />
                                            <div className="absolute w-2.5 h-2.5 bg-[#011749] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🔹 Health Information */}
                <section className="space-y-8">
                    <h2 className="text-[28px] font-bold text-[#011749] mb-8">Health Information</h2>
                    
                    <div className="space-y-6">
                        <input
                            name="healthStatus"
                            value={formData.healthStatus || ""}
                            onChange={handleChange}
                            placeholder="Enter Health Status"
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-[24px] py-4 px-6 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] placeholder:text-gray-400 font-medium shadow-sm transition-all"
                        />

                        <div className="grid md:grid-cols-2 gap-12 pt-2">
                             <div className="space-y-4">
                                <p className="text-sm font-semibold text-gray-400">Has This Animal been Vaccinated?</p>
                                <div className="space-y-3">
                                    {["Yes", "No"].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                type="checkbox"
                                                checked={(opt === "Yes" && formData.isVaccinated) || (opt === "No" && formData.isVaccinated === false)}
                                                onChange={() => setFormData(p => ({ ...p, isVaccinated: opt === "Yes" }))}
                                                className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-0 text-[#011749] cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm font-semibold text-gray-400 text-right md:text-left">Neutered / Spayed?</p>
                                <div className="space-y-3 flex flex-col md:items-start items-end">
                                    {["Yes", "No"].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                type="checkbox"
                                                checked={(opt === "Yes" && formData.isNeutered) || (opt === "No" && formData.isNeutered === false)}
                                                onChange={() => setFormData(p => ({ ...p, isNeutered: opt === "Yes" }))}
                                                className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-0 text-[#011749] cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <textarea
                            name="medicalNotes"
                            value={formData.medicalNotes || ""}
                            onChange={handleChange}
                            placeholder="Medical Notes.."
                            rows="4"
                            className="w-full bg-white border border-gray-200 rounded-[24px] py-6 px-8 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] placeholder:text-gray-400 font-medium shadow-sm transition-all resize-none"
                        />
                    </div>
                </section>

                {/* Foster Specific (Dynamic) */}
                {type === "foster" && (
                     <section className="space-y-8 animate-fadeIn">
                        <h2 className="text-[28px] font-bold text-[#011749] mb-8">Foster Program Details</h2>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <input
                                type="date"
                                name="fosterStartDate"
                                value={formData.fosterStartDate}
                                onChange={handleChange}
                                placeholder="Foster Start Date"
                                className="w-full bg-white border border-gray-200 rounded-[24px] py-4 px-6 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] font-medium shadow-sm transition-all"
                            />
                            <input
                                type="date"
                                name="fosterEndDate"
                                value={formData.fosterEndDate}
                                onChange={handleChange}
                                placeholder="Foster End Date"
                                className="w-full bg-white border border-gray-200 rounded-[24px] py-4 px-6 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] font-medium shadow-sm transition-all"
                            />
                            <div className="md:col-span-2">
                                <textarea
                                    name="fosterNotes"
                                    value={formData.fosterNotes}
                                    onChange={handleChange}
                                    placeholder="Special foster notes or requirements..."
                                    rows="3"
                                    className="w-full bg-white border border-gray-200 rounded-[24px] py-6 px-8 focus:ring-1 focus:ring-[#011749] outline-none text-[#011749] font-medium shadow-sm transition-all resize-none"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer p-2">
                                <input 
                                    type="checkbox"
                                    name="isUrgent"
                                    checked={formData.isUrgent}
                                    onChange={handleChange}
                                    className="w-5 h-5 border-2 border-gray-300 rounded text-red-500 focus:ring-red-200"
                                />
                                <span className="text-sm font-bold text-red-600 uppercase tracking-widest">Mark as Urgent</span>
                            </label>
                        </div>
                    </section>
                )}

                {/* Personality Levels (Modernized) */}
                <section className="space-y-10 pt-4">
                    <h2 className="text-[28px] font-bold text-[#011749]">Personality & Training</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <LevelSelector label="Animals Friendly" name="animalsFriendlyLevel" value={formData.animalsFriendlyLevel} />
                        <LevelSelector label="Children Friendly" name="childrenFriendlyLevel" value={formData.childrenFriendlyLevel} />
                        <LevelSelector label="House Trained" name="houseTrainedLevel" value={formData.houseTrainedLevel} />
                    </div>
                </section>

                {/* Save Button Container */}
                <div className="pt-10 flex justify-center">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#011749] text-white px-24 py-4 rounded-[16px] font-bold shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all text-sm uppercase tracking-[2px]"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnimalForm;
