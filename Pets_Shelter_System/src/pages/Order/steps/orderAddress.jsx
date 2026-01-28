import CheckoutSteps from "../components/CheckoutSteps";
import { useState, useContext } from "react";
import { CheckoutContext } from "../../../components/context/CheckoutContext";

const OrderAddress = ({ nextStep }) => {
    const { setAddress } = useContext(CheckoutContext);

    const [form, setForm] = useState({
        name: "",
        country: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: ""
    });

    const [errors, setErrors] = useState({});
    const requiredFields = ["name", "country", "line1", "city"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (requiredFields.includes(name) && !value.trim()) {
            setErrors(prev => ({ ...prev, [name]: "This field is required" }));
        }
    };

    const handleNext = () => {
        let newErrors = {};
        requiredFields.forEach(field => {
            if (!form[field].trim()) newErrors[field] = "This field is required";
        });
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        setAddress(form);
        nextStep();
    };

    const renderInput = (label, name, required = false) => (
        <div>
            <label className="text-sm font-semibold text-[#011749]">
                {label} {required && "*"}
            </label>
            <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm border 
          ${errors[name] ? "border-red-500" : "border-transparent"}`}
            />
            {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <div className="flex justify-center w-full">
            <div className="rounded-[10px] border shadow-sm bg-white p-8 w-full max-w-[850px] font-[Poppins]">

                <CheckoutSteps current={1} />

                <form className="grid grid-cols-1 gap-4 mt-4">
                    {renderInput("Full Name", "name", true)}
                    {renderInput("Country", "country", true)}
                    {renderInput("Address Line 1", "line1", true)}
                    {renderInput("Address Line 2", "line2")}
                    {renderInput("City", "city", true)}
                    <div className="grid grid-cols-2 gap-4">
                        {renderInput("State", "state")}
                        {renderInput("Zip", "postalCode")}
                    </div>
                </form>

                <div className="flex justify-between mt-8">
                    <button className="border px-4 py-2 rounded-lg text-[#011749] font-semibold">
                        Continue Shopping
                    </button>
                    <button onClick={handleNext} className="bg-[#011749] px-6 py-2 rounded-lg text-white font-semibold">
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderAddress;
