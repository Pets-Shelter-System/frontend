import { useState } from "react";
import OrderAddress from "./steps/OrderAddress";
import OrderSummary from './components/OrderSummary';
import OrderShipping from "./steps/OrderShipping";
import OrderPayment from "./steps/OrderPayment";
import OrderConfirmation from "./steps/OrderConfirmation";

const Order = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="pt-[110px] pb-10 min-h-screen bg-[#F7F7F7] font-poppins">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* STEPS */}
                <div className="lg:col-span-2 flex justify-center">
                    {step === 1 && <OrderAddress nextStep={nextStep} />}
                    {step === 2 && <OrderShipping nextStep={nextStep} prevStep={prevStep} />}
                    {step === 3 && <OrderPayment nextStep={nextStep} prevStep={prevStep} />}
                    {step === 4 && <OrderConfirmation prevStep={prevStep} />}
                </div>

                {/* SUMMARY */}
                <div className="space-y-4">
                    <OrderSummary />
                </div>

            </div>
        </div>
    );
};

export default Order;
