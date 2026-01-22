const OrderSummary = () => {
    return (
        <div className="w-[300px] bg-white border shadow-sm rounded-[10px] p-5 font-[Poppins]">
            <h3 className="text-[#011749] font-semibold mb-3">Order Summary</h3>

            <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">$00.00</span>
            </div>

            <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Discount</span>
                <span className="text-[#E7A01C] font-semibold">$00.00</span>
            </div>

            <div className="flex justify-between text-sm text-gray-700 pb-3 mb-2 border-b">
                <span>Delivery fee</span>
                <span className="font-semibold">$00.00</span>
            </div>

            <div className="flex justify-between text-[#011749] font-bold text-base">
                <span>Total</span>
                <span>$00.00</span>
            </div>
        </div>
    );
};

export default OrderSummary;
