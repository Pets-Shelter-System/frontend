import { createContext, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CheckoutContext = createContext();

const baseUrl = "http://petmarket.runasp.net/api";

export default function CheckoutProvider({ children }) {
    const { token, user } = useContext(AuthContext);

    const [paymentData, setPaymentData] = useState(null);
    const [shipping, setShipping] = useState(null);
    const [address, setAddress] = useState(null);
    const [paymentSummary, setPaymentSummary] = useState(null);

    // ---- CREATE PAYMENT INTENT ----
    const createPaymentIntent = async () => {
        if (!user?.email) return;

        const res = await axios.post(
            `${baseUrl}/Payments/${user.email}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        // res.data = { id, items, clientSecret, paymentIntentId }
        console.log("✅ PaymentIntent Response:", res.data);

        setPaymentData(res.data);
        return res.data;
    };

    // ---- CREATE ORDER ----
    const createOrder = async () => {
        const body = {
            cartId: user.email,
            deliveryMethodId: shipping?.id,
            shippingAddress: address,
            paymentSummary,
        };

        const res = await axios.post(`${baseUrl}/Orders`, body, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;
    };

    return (
        <CheckoutContext.Provider
            value={{
                paymentData,
                createPaymentIntent,
                shipping,
                setShipping,
                address,
                setAddress,
                paymentSummary,
                setPaymentSummary,
                createOrder,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}
