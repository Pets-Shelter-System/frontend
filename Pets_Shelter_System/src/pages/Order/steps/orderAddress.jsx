const OrderAddress = ({ nextStep }) => {
    return (
        <div className="flex justify-center w-full">

            <div className="rounded-[10px] border shadow-sm bg-white p-8 w-full max-w-[850px] font-[Poppins]">

                {/* Steps */}
                <div className="flex items-center justify-between mb-10 px-2 relative">
                    {/* 1 */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#E7A01C] text-white flex items-center justify-center font-semibold">1</div>
                        <span className="text-sm mt-2 text-[#011749] font-semibold">Address</span>
                    </div>

                    <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>

                    {/* 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">2</div>
                        <span className="text-sm mt-2 text-gray-500">Shipping</span>
                    </div>

                    <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>

                    {/* 3 */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">3</div>
                        <span className="text-sm mt-2 text-gray-500">Payment</span>
                    </div>

                    <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>

                    {/* 4 */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">4</div>
                        <span className="text-sm mt-2 text-gray-500">Confirmation</span>
                    </div>
                </div>

                {/* Form */}
                <form className="grid grid-cols-1 gap-4 mt-4">

                    <div>
                        <label className="text-sm font-semibold text-[#011749]">Full Name</label>
                        <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#011749]">Country or region</label>
                        <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#011749]">Address Line 1</label>
                        <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#011749]">Address Line 2</label>
                        <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#011749]">City</label>
                        <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-[#011749]">State</label>
                            <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-[#011749]">Zip</label>
                            <input className="mt-1 w-full rounded-[8px] bg-gray-100 p-3 text-sm" />
                        </div>
                    </div>
                </form>

                {/* Buttons */}
                <div className="flex justify-between mt-8">
                    <button className="border px-4 py-2 rounded-lg text-[#011749] font-semibold">
                        Continue Shopping
                    </button>
                    <button onClick={nextStep} className="bg-[#011749] px-6 py-2 rounded-lg text-white font-semibold">
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderAddress;
