import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/context/AuthContext";

const baseUrl = "http://petmarket.runasp.net/api";

export default function ThankYou() {
    const { token } = useContext(AuthContext);
    const orderId = new URLSearchParams(window.location.search).get("orderId");

    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            const res = await axios.get(`${baseUrl}/Orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(res.data.data);
        };

        fetchOrder();
    }, [orderId, token]);

    if (!order) return <div className="text-center py-10">Loading...</div>;

    const { orderDate, paymentSummary, shippingAddress, total } = order;

    return (
        <div className="flex flex-col items-center py-16 font-[Poppins]">

            {/* Paw Image */}
            <img src="/paw.svg" className="w-[260px] mb-8" />

            <h1 className="text-2xl font-semibold text-[#011749] mb-1">
                Thanks For Your Order
            </h1>

            <p className="text-sm text-gray-500 mb-6">
                Order #{orderId}
            </p>

            <div className="border rounded-2xl p-6 w-[450px] bg-white shadow-sm">

                {/* Date */}
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium">{new Date(orderDate).toLocaleString()}</span>
                </div>

                {/* Payment */}
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Payment method</span>
                    <span className="font-medium uppercase">
                        {paymentSummary.brand} **** {paymentSummary.last4}, Exp: {paymentSummary.expMonth}/{paymentSummary.expYear}
                    </span>
                </div>

                {/* Address */}
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-right">
                        {shippingAddress.name}, {shippingAddress.line1}, {shippingAddress.city}, {shippingAddress.country}
                    </span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-sm mt-4">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-semibold text-[#011749]">${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <a href="/shop"
                    className="border px-6 py-2 rounded-lg text-[#011749] font-medium">
                    Continue Shopping
                </a>

                <a href={`/orders/${orderId}`}
                    className="bg-[#011749] text-white px-6 py-2 rounded-lg font-medium">
                    View Your Order
                </a>
            </div>
        </div>
    );
}
