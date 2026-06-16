import { useContext, useMemo } from "react";
import { CartContext } from "../../../components/context/CartContext";
import { CheckoutContext } from "../../../components/context/CheckoutContext";

const OrderSummary = () => {
    const { cartItems } = useContext(CartContext);
    const { shipping } = useContext(CheckoutContext);

    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }, [cartItems]);

    const deliveryFee = shipping?.price || 0;
    const discount = 0; // لو هتضيفها بعدين خليني أجهز لها

    const total = subtotal + deliveryFee - discount;

    return (
        <div className="w-[300px] bg-white border shadow-sm rounded-[10px] p-5 font-[Poppins]">

            <h3 className="text-[#011749] font-semibold mb-3">Order Summary</h3>

            <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Discount</span>
                <span className="text-[#E7A01C] font-semibold">-${discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-700 pb-3 mb-2 border-b">
                <span>Delivery fee</span>
                <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[#011749] font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default OrderSummary;
