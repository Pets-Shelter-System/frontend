const OrderPayment = ({ nextStep, prevStep }) => {
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
                    <div className="w-8 h-8 rounded-full bg-[#E7A01C] text-white flex items-center justify-center font-semibold">✔</div>
                    <span className="text-sm mt-2 text-[#011749] font-semibold">Shipping</span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>

                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#E7A01C] text-white flex items-center justify-center font-semibold">3</div>
                    <span className="text-sm mt-2 text-[#011749] font-semibold">Payment</span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>

                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-400 text-gray-400 flex items-center justify-center font-semibold">4</div>
                    <span className="text-sm mt-2 text-gray-500">Confirmation</span>
                </div>
            </div>

            {/* FORM */}
            <form className="space-y-6">

                <div>
                    <label className="text-sm font-semibold text-[#011749]">Card Number</label>
                    <div className="relative">
                        <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm pr-10" />
                        <span className="absolute right-3 top-3 opacity-60">💳</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-[#011749]">Expiration</label>
                        <div className="relative">
                            <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm pr-8" />
                            <span className="absolute right-3 top-3 opacity-60">📅</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#011749]">CVC</label>
                        <div className="relative">
                            <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm pr-8" />
                            <span className="absolute right-3 top-3 opacity-60">➕</span>
                        </div>
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
                    onClick={nextStep}
                    className="bg-[#011749] px-6 py-2 rounded-lg text-white font-semibold"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderPayment;
