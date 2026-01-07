import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const FavoriteContext = createContext();

export default function FavoriteContextProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const baseUrl = "http://petmarket.runasp.net";
  const token = localStorage.getItem("token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  // جلب المفضلات من API أو localStorage عند البداية
 const getUserFavorites = async () => {
  try {
    let stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }

    if (!token) return;

    const res = await axios.get(`${baseUrl}/api/Favorites`, {
      headers: getAuthHeaders(),
    });

    const favoriteProducts = res.data?.data?.items?.map(item => item.product || item) || [];

    // لو فيه منتجات جديدة من السيرفر ما موجودةش في localStorage, ضيفها
    const updatedFavorites = [
      ...JSON.parse(stored || "[]").filter(f => favoriteProducts.every(fp => fp.id !== f.id)),
      ...favoriteProducts
    ];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  } catch (err) {
    console.error("Get favorites error:", err.response?.data || err);
  }
};


  // إضافة للمفضلة
  const addToFavorite = async (prod) => {
    if (!token) return;
    try {
      await axios.post(`${baseUrl}/api/Favorites`, { productId: prod.id }, { headers: getAuthHeaders() });
      setFavorites(prev => {
        if (prev.some(f => f.id === prod.id)) return prev;
        const updated = [...prev, prod];
        localStorage.setItem("favorites", JSON.stringify(updated));
        return updated;
      });
      toast.success("Added to favorites ❤️");
    } catch (err) {
      console.error("Add to favorite error:", err.response?.data || err);
    }
  };

  // إزالة من المفضلة
  const removeFromFavorite = async (productId) => {
    if (!token) return;
    try {
      await axios.delete(`${baseUrl}/api/Favorites/${productId}`, { headers: getAuthHeaders() });
      setFavorites(prev => {
        const updated = prev.filter(item => item.id !== productId);
        localStorage.setItem("favorites", JSON.stringify(updated));
        return updated;
      });
      toast.info("Removed from favorites 💔");
    } catch (err) {
      console.error("Remove from favorite error:", err.response?.data || err);
    }
  };

  const isFavorite = (productId) => favorites.some(f => f.id === productId);

  const toggleFavorite = async (prod) => {
    if (isFavorite(prod.id)) await removeFromFavorite(prod.id);
    else await addToFavorite(prod);
  };

  useEffect(() => {
    getUserFavorites();
  }, [token]);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addToFavorite,
        removeFromFavorite,
        toggleFavorite,
        getUserFavorites,
        isFavorite
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}
