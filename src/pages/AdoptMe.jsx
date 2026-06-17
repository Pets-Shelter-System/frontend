import heroImg from "../assets/AdoptionForm.jpg";
import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import Swal from "sweetalert2";

const BASE_URL = "https://petmarket.runasp.net";

const LABLE_FIELD_STYLE = "block text-sm font-medium mb-2";
const INPUR_FIELD_STYLE = "w-full rounded-xl bg-[#F6F7F9] px-4 py-3 shadow-[0_3px_0_0_#E7A01C] outline-none";

const AdoptMe = () => {
    const { id: animalId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        country: "",
        city: "",
        zipCode: "",
        address: "",
        householdDetails: "",
        responsiblePerson: "",
        adoptionReason: "",
        aloneTimeDetails: "",
        livingEnvironment: "",

        dog: false,
        cat: false,
        bird: false,
        lizard: false,
        rabbit: false,
        other: false,

        houseTrained: false,
        declawed: false,
        specialConsiderations: false,
        working: false,
        young: false,
        multiplePets: false,

        accepted: false,
        authorizedInvestigation: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            Swal.fire("Error", "You must be logged in", "error");
            return;
        }

        const requiredFields = [
            "firstName",
            "lastName",
            "phoneNumber",
            "email",
            "country",
            "city",
            "address",
            "householdDetails",
            "responsiblePerson",
            "adoptionReason",
            "aloneTimeDetails",
            "livingEnvironment",
        ];

        const missing = requiredFields.find(
            (field) => !formData[field] || !formData[field].trim()
        );

        if (missing) {
            Swal.fire(
                "Missing Data",
                "Please fill all required fields (Zip Code is optional)",
                "warning"
            );
            return;
        }

        if (!formData.accepted || !formData.authorizedInvestigation) {
            Swal.fire(
                "Agreement Required",
                "You must accept all adoption agreements to proceed",
                "warning"
            );
            return;
        }

        const payload = {
            animalId: Number(animalId),
            ...formData,
        };

        try {
            const res = await fetch(`${BASE_URL}/api/AdoptionApplications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            // استخراج البيانات من الرد
            const result = await res.json();

            if (!res.ok) {
                const errorMessage = result.message || "Something went wrong";
                throw new Error(errorMessage);
            }

            Swal.fire("Success", "Application submitted successfully 🐾", "success").then((result) => {
                if (result.isConfirmed) {
                    navigate('/adoption')
                }
            });
        } catch (err) {
            console.error("Submission Error:", err);
            Swal.fire("Error", err.message, "error");
        }
    };

    useEffect(() => {
        // تعبئة البيانات تلقائياً إذا كان المستخدم مسجل دخوله
        if (user && user.email) {
            setFormData((prev) => ({
                ...prev,
                email: user.email || "",
            }));
        }
    }, [user]);

    return (
        <>
            {/* ========= HERO SECTION ========= */}
            <section className="w-screen h-screen relative">
                <img
                    src={heroImg}
                    alt="Adopt pets"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </section>

            {/* ========= FORM SECTION ========= */}
            <section className="bg-[#F6F7F9] py-20 px-4">
                <div className="max-w-[900px] rounded-lg mx-auto">
                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_0_0_3px_#E7A01C]">
                        {/* Title */}
                        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#011749] mb-10">
                            Adoption Form 🐾
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6 text-[#011749]">
                            {/* Names */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={LABLE_FIELD_STYLE}>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className={INPUR_FIELD_STYLE}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className={LABLE_FIELD_STYLE}>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className={INPUR_FIELD_STYLE}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={LABLE_FIELD_STYLE}>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        className={INPUR_FIELD_STYLE}
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className={LABLE_FIELD_STYLE}>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        readOnly
                                        className={INPUR_FIELD_STYLE}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={LABLE_FIELD_STYLE}>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        className={INPUR_FIELD_STYLE}
                                        value={formData.country}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className={LABLE_FIELD_STYLE}>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className={INPUR_FIELD_STYLE}
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className={LABLE_FIELD_STYLE}>Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        className={INPUR_FIELD_STYLE}
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className={LABLE_FIELD_STYLE}>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className={INPUR_FIELD_STYLE}
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Household Details */}
                            <div>
                                <label className={LABLE_FIELD_STYLE}>
                                    Please state the number of people currently living in the household along with their ages...
                                </label>
                                <textarea
                                    rows="5"
                                    className={INPUR_FIELD_STYLE}
                                    name="householdDetails"
                                    value={formData.householdDetails}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* ========= PET CARE INFORMATION ========= */}
                            <div className="pt-20">
                                <h3 className="text-xl font-bold text-[#011749] mb-6">Pet Care Information 🐾</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className={LABLE_FIELD_STYLE}>Who will be responsible for this pet?</label>
                                        <input
                                            name="responsiblePerson"
                                            className={INPUR_FIELD_STYLE}
                                            value={formData.responsiblePerson}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABLE_FIELD_STYLE}>For what reason are you adopting this pet?</label>
                                        <input
                                            name="adoptionReason"
                                            className={INPUR_FIELD_STYLE}
                                            value={formData.adoptionReason}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABLE_FIELD_STYLE}>Where will this pet be kept when alone, and for how many hours per day?</label>
                                        <textarea
                                            rows="4"
                                            name="aloneTimeDetails"
                                            className={INPUR_FIELD_STYLE}
                                            value={formData.aloneTimeDetails}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABLE_FIELD_STYLE}>Do you have a fenced yard or plan to be indoor-only home?</label>
                                        <textarea
                                            rows="3"
                                            name="livingEnvironment"
                                            className={INPUR_FIELD_STYLE}
                                            value={formData.livingEnvironment}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ========= GENERAL APPLICATION INFORMATION ========= */}
                            <div className="pt-20">
                                <h3 className="text-xl font-bold text-[#011749] mb-6">General Application Information 🐾</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">
                                    {/* Animal Types */}
                                    <div>
                                        <p className="font-medium text-[#E7A01C] mb-4">Animal Type(s) Desired:</p>
                                        <div className="grid grid-cols-2 gap-y-7">
                                            {["dog", "cat", "rabbit", "bird", "lizard", "other"].map((item) => (
                                                <label key={item} className="flex items-center gap-2 capitalize">
                                                    <input
                                                        type="checkbox"
                                                        name={item}
                                                        checked={formData[item]}
                                                        onChange={handleCheckbox}
                                                        className="accent-[#E7A01C]"
                                                    />
                                                    <span>{item}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Willing to Adopt */}
                                    <div>
                                        <p className="font-medium text-[#E7A01C] mb-4">Willing to Adopt:</p>
                                        <div className="grid grid-cols-2 gap-y-7">
                                            {[
                                                { label: "House-trained", name: "houseTrained" },
                                                { label: "Working", name: "working" },
                                                { label: "Declawed", name: "declawed" },
                                                { label: "Young", name: "young" },
                                                { label: "Special-Considerations", name: "specialConsiderations" },
                                                { label: "Multiple Pets", name: "multiplePets" },
                                            ].map((item) => (
                                                <label key={item.name} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        name={item.name}
                                                        checked={formData[item.name]}
                                                        onChange={handleCheckbox}
                                                        className="accent-[#E7A01C]"
                                                    />
                                                    <span>{item.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ========= AGREEMENT ========= */}
                            <div className="pt-20 space-y-7 text-sm">
                                <h3 className="text-xl font-bold text-[#011749] mb-4">Adoption Paperwork Agreement 🐾</h3>

                                {/* الاتفاقية الأولى */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="accepted"
                                        checked={formData.accepted}
                                        onChange={handleCheckbox}
                                        className="mt-1 accent-[#E7A01C] w-4 h-4"
                                    />
                                    <span>
                                        I understand that filling out application doesn't guarantee me the right
                                        to adopt this pet or any other, and that answering further questions may
                                        be necessary. Paw Partner has the final say on any adoption.
                                    </span>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="authorizedInvestigation"
                                        checked={formData.authorizedInvestigation}
                                        onChange={handleCheckbox}
                                        className="mt-1 accent-[#E7A01C] w-4 h-4"
                                    />
                                    <span>
                                        I understand the above question and authorized investigation of all
                                        statements contained in this application. I understand misrepresentation
                                        of facts or omission of facts is cause for denial of adoption.
                                    </span>
                                </label>
                            </div>

                            {/* Button */}
                            <div className="pt-12 text-center">
                                <button
                                    type="submit"
                                    className="bg-[#011749] text-white px-12 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdoptMe;