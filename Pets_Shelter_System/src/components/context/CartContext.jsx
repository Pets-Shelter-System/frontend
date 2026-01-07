import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from 'react-hot-toast';

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const baseUrl = "http://petmarket.runasp.net";
  const token = localStorage.getItem("token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  // جلب الكارت من السيرفر
  const getUserCartItems = async () => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    try {
      const res = await axios.get(`${baseUrl}/api/Cart/${cartId}`, { headers: getAuthHeaders() });
      const items = res.data.data.items || [];
      setCartItems(items);
      if (items.length === 0) localStorage.removeItem("cartId");
    } catch (err) {
      console.error("Get cart errors:", err);
    }
  };

  // إضافة عنصر للكارت
 async function addToCart(prod) {
  try {
    let cartId = localStorage.getItem("cartId");
    let items = [];

    // 1️⃣ هات الكارت الحالي لو موجود
    if (cartId) {
      const res = await axios.get(
        `${baseUrl}/api/Cart/${cartId}`,
        { headers: getAuthHeaders() }
      );
      items = res.data.data.items || [];
    }

    // 2️⃣ شوف المنتج موجود ولا لا
    const index = items.findIndex(i => i.productId === prod.id);

    if (index > -1) {
      items[index].quantity += 1;
    } else {
      items.push({
        productId: prod.id,
        productName: prod.name,
        price: prod.price,
        quantity: 1,
        pictureUrls: prod.photos
          ? [prod.photos[0]?.imageName]
          : [],
      });
    }

    // 3️⃣ امسح الكارت القديم
    if (cartId) {
      await axios.delete(
        `${baseUrl}/api/Cart/${cartId}`,
        { headers: getAuthHeaders() }
      );
    }

    // 4️⃣ اعمل POST بالكارت كامل
    const response = await axios.post(
      `${baseUrl}/api/Cart`,
      { id: "string", items },
      { headers: getAuthHeaders() }
    );

    // 5️⃣ حدّث الستايت
    localStorage.setItem("cartId", response.data.data.id);
    setCartItems(response.data.data.items);

    toast.success(`${prod.name} added to cart!`);
  } catch (err) {
    console.error("Add to cart error:", err.response?.data || err);
    toast.error("Failed to add to cart");
    throw err;
  }
}


  // تحديث كمية عنصر
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;

      const items = cartItems.map(i => i.productId === itemId ? { ...i, quantity: newQuantity } : i);

      await axios.delete(`${baseUrl}/api/Cart/${cartId}`, { headers: getAuthHeaders() });
      const res = await axios.post(`${baseUrl}/api/Cart`, { id: "string", items }, { headers: getAuthHeaders() });
      localStorage.setItem("cartId", res.data.data.id);
      setCartItems(items);
      toast.success("Cart updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
      getUserCartItems(); // لو حصل خطأ
    }
  };

  const increaseQuantity = (itemId) => {
    const item = cartItems.find(i => i.productId === itemId);
    if (!item) return;
    updateQuantity(itemId, item.quantity + 1);
  };

  const decreaseQuantity = (itemId) => {
    const item = cartItems.find(i => i.productId === itemId);
    if (!item) return;
    updateQuantity(itemId, Math.max(item.quantity - 1, 1));
  };

  // حذف عنصر
  const removeFromCart = async (itemId) => {
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;

      const items = cartItems.filter(i => i.productId !== itemId);

      if (items.length === 0) {
        await axios.delete(`${baseUrl}/api/Cart/${cartId}`, { headers: getAuthHeaders() });
        localStorage.removeItem("cartId");
        setCartItems([]);
      } else {
        await axios.delete(`${baseUrl}/api/Cart/${cartId}`, { headers: getAuthHeaders() });
        const res = await axios.post(`${baseUrl}/api/Cart`, { id: "string", items }, { headers: getAuthHeaders() });
        localStorage.setItem("cartId", res.data.data.id);
        setCartItems(items);
      }
      toast.success("Item removed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
      getUserCartItems();
    }
  };

  useEffect(() => {
    getUserCartItems();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, getUserCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
