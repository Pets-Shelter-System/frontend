import { useEffect, useState, useContext } from "react";
import axios from "axios";
import CheckoutSteps from "../components/CheckoutSteps";
import Swal from "sweetalert2";
import { CheckoutContext } from "../../../components/context/CheckoutContext";
import { AuthContext } from "../../../components/context/AuthContext";
import { CartContext } from "../../../components/context/CartContext";

const baseUrl = "http://petmarket.runasp.net/api";

const OrderShipping = ({ nextStep, prevStep }) => {
    const { setShipping } = useContext(CheckoutContext);
    const { token, user } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);

    const [methods, setMethods] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const res = await axios.get(`${baseUrl}/Payments/delivery-methods`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMethods(res.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("You must be logged in to view shipping methods");
                } else {
                    setError("Failed to load delivery methods");
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchMethods();
        else {
            setError("Please login first");
            setLoading(false);
        }
    }, [token]);

    const handleNext = async () => {
        if (!selected) {
            Swal.fire({
                icon: "warning",
                title: "Select Shipping Method",
                text: "Please choose a shipping method before proceeding",
                confirmButtonColor: "#011749",
            });
            return;
        }

        try {
            setShipping(selected);

            // ---- POST UPDATED CART WITH DELIVERY ----
            const body = {
                id: user.email,
                items: cartItems,
                deliveryMethodId: selected.id
            };

            await axios.post(`${baseUrl}/Cart`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            nextStep();

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Cart Update Failed",
                text: "Failed to apply shipping method",
                confirmButtonColor: "#011749",
            });
        }
    };

    return (
        <div className="rounded-[10px] border shadow-sm bg-white p-8 w-full max-w-[650px] font-[Poppins]">

            <CheckoutSteps current={2} />

            {loading && <p className="text-center text-gray-500">Loading shipping methods...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {methods.map(opt => (
                        <label
                            key={opt.id}
                            className={`border rounded-lg p-4 flex gap-3 items-start cursor-pointer transition
                                ${selected?.id === opt.id ? "border-[#011749] bg-gray-50" : "hover:border-[#011749]"}`}
                        >
                            <input
                                type="radio"
                                name="shipping"
                                checked={selected?.id === opt.id}
                                onChange={() => setSelected(opt)}
                                className="mt-1 w-4 h-4"
                            />
                            <div>
                                <p className="font-semibold text-[#011749]">
                                    {opt.shortName} — ${opt.price.toFixed(2)}
                                </p>
                                <p className="text-gray-500 text-sm">{opt.description}</p>
                                <p className="text-xs text-gray-400 mt-1">{opt.deliveryTime}</p>
                            </div>
                        </label>
                    ))}
                </div>
            )}

            <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="border px-4 py-2 rounded-lg text-[#011749] font-semibold">
                    Back
                </button>
                <button onClick={handleNext} className="bg-[#011749] px-6 py-2 rounded-lg text-white font-semibold">
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderShipping;
