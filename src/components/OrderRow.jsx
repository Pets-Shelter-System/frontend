import React from "react";
import OrderStatus from "./OrderStatus";
import { useNavigate } from "react-router-dom";

const OrderRow = ({ order }) => {
    const navigate = useNavigate();

    // Mapping image: order.orderItems?.[0]?.pictureUrl
    const firstItem = order.orderItems?.[0];
    const imageUrl = firstItem?.pictureUrl
        ? `https://petmarket.runasp.net${firstItem.pictureUrl}`
        : "https://via.placeholder.com/150";

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleViewDetails = () => {
        navigate(`/profile/orders/${order.id}`, { state: { order } });
    };

    return (
        <>
            {/* Desktop Perspective */}
            <tr className="hidden md:table-row border-b border-gray-50 hover:bg-[#F6F7F950] transition-all group">
                <td className="py-4 pl-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                            src={imageUrl}
                            alt="Order Item"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    </div>
                    <div>
                        <p className="font-bold text-[#011749]">Order #{order.id}</p>
                        <p className="text-gray-400 text-xs">
                            {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? "Item" : "Items"}
                        </p>
                    </div>
                </td>
                <td className="py-4 text-gray-500 text-sm font-medium">
                    {formatDate(order.orderDate)}
                </td>
                <td className="py-4 text-[#011749] font-bold">
                    EGP {order.total?.toFixed(2)}
                </td>
                <td className="py-4">
                    <OrderStatus status={order.status} />
                </td>
                <td className="py-4 pr-4 text-right">
                    <button
                        onClick={handleViewDetails}
                        className="text-sm font-bold text-[#011749] hover:text-[#E7A01C] transition-colors"
                    >
                        View Details
                    </button>
                </td>
            </tr>

            {/* Mobile Perspective */}
            <div
                onClick={handleViewDetails}
                className="md:hidden bg-white p-4 rounded-3xl border border-gray-50 shadow-sm space-y-4 cursor-pointer"
            >
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                            <img
                                src={imageUrl}
                                alt="Order Item"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/150";
                                }}
                            />
                        </div>
                        <div>
                            <p className="font-bold text-[#011749]">Order #{order.id}</p>
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                                {formatDate(order.orderDate)}
                            </p>
                        </div>
                    </div>
                    <OrderStatus status={order.status} />
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Total Amount
                        </p>
                        <p className="text-[#011749] font-bold text-lg">
                            EGP {order.total?.toFixed(2)}
                        </p>
                    </div>
                    <span className="text-[#011749] text-sm font-bold">Details →</span>
                </div>
            </div>
        </>
    );
};

export default OrderRow;
