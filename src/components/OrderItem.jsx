import React from "react";

const OrderItem = ({ item }) => {
    const imageUrl = item.pictureUrl
        ? `http://petmarket.runasp.net${item.pictureUrl}`
        : "https://via.placeholder.com/150";

    const subtotal = item.price * item.quantity;

    return (
        <div className="flex items-center gap-6 p-4 rounded-[24px] border border-gray-50 bg-[#F6F7F950] hover:bg-white hover:shadow-sm transition-all group">
            {/* Product Image */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                <img
                    src={imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                    }}
                />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
                <h4 className="font-bold text-[#011749] text-base">
                    {item.productName}
                </h4>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span>Price: EGP {item.price.toFixed(2)}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>Qty: {item.quantity}</span>
                </div>
            </div>

            {/* Subtotal */}
            <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Subtotal
                </p>
                <p className="text-[#011749] font-bold text-lg">
                    EGP {subtotal.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default OrderItem;
