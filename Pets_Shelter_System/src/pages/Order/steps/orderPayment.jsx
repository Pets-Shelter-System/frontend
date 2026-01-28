import { useState, useContext } from "react";
import { CheckoutContext } from "../../../components/context/CheckoutContext";
import CheckoutSteps from "../components/CheckoutSteps";

const OrderPayment = ({ nextStep, prevStep }) => {
    const { setPaymentSummary } = useContext(CheckoutContext);

    const [form, setForm] = useState({
        cardNumber: "",
        exp: "",
        cvc: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        // يمنع الحروف
        if (name !== "exp" && /\D/.test(value)) return;

        setForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        let newErr = {};

        if (!form.cardNumber.trim() || form.cardNumber.length < 12)
            newErr.cardNumber = "Invalid card number";

        if (!form.exp.trim() || !/^\d{2}\/\d{2}$/.test(form.exp))
            newErr.exp = "MM/YY format required";

        if (!form.cvc.trim() || form.cvc.length < 3)
            newErr.cvc = "Invalid CVC";

        setErrors(newErr);

        return Object.keys(newErr).length === 0;
    };

    const handleNext = () => {
        if (!validate()) return;

        const [expMonth, expYear] = form.exp.split("/");

        const summary = {
            brand: "Visa",
            last4: form.cardNumber.slice(-4),
            expMonth,
            expYear
        };

        setPaymentSummary(summary);
        nextStep();
    };

    return (
        <div className="rounded-[10px] border shadow-sm bg-white p-8 w-full max-w-[650px] font-[Poppins]">
            <CheckoutSteps current={3} />

            <form className="space-y-6 mt-6">
                {/* Card Number */}
                <div>
                    <label className="text-sm font-semibold text-[#011749]">Card Number</label>
                    <input
                        name="cardNumber"
                        maxLength={16}
                        value={form.cardNumber}
                        onChange={handleChange}
                        className={`mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm border 
                            ${errors.cardNumber ? "border-red-500" : "border-transparent"}`}
                        autoComplete="off"
                    />
                    {errors.cardNumber && (
                        <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                    )}
                </div>

                {/* Expiration + CVC */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-[#011749]">Expiration</label>
                        <input
                            name="exp"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={form.exp}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm border 
                                ${errors.exp ? "border-red-500" : "border-transparent"}`}
                            autoComplete="off"
                        />
                        {errors.exp && (
                            <p className="text-xs text-red-500 mt-1">{errors.exp}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#011749]">CVC</label>
                        <input
                            name="cvc"
                            maxLength={4}
                            value={form.cvc}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm border 
                                ${errors.cvc ? "border-red-500" : "border-transparent"}`}
                            autoComplete="off"
                        />
                        {errors.cvc && (
                            <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>
                        )}
                    </div>
                </div>
            </form>

            {/* BUTTONS */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prevStep}
                    className="border px-4 py-2 rounded-lg text-[#011749] font-semibold"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="bg-[#011749] px-6 py-2 rounded-lg text-white font-semibold"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderPayment;
