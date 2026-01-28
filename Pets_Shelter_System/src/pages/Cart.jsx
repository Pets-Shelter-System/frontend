import React, { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
// import { Navigation } from 'swiper/modules'
import { CartContext } from '../components/context/CartContext'
// import { i } from 'framer-motion/client';
import { CheckoutContext } from "../components/context/CheckoutContext";

export default function cart() {
  const navigate = useNavigate();
  const { createPaymentIntent } = useContext(CheckoutContext);
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useContext(CartContext);

  console.log("products:", cartItems);

  async function updateQuantity(itemId, newQuantity) {
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;

      // جلب العناصر الحالية من السيرفر
      const res = await axios.get(`${baseUrl}/api/Cart/${cartId}`, { headers: getAuthHeaders() });
      let items = res.data.data.items || [];

      // تعديل الكمية محليًا
      items = items.map(i =>
        i.productId === itemId ? { ...i, quantity: newQuantity } : i
      );

      // حذف الكارت القديم
      await axios.delete(`${baseUrl}/api/Cart/${cartId}`, { headers: getAuthHeaders() });

      // إعادة POST بالكارت كله
      const response = await axios.post(`${baseUrl}/api/Cart`, {
        id: "string",
        items: items
      }, { headers: getAuthHeaders() });

      localStorage.setItem("cartId", response.data.data.id);
      setCartItems(items);

    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity");
      getUserCartItems(); // إعادة تحميل الكارت من السيرفر عند الخطأ
    }
  }


  // function increaseQuantity(itemId, currentQuantity) {
  //   updateQuantity(itemId, currentQuantity + 1);
  // }

  // function decreaseQuantity(itemId, currentQuantity) {
  //   updateQuantity(itemId, Math.max(currentQuantity - 1, 1));
  // }


  // async function updateCart() {
  //   const cartId = localStorage.getItem("cartId");
  //   if (!cartId) return;

  //   try {
  //     await axios.put(
  //       `http://petmarket.runasp.net/api/Cart/${cartId}`,
  //       { items: cartItems },
  //       { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  //     );
  //     toast.success("Cart updated!");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to update cart.");
  //   }
  // }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // const handleCheckout = async () => {
  //   console.log("➡ Calling createPaymentIntent...");
  //   const res = await createPaymentIntent();

  //   console.log("➡ Result from backend:", res);

  //   if (res) navigate("/order");
  // };


  return (
    <div className='pt-20'>
      <section className="w-full bg-[#f5f5f5]   py-9 px-8">
        <h1 className="text-center text-[#191919]   text-[32px] font-semibold leading-[38px]">
          My Shopping Cart
        </h1>
        <div className="flex items-start mt-8 gap-6">
          <div className="bg-white p-4 w-[800px] rounded-xl">
            <table className="w-full bg-white rounded-xl">
              <thead>
                <tr className="text-center border-b border-gray-400 w-full text-[#7f7f7f] text-sm font-medium uppercase leading-[14px] tracking-wide">
                  <th className="text-left px-2 py-2">Product</th>
                  <th className="px-2 py-2">price</th>
                  <th className="px-2 py-2">Quantity</th>
                  <th className="px-2 py-2">Subtotal</th>
                  <th className="w-7 px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 text-lg">
                      Your cart is empty
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item) => {
                    return <tr className="text-center" key={item.productId}>
                      <td className="px-2 py-2 text-left align-top">
                        <img
                          src={item.pictureUrls?.[0] ? `http://petmarket.runasp.net${item.pictureUrls[0]}` : "/default.png"}
                          alt={item.productName}
                          className="w-[100px] mr-2 inline-block h-[100px]"
                        />
                        <span>{item.productName}</span>
                      </td>
                      <td className="px-2 py-2">{item.price}</td>
                      <td className="p-2 mt-9 bg-white rounded-[170px] border border-[#a0a0a0] justify-around items-center flex">
                        <svg width={14} height={15} className="cursor-pointer"
                          viewBox="0 0 14 15" fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => decreaseQuantity(item.productId)}>
                          <path d="M2.33398 7.5H11.6673" stroke="#666666"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg><span className="w-10 text-center text-[#191919] text-base font-normal leading-normal">{item.quantity}</span>
                        <svg className="cursor-pointer relative" width={14}
                          height={15} viewBox="0 0 14 15" fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => increaseQuantity(item.productId)}>
                          <path d="M2.33398 7.49998H11.6673M7.00065 2.83331V12.1666V2.83331Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </td>
                      <td className="px-2 py-2">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-2 py-2">
                        <svg width={24} className="cursor-pointer"
                          height={25} viewBox="0 0 24 25" fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => removeFromCart(item.productId)}>
                          <path d="M12 23.5C18.0748 23.5 23 18.5748 23 12.5C23 6.42525 18.0748 1.5 12 1.5C5.92525 1.5 1 6.42525 1 12.5C1 18.5748 5.92525 23.5 12 23.5Z" stroke="#CCCCCC" strokeMiterlimit={10} />
                          <path d="M16 8.5L8 16.5" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16 16.5L8 8.5" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </td>
                    </tr>
                  }))}


              </tbody>
              <tfoot>
                <tr className="border-t border-gray-400" >
                  <td className="px-2 py-2" colSpan={3}>
                    <button className="px-8 cursor-pointer py-3.5 bg-[#011749] rounded-[43px] text-white text-sm font-semibold className leading-[16px]"
                      onClick={() => navigate('/shop')}
                    >
                      Return to shop
                    </button>
                  </td>
                  <td className="px-2 py-2" colSpan={2}>
                    <button className="px-8 py-3.5 cursor-pointer bg-[#f2f2f2] rounded-[43px] text-[#4c4c4c] text-sm font-semibold className leading-[16px]"
                      onClick={updateQuantity}>
                      Update Cart
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="w-[424px] bg-white rounded-lg p-6">
            <h2 className="text-[#191919] mb-2 text-xl font-medium leading-[30px]">
              Cart Total
            </h2>
            <div className="w-[376px] py-3 justify-between items-center flex">
              <span className="text-[#4c4c4c] text-base font-normal leading-normal">Total:</span><span className="text-[#191919] text-base font-semibold leading-tight">${totalPrice.toFixed(2)}</span>
            </div>


            <button onClick={() => navigate('/order')} className="w-[376px] text-white mt-5 px-10 py-4 bg-[#E7A01C] rounded-[44px] gap-4 text-base font-semibold leading-tight">
              Proceed to checkout
            </button>
          </div>
        </div>

      </section>

    </div>
  )
}
