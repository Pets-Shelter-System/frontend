import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const FavoriteContext = createContext();

export default function FavoriteContextProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const baseUrl = "http://petmarket.runasp.net";

  const token = localStorage.getItem("token");

  // headers memoized
  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }), [token]);

  // GET favorites
  const fetchFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const res = await axios.get(`${baseUrl}/api/Favorites`, { headers });
      setFavorites(res.data.data || []);
    } catch (err) {
      console.error("fetchFavorites error:", err.response?.data || err);
    }
  }, [token, headers]);

  // ADD favorite
  const addFavorite = async (product) => {
    if (!token) {
      toast.error("Login required ❤️");
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/Favorites`,
        { productId: product.id },
        { headers }
      );

      toast.success("Added to favorites ❤️");

      // Important → refresh from backend for consistency
      fetchFavorites();
    } catch (err) {
      toast.error("Failed to add favorite");
      console.error(err.response?.data || err);
    }
  };

  // REMOVE favorite
  const removeFavorite = async (productId) => {
    if (!token) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/api/Favorites/${productId}`, { headers });

      toast("Removed 💔");

      // refresh for consistency
      setFavorites(prev => prev.filter(f => f.id !== productId));
    } catch (err) {
      toast.error("Failed to remove favorite");
      console.error(err.response?.data || err);
    }
  };

  // TOGGLE favorite
  const toggleFavorite = async (product) => {
    if (isFavorite(product.id)) {
      await removeFavorite(product.id);
    } else {
      await addFavorite(product);
    }
  };

  // CHECK
  const isFavorite = useCallback(
    (productId) => favorites.some(f => f.id === productId),
    [favorites]
  );

  // load on login refresh
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // logout cleanup
  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        isFavorite,
        fetchFavorites,
        clearFavorites,
        setFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}
