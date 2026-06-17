import api from "../API/api";

export const getOrders = async (token) => {
    const response = await api.get("/Orders", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getOrderById = async (id, token) => {
    const response = await api.get(`/Orders/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default {
    getOrders,
    getOrderById,
};
