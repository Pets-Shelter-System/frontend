import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import { getOrderById } from "../services/orderService";
import OrderStatus from "../components/OrderStatus";
import OrderItem from "../components/OrderItem";
import {
    IoArrowBackOutline,
    IoLocationOutline,
    IoCardOutline,
    IoAirplaneOutline,
    IoReceiptOutline
} from "react-icons/io5";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useContext(AuthContext);

    const [order, setOrder] = useState(location.state?.order || null);
    const [loading, setLoading] = useState(!location.state?.order);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token || order) return;
            setLoading(true);
            try {
                const data = await getOrderById(id, token);
                setOrder(data.data || data);
            } catch (err) {
                console.error("Failed to fetch order details", err);
                setError("Failed to load order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, token, order]);

    if (loading) {
        return (
            <div className="bg-[#F6F7F9] min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <p className="text-[#011749] font-bold">Loading Order Details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="bg-[#F6F7F9] min-h-screen flex flex-col items-center justify-center p-4 gap-6">
                <div className="text-red-500 font-bold text-xl">{error || "Order not found"}</div>
                <button
                    onClick={() => navigate("/profile/orders")}
                    className="bg-[#011749] text-white px-8 py-3 rounded-xl font-bold"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="bg-[#F6F7F9] min-h-screen pt-8 pb-12">
            <div className="max-w-[1000px] mx-auto px-4 space-y-8">

                {/* Header */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate("/profile/orders")}
                            className="p-3 bg-[#F6F7F9] rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            <IoArrowBackOutline size={24} className="text-[#011749]" />
                        </button>
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-[#011749]">Order Details</h1>
                                <OrderStatus status={order.status} />
                            </div>
                            <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                                <IoReceiptOutline /> Order ID: #{order.id}
                            </p>
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Placed</p>
                        <p className="text-[#011749] font-medium">{formatDate(order.orderDate)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Products Section */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                            <h3 className="text-xl font-bold text-[#011749] flex items-center gap-2 border-b border-gray-50 pb-6">
                                Items in this Order
                            </h3>
                            <div className="space-y-4">
                                {order.orderItems?.map((item, idx) => (
                                    <OrderItem key={idx} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Shipping & Payment Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Shipping Information */}
                            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6">
                                <h3 className="font-bold text-[#011749] flex items-center gap-2 border-b border-gray-50 pb-4 uppercase text-xs tracking-widest">
                                    <IoLocationOutline className="text-[#E7A01C] text-lg" /> Shipping Information
                                </h3>
                                {order.shippingAddress ? (
                                    <div className="space-y-3">
                                        <p className="text-[#011749] font-bold">{order.shippingAddress.name}</p>
                                        <div className="text-sm text-gray-500 space-y-1">
                                            {order.shippingAddress.line1 && <p>{order.shippingAddress.line1}</p>}
                                            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                            <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}</p>
                                            <p>{order.shippingAddress.postalCode} {order.shippingAddress.country}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No shipping address provided.</p>
                                )}
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6">
                                <h3 className="font-bold text-[#011749] flex items-center gap-2 border-b border-gray-50 pb-4 uppercase text-xs tracking-widest">
                                    <IoCardOutline className="text-[#E7A01C] text-lg" /> Payment Summary
                                </h3>
                                {order.paymentSummary ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <IoCardOutline className="text-[#011749]" />
                                            </div>
                                            <div>
                                                <p className="text-[#011749] font-bold">{order.paymentSummary.brand}</p>
                                                <p className="text-gray-500 text-sm">Ending in {order.paymentSummary.last4}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expires</p>
                                                <p className="text-sm font-medium text-[#011749]">
                                                    {order.paymentSummary.expMonth.toString().padStart(2, '0')}/{order.paymentSummary.expYear}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No payment information available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Totals Column */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* Delivery Method */}
                        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6">
                            <h3 className="font-bold text-[#011749] flex items-center gap-2 border-b border-gray-50 pb-4 uppercase text-xs tracking-widest">
                                <IoAirplaneOutline className="text-[#E7A01C] text-lg" /> Delivery
                            </h3>
                            <div className="space-y-4 text-center">
                                <div className="bg-[#F6F7F9] p-4 rounded-2xl">
                                    <p className="font-bold text-[#011749] text-lg">{order.deliveryMethod || "Standard Delivery"}</p>
                                    <p className="text-gray-400 text-xs mt-1">Delivery Charge: EGP {order.shippingPrice?.toFixed(2) || "0.00"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-[#011749] rounded-[32px] p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
                            <h3 className="text-lg font-bold border-b border-white/10 pb-4 relative z-10">Order Summary</h3>

                            <div className="space-y-4 relative z-10 text-sm">
                                <div className="flex justify-between text-white/70">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-white">EGP {order.subtotal?.toFixed(2) || (order.total - (order.shippingPrice || 0))?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Shipping</span>
                                    <span className="font-bold text-white">EGP {order.shippingPrice?.toFixed(2) || "0.00"}</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="text-2xl font-bold text-[#E7A01C]">EGP {order.total?.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Decorative backgrounds */}
                            <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-white/5 rounded-full blur-xl" />
                            <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-[#E7A01C]/10 rounded-full blur-xl" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
