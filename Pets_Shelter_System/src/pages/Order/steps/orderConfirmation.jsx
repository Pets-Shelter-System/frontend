import { useContext, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { CheckoutContext } from "../../../components/context/CheckoutContext";
import { AuthContext } from "../../../components/context/AuthContext";
import { CartContext } from "../../../components/context/CartContext";
import Swal from "sweetalert2";
import axios from "axios";

const baseUrl = "http://petmarket.runasp.net/api";

const OrderConfirmation = ({ prevStep }) => {
    const { cartItems } = useContext(CartContext);

    const {
        createOrder,
        address,
        paymentSummary,
        shipping,
        createPaymentIntent
    } = useContext(CheckoutContext);

    const { user, token } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [orderTotal, setOrderTotal] = useState(null);

    const handlePay = async () => {
        setLoading(true);

        try {
            // STEP 1: Create PaymentIntent (still needed for backend flow)
            const paymentData = await createPaymentIntent();

            // STEP 2: Update Cart with clientSecret + delivery
            await axios.post(
                `${baseUrl}/Cart`,
                {
                    id: user.email,
                    items: cartItems,
                    deliveryMethodId: shipping.id,
                    clientSecret: paymentData.clientSecret,
                    paymentIntentId: paymentData.paymentIntentId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // STEP 3: Create order
            const orderData = await createOrder();
            const createdOrder = orderData.data;
            const orderId = createdOrder.id;

            setOrderTotal(createdOrder.total);

            // STEP 4: Just redirect (NO STRIPE CONFIRM)
            window.location.href = `/order/thank-you`;

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Order Failed",
                text: "Something went wrong while creating order"
            });
        }

        setLoading(false);
    };

    return (
        <div className="rounded-[10px] border shadow-sm bg-white p-8 w-full max-w-[650px] font-[Poppins]">
            <CheckoutSteps current={4} />

            {/* INFO */}
            <div className="space-y-4 mb-6">
                <h3 className="font-bold text-[#011749] text-sm">Billing and delivery information</h3>

                <div className="text-[13px] text-[#222]">
                    <span className="font-semibold">Shipping address</span>
                    <p className="text-gray-500">
                        {address.name}, {address.line1}, {address.city}, {address.country}
                    </p>
                </div>

                <div className="text-[13px] text-[#222]">
                    <span className="font-semibold">Payment details</span>
                    <p className="text-gray-500 uppercase">
                        {paymentSummary.brand} **** {paymentSummary.last4}, Exp: {paymentSummary.expMonth}/{paymentSummary.expYear}
                    </p>
                </div>
            </div>

            {/* CART ITEMS */}
            <div className="space-y-3">
                {cartItems.map(item => (
                    <div key={item.productId} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <img
                                src={item.pictureUrls?.[0] ? `http://petmarket.runasp.net${item.pictureUrls[0]}` : "/placeholder.png"}
                                className="w-14 h-14 rounded-md border"
                            />
                            <span className="font-semibold text-sm text-[#011749]">
                                {item.productName}
                            </span>
                        </div>
                        <div className="flex gap-10 items-center text-sm font-semibold">
                            <span className="text-gray-600">x{item.quantity}</span>
                            <span className="text-[#011749]">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prevStep}
                    className="border px-4 py-2 rounded-lg text-[#011749] font-semibold"
                >
                    Back
                </button>

                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="bg-[#011749] px-6 py-2 rounded-lg text-white font-semibold"
                >
                    {loading
                        ? "Processing..."
                        : orderTotal !== null
                            ? `Continue $${orderTotal.toFixed(2)}`
                            : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
