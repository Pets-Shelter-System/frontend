const OrderConfirmation = ({ prevStep, cartItems = [], totalPrice = 0 }) => {

    return (
        <div className="rounded-[10px] border shadow-sm bg-white p-8 w-full max-w-[650px]">

            {/* STEPS */}
            <div className="flex items-center justify-between mb-10 px-2">

                {["Address", "Shipping", "Payment", "Confirmation"].map((label, i) => {
                    const idx = i + 1;
                    const active = idx === 4;
                    const done = idx < 4;

                    return (
                        <>
                            <div key={label} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
                                    ${done ? "bg-[#E7A01C] text-white"
                                        : active ? "border-2 border-gray-400 text-gray-500"
                                            : "bg-gray-300 text-white"}`}>
                                    {done ? "✔" : idx}
                                </div>
                                <span className={`text-sm mt-2 font-semibold
                                    ${active ? "text-[#011749]" : "text-[#011749]"}`}>
                                    {label}
                                </span>
                            </div>

                            {idx !== 4 && <div className="flex-1 h-[2px] bg-gray-200 mx-2"></div>}
                        </>
                    );
                })}
            </div>

            {/* INFO */}
            <div className="space-y-4 mb-6">
                <h3 className="font-bold text-[#011749] text-sm">Billing and delivery information</h3>

                <div className="text-[13px] text-[#222]">
                    <span className="font-semibold">Shipping address</span>
                    <p className="text-gray-500">Bob Bobbity, 100 Centre Street, New York, NY, 10013, US</p>
                </div>

                <div className="text-[13px] text-[#222]">
                    <span className="font-semibold">Payment details</span>
                    <p className="text-gray-500 uppercase">MASTERCARD **** **** 4444, Exp: 12/2025</p>
                </div>
            </div>

            {/* CART ITEMS */}
            <div className="space-y-3">
                {cartItems?.length > 0 ? (
                    cartItems.map(item => (
                        <div key={item.productId} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src={item.pictureUrls?.[0] || "/placeholder.png"}
                                    className="w-14 h-14 rounded-md border"
                                />
                                <span className="font-semibold text-sm text-[#011749]">
                                    {item.productName}
                                </span>
                            </div>
                            <div className="flex gap-10 items-center text-sm font-semibold">
                                <span className="text-gray-600">x{item.quantity}</span>
                                <span className="text-[#011749]">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No items found</p>
                )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prevStep}
                    className="border px-4 py-2 rounded-lg text-[#011749] font-semibold"
                >
                    Back
                </button>

                <button className="bg-[#011749] px-6 py-2 rounded-lg text-white font-semibold">
                    Pay ${totalPrice.toFixed(2)}
                </button>
            </div>

        </div>
    );
};

export default OrderConfirmation;
