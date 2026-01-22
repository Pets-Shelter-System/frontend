const OrderShipping = ({ nextStep, prevStep }) => {

    const shippingOptions = [
        { id: 1, title: "UPS1 - $10.00", subtitle: "Fastest delivery time" },
        { id: 2, title: "UPS2 - $5.00", subtitle: "Get it within 5 days" },
        { id: 3, title: "UPS3 - $2.00", subtitle: "Slower but cheap" },
        { id: 4, title: "UPS4 - $0.00", subtitle: "Free! You get what you pay for" },
    ];

    return (
        <div className="rounded-[10px] border shadow-sm bg-white p-8 w-full max-w-[650px]">

            {/* STEP HEADER */}
            <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#E7A01C] text-white flex items-center justify-center font-semibold">✔</div>
                    <span className="text-sm mt-2 text-[#011749] font-semibold">Address</span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>

                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#E7A01C] text-white flex items-center justify-center font-semibold">2</div>
                    <span className="text-sm mt-2 text-[#011749] font-semibold">Shipping</span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>

                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">3</div>
                    <span className="text-sm mt-2 text-gray-500">Payment</span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>

                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-400 text-gray-400 flex items-center justify-center font-semibold">4</div>
                    <span className="text-sm mt-2 text-gray-500">Confirmation</span>
                </div>
            </div>

            {/* OPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shippingOptions.map(opt => (
                    <label key={opt.id} className="border rounded-lg p-4 flex gap-3 items-start cursor-pointer hover:border-[#011749] transition">
                        <input type="radio" name="shipping" className="mt-1 w-4 h-4" />
                        <div>
                            <p className="font-semibold text-[#011749]">{opt.title}</p>
                            <p className="text-gray-500 text-sm">{opt.subtitle}</p>
                        </div>
                    </label>
                ))}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="border px-4 py-2 rounded-lg text-[#011749] font-semibold">
                    Back
                </button>
                <button onClick={nextStep} className="bg-[#011749] px-6 py-2 rounded-lg text-white font-semibold">
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderShipping;
