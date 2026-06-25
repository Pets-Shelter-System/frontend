import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineUser, HiOutlineTruck, HiOutlineCreditCard } from "react-icons/hi";
import Spinner from "../../components/Spinner";
import { toast } from "react-hot-toast";

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const getStatusStyle = (status) => {
        switch (status) {
            case "PaymentReceived": return "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]";
            case "Shipped": return "bg-blue-50 text-blue-600 border-blue-100";
            case "Pending": return "bg-gray-50 text-gray-600 border-gray-100";
            case "PaymentMismatch": return "bg-red-50 text-red-600 border-red-100";
            case "Delivered": return "bg-green-50 text-green-600 border-green-100";
            case "Shipped": return "bg-blue-50 text-[#2563EB] border-blue-200";
            case "PaymentFailed": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`https://petmarket.runasp.net/api/Admin/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(res.data?.data || res.data);
        } catch (err) {
            console.error("Fetch Order Details Error:", err);
            toast.error("Could not load order details");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await axios.put(`https://petmarket.runasp.net/api/Admin/orders/${id}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Order status updated!");
            fetchOrder();
        } catch (err) {
            console.error("Update Status Error:", err);
            toast.error("Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id, token]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

    return (
        <div className="max-w-[1000px] mx-auto animate-fadeIn pb-20">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <button 
                      onClick={() => navigate("/admin/orders")}
                      className="flex items-center gap-2 text-xs font-bold text-[#6F84AE] uppercase tracking-wider mb-2 hover:text-[#011749]"
                    >
                      <IoIosArrowBack /> Back to Orders
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-extrabold text-[#011749]">Order #{order.id}</h1>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                            <span className={`w-2 h-2 rounded-full shadow-md ${
                                order.status === "Pending" ? "bg-[#F59E0B] shadow-[#F59E0B99]" :
                                order.status === "PaymentReceived" ? "bg-[#2563EB] shadow-[#2563EB66]" :
                                order.status === "Shipped" ? "bg-[#2563EB] shadow-[#2563EB66]" :
                                order.status === "Delivered" ? "bg-[#10B981] shadow-[#10B98199]" :
                                "bg-[#BA1A1A] shadow-[#BA1A1A99]"
                            }`} />
                            {order.status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                    </div>
                    <p className="text-gray-400 mt-1">Placed on {new Date(order.orderDate).toLocaleString()}</p>
                </div>

                <div className="relative group">
                    <button 
                        disabled={updatingStatus}
                        className="bg-[#011749] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#022572] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {updatingStatus ? "Updating..." : "Update Status"}
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-[200px] bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50 overflow-hidden">
                        {["Pending", "PaymentReceived", "PaymentFailed", "Shipped", "Delivered"].map(status => (
                            <button
                                key={status}
                                onClick={() => updateStatus(status)}
                                className="w-full text-left px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                                {status.replace(/([A-Z])/g, ' $1').trim()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <HiOutlineUser size={20} />
                        </div>
                        <h3 className="font-bold text-[#011749]">Customer</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 bg-[#F6F7F9] rounded-xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#011749] text-white rounded-full flex items-center justify-center font-bold text-xs">ME</div>
                            <div>
                                <p className="text-sm font-bold text-[#011749]">{order.shippingAddress?.name || "Mohamed Elagroudy"}</p>
                                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Primary Member</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                            <p className="text-sm text-[#011749] font-medium">{order.buyerEmail}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                            <p className="text-sm text-[#011749] font-medium">+20 102 345 6789</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                            <HiOutlineTruck size={20} />
                        </div>
                        <h3 className="font-bold text-[#011749]">Shipping</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Address</p>
                            <p className="text-sm text-[#011749] font-medium leading-relaxed">
                                {order.shippingAddress?.line1}, {order.shippingAddress?.city}, {order.shippingAddress?.country} {order.shippingAddress?.postalCode}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Method</p>
                            <p className="text-sm text-[#011749] font-medium">{order.deliveryMethod} - Standard Priority</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                            <HiOutlineCreditCard size={20} />
                        </div>
                        <h3 className="font-bold text-[#011749]">Payment</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-[#F6F7F9] rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-[#011749] rounded flex items-center justify-center text-[8px] font-black italic text-white">VISA</div>
                                <div>
                                    <p className="text-sm font-bold text-[#011749]">Visa Ending in {order.paymentSummary?.last4}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Expires {order.paymentSummary?.expMonth}/{order.paymentSummary?.expYear}</p>
                                </div>
                            </div>
                            <div className="text-green-500"><svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg></div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billing Status</p>
                            <p className="text-sm text-[#011749] font-medium italic">Invoiced and Collected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ordered Items */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden mb-10">
                <div className="px-8 py-5 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
                    <h3 className="font-bold text-[#011749]">Ordered Items</h3>
                    <span className="px-3 py-1 bg-[#F6F7F9] text-[#011749] text-[10px] font-bold rounded-full border border-gray-100">{order.orderItems?.length} Products</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FCFCFD] border-b border-gray-50">
                            <tr className="text-[#6F84AE] text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-4">Product</th>
                                <th className="px-8 py-4 text-center">Qty</th>
                                <th className="px-8 py-4 text-right">Unit Price</th>
                                <th className="px-8 py-4 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {order.orderItems?.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                                                <img 
                                                  src={item.pictureUrl && item.pictureUrl !== "default.jpg" 
                                                    ? `https://petmarket.runasp.net${item.pictureUrl}`
                                                    : "/placeholder.png"} 
                                                  alt={item.productName} 
                                                  className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#011749] text-sm">{item.productName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">SKU: VET-{item.productId}-092</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center text-sm font-bold text-[#011749]">0{item.quantity}</td>
                                    <td className="px-8 py-5 text-right text-sm font-bold text-[#011749]">${item.price.toLocaleString()}</td>
                                    <td className="px-8 py-5 text-right text-sm font-black text-[#011749]">${(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="p-8 bg-[#FCFCFD]">
                    <div className="max-w-[300px] ml-auto space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-bold">Subtotal</span>
                            <span className="text-[#011749] font-bold">${order.subtotal?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-bold">Shipping (Priority)</span>
                            <span className="text-[#011749] font-bold">${order.shippingPrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-bold">Tax (VAT 5%)</span>
                            <span className="text-[#011749] font-bold">$50.00</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between">
                            <span className="text-[#011749] font-black">Grand Total</span>
                            <span className="text-[#011749] font-black">${order.total?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-center gap-4">
                <button className="px-12 py-3 border border-gray-200 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all">Refund Order</button>
                <button className="px-12 py-3 bg-[#B0CDFF] text-[#011749] font-bold rounded-xl hover:opacity-90 transition-all">Contact Client</button>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
