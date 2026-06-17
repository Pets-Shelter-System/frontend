import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import { getOrders } from "../services/orderService";
import OrderRow from "../components/OrderRow";
import { IoArrowBackOutline, IoCartOutline, IoBagHandleOutline } from "react-icons/io5";
import fosterImg from "../assets/foster1.png";

const UserOrders = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const data = await getOrders(token);
                // The API response is expected to be data[] directly or { data: [] }
                setOrders(data.data || data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setError("Failed to load your order history.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    return (
        <div className="bg-[#F6F7F9] min-h-screen pt-8 pb-12">
            <div className="max-w-[1000px] mx-auto px-4 space-y-8">

                {/* Header Section */}
                <div className="bg-[#011749] rounded-[32px] p-6 md:p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                    <div className="relative z-10 space-y-4 text-center md:text-left">
                        <button
                            onClick={() => navigate("/profile")}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors inline-block md:static absolute top-[-10px] left-[-10px]"
                        >
                            <IoArrowBackOutline size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Order History</h1>
                            <p className="text-white/70 text-sm md:text-base mt-2">
                                Review your previous orders and purchases.
                            </p>
                        </div>
                    </div>

                    <div className="w-48 md:w-64 relative z-10 shrink-0">
                        <img
                            src={fosterImg}
                            alt="Orders Header"
                            className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-50px] left-[-30px] w-48 h-48 bg-[#E7A01C]/10 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Orders Table/List */}
                <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 min-h-[400px]">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-10 bg-gray-50 rounded-full animate-pulse" />
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center text-red-500 font-bold">{error}</div>
                    ) : orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="hidden md:table-header-group">
                                    <tr className="text-left border-b border-gray-50">
                                        <th className="pb-4 pl-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Items</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="pb-4 pr-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-4 md:space-y-0">
                                    {orders.map((order) => (
                                        <OrderRow key={order.id} order={order} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="py-20 flex flex-col items-center text-center space-y-6">
                            <div className="bg-gray-50 p-8 rounded-full text-gray-300">
                                <IoBagHandleOutline size={64} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-[#011749]">No Orders Yet</h3>
                                <p className="text-gray-400 text-sm max-w-[300px] mx-auto">
                                    Your order history will appear here once you make your first purchase.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/shop")}
                                className="bg-[#011749] text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-[#011749]/90 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <IoCartOutline size={20} />
                                Browse Shop
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserOrders;
