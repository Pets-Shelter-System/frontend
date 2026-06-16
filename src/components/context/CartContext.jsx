import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../../API/api";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const cartId = user?.email;

  // listen for login/logout
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);


  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }), [token]);

  // ---- Fetch Cart ----
  const fetchCart = useCallback(async () => {
    if (!cartId || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get(`/Cart/${cartId}`, { headers });
      setCartItems(res.data.data.items || []);
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          await api.post(`/Cart`, { id: cartId, items: [] }, { headers });
          setCartItems([]);
        } catch (createErr) {
          console.error("Failed to create cart:", createErr);
          setError("Failed to create cart");
        }
      } else {
        console.error("Failed to fetch cart:", err);
        setError("Failed to load cart");
      }
    } finally {
      setCartLoaded(true);
      setIsLoading(false);
    }
  }, [cartId, token, headers]);

  // ---- Add to Cart ----
  const addToCart = async (product) => {
    if (!cartId) {
      setError("Login required");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const items = [...cartItems];
      const idx = items.findIndex((i) => i.productId === product.id);

      if (idx > -1) {
        items[idx].quantity += 1;
      } else {
        items.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          pictureUrls: product.photos?.length ? [product.photos[0].imageName] : [],
        });
      }

      const res = await api.post(`/Cart`, { id: cartId, items }, { headers });
      setCartItems(res.data.data.items || items);
      return true;
    } catch (err) {
      console.error("Failed add product:", err);
      setError("Failed to add product");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Remove Item ----
  const removeFromCart = async (productId) => {
    if (!cartId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const items = cartItems.filter((i) => i.productId !== productId);

      const res = await api.post(`/Cart`, { id: cartId, items }, { headers });
      setCartItems(res.data.data.items || items);
      return true;
    } catch (err) {
      console.error("Failed to remove product:", err);
      setError("Failed to remove product");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Update Quantity ----
  const updateQuantity = async (productId, delta) => {
    if (!cartId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const items = cartItems.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(i.quantity + delta, 1) }
          : i
      );

      const res = await api.post(`/Cart`, { id: cartId, items }, { headers });
      setCartItems(res.data.data.items || items);
      return true;
    } catch (err) {
      console.error("Failed update quantity:", err);
      setError("Failed update quantity");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantity = (id) => updateQuantity(id, 1);
  const decreaseQuantity = (id) => updateQuantity(id, -1);

  // ---- Clear Cart ----
  const clearCart = useCallback(async () => {
    if (!cartId) return false;

    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/Cart/${cartId}`, { headers });
      setCartItems([]);
      return true;
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError("Failed to clear cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, headers]);

  // Totals
  const totalPrice = useMemo(() =>
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0), [cartItems]
  );

  const totalItems = useMemo(() =>
    cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]
  );

  // ---- Auto fetch on login / reset on logout ----
  useEffect(() => {
    if (token && cartId) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartLoaded(false);
    }
  }, [token, cartId, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoaded,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalPrice,
        totalItems,
        fetchCart,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
