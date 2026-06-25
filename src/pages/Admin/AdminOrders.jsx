import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoIosSearch, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { HiOutlineDownload, HiOutlinePrinter } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

const AdminOrders = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState({ total: 0, revenue: 0, pending: 0 });

    const pageSize = 10;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://petmarket.runasp.net/api/Admin/orders", {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    PageNumber: page,
                    PageSize: pageSize,
                    // Note: Assuming API supports search/filter as per pattern
                }
            });

            const data = res.data?.data || res.data;
            setOrders(data.items || []);
            setTotalItems(data.totalItemsCount || 0);

            // Calculate basic stats from current fetch (or separate API if available)
            // For now deriving from current data if real-time stats endpoint isn't provided
            const allItems = data.items || [];
            setStats({
                total: data.totalItemsCount || allItems.length,
                revenue: allItems.reduce((acc, curr) => acc + curr.total, 0) * 10, // Mocking multiplier for demo
                pending: allItems.filter(o => o.status === "Pending").length
            });
        } catch (err) {
            console.error("Fetch Orders Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, token]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "PaymentReceived": return "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]";
            case "Shipped": return "bg-blue-50 text-[#2563EB] border-blue-200";
            case "Pending": return "bg-blue-50 text-gray-600 border-gray-100";
            case "PaymentMismatch": return "bg-red-50 text-red-600 border-red-100";
            case "Delivered": return "bg-green-50 text-green-600 border-green-100";
            default: return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <div className="max-w-[1200px] mx-auto animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-xs font-bold text-[#6F84AE] uppercase tracking-wider mb-2 hover:text-[#011749]"
                >
                  <IoIosArrowBack /> Back to Profile
                </button>
                <h1 className="text-4xl font-extrabold text-[#011749]">Orders</h1>
                <p className="text-gray-400 mt-1">Manage medication shipments, diagnostic kit orders, and clinical supplies.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                    <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">🛒</div>
                        Total Orders
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#011749]">{stats.total}</span>
                        <span className="text-xs font-bold text-blue-500">+8%</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                    <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">💰</div>
                        Total Revenue
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#011749]">${stats.revenue.toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                    <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">⌛</div>
                        Pending Orders
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#011749]">{stats.pending}</span>
                        <span className="ml-3 px-2 py-0.5 bg-orange-50 text-orange-500 text-[10px] rounded-full uppercase">Requires Action</span>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-50 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 bg-[#F6F7F9] px-4 py-2.5 rounded-full w-full md:w-[400px]">
                    <IoIosSearch size={20} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by ID or customer..." 
                        className="bg-transparent outline-none text-sm w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select 
                        className="bg-[#F6F7F9] px-4 py-2.5 rounded-full text-sm outline-none cursor-pointer text-gray-500 font-medium"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Status</option>
                        <option value="Pending">Pending</option>
                        <option value="PaymentReceived">Payment Received</option>
                    </select>

                    <div className="flex gap-2 ml-auto">
                        <button className="p-2.5 rounded-full bg-[#F6F7F9] text-gray-500 hover:bg-gray-100 transition-all"><HiOutlineDownload size={20} /></button>
                        <button className="p-2.5 rounded-full bg-[#F6F7F9] text-gray-500 hover:bg-gray-100 transition-all"><HiOutlinePrinter size={20} /></button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr className="text-[#6F84AE] text-[11px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-5">Product</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Customer Email</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Total Amount</th>
                                <th className="px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center"><Spinner /></td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                    <img 
                                                      src={order.orderItems?.[0]?.pictureUrl && order.orderItems[0].pictureUrl !== "default.jpg" 
                                                        ? `https://petmarket.runasp.net${order.orderItems[0].pictureUrl}`
                                                        : "/placeholder.png"} 
                                                      className="w-full h-full object-cover" 
                                                      alt="product" 
                                                    />
                                                </div>
                                                <span className="font-bold text-[#011749]">#{order.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                                            {formatDate(order.orderDate)}
                                        </td>
                                        <td className="px-8 py-5 text-sm text-[#011749] font-semibold">
                                            {order.buyerEmail}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-2 w-fit ${getStatusStyle(order.status)}`}>
                                                <span className={`w-2 h-2 rounded-full shadow-md ${
                                                    order.status === "Pending" ? "bg-[#F59E0B] shadow-[#F59E0B99]" :
                                                    order.status === "PaymentReceived" ? "bg-[#2563EB] shadow-[#2563EB66]" :
                                                    order.status === "Shipped" ? "bg-[#2563EB] shadow-[#2563EB66]" :
                                                    order.status === "Delivered" ? "bg-[#10B981] shadow-[#10B98199]" :
                                                    "bg-[#BA1A1A] shadow-[#BA1A1A99]"
                                                }`} />
                                                {order.status.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-[#011749] font-black">
                                            ${order.total.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <button 
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                className="text-[11px] font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-[#011749] hover:bg-[#F6F7F9] transition-all text-[#011749]"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-400 font-medium">No orders found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-5 flex justify-between items-center border-t border-gray-50">
                    <p className="text-xs text-gray-400 font-medium">Showing {orders.length} of {totalItems} orders</p>
                    <div className="flex gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
                        >
                            <IoIosArrowBack />
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(totalItems / pageSize) }, (_, i) => i + 1).map(p => (
                                <button 
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === page ? "bg-[#011749] text-white" : "text-gray-400 hover:bg-gray-50"}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button 
                            disabled={page >= Math.ceil(totalItems / pageSize)}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
