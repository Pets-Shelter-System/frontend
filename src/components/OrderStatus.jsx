import React from "react";

const OrderStatus = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return {
                    text: "Pending",
                    color: "#F59E0B",
                };
            case "delivered":
                return {
                    text: "Delivered",
                    color: "#22C55E",
                };
            case "cancelled":
                return {
                    text: "Cancelled",
                    color: "#EF4444",
                };
            default:
                return {
                    text: status || "Unknown",
                    color: "#6B7280",
                };
        }
    };

    const { text, color } = getStatusConfig(status);

    return (
        <div className="flex items-center gap-2">
            <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                    backgroundColor: color,
                    boxShadow: `0px 0px 8px ${color}`,
                }}
            />
            <span
                className="text-sm font-semibold"
                style={{
                    color: color,
                }}
            >
                {text}
            </span>
        </div>
    );
};

export default OrderStatus;
