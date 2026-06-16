import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../components/context/CartContext'
import { CheckoutContext } from "../components/context/CheckoutContext";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice
  } = useContext(CartContext);

  console.log("products:", cartItems);

  return (
    <div className='pt-20'>
      <section className="w-full bg-[#f5f5f5] py-9 px-8">
        <h1 className="text-center text-[#191919] text-[32px] font-semibold leading-[38px]">
          My Shopping Cart
        </h1>
        <div className="flex flex-col lg:flex-row items-start mt-8 gap-6">
          <div className="bg-white p-4 w-full lg:w-[800px] rounded-xl overflow-x-auto">
            <table className="w-full bg-white rounded-xl min-w-[600px]">
              <thead>
                <tr className="text-center border-b border-gray-400 w-full text-[#7f7f7f] text-sm font-medium uppercase leading-[14px] tracking-wide">
                  <th className="text-left px-2 py-2">Product</th>
                  <th className="px-2 py-2">Price</th>
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
                  cartItems.map((item) => (
                    <tr className="text-center border-b border-gray-100 last:border-0" key={item.productId}>
                      <td className="px-2 py-4 text-left align-middle flex items-center">
                        <img
                          src={item.pictureUrls?.[0] ? `http://petmarket.runasp.net${item.pictureUrls[0]}` : "/default.png"}
                          alt={item.productName}
                          className="w-[80px] h-[80px] mr-4 inline-block object-cover rounded-lg"
                        />
                        <span className="font-medium text-[#191919]">{item.productName}</span>
                      </td>
                      <td className="px-2 py-4 text-[#191919]">EGP {item.price}</td>
                      <td className="px-2 py-4">
                        <div className="mx-auto w-24 p-2 bg-white rounded-[170px] border border-[#a0a0a0] justify-around items-center flex">
                          <svg width={14} height={15} className="cursor-pointer"
                            viewBox="0 0 14 15" fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => decreaseQuantity(item.productId)}>
                            <path d="M2.33398 7.5H11.6673" stroke="#666666"
                              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="w-8 text-center text-[#191919] text-base font-normal">{item.quantity}</span>
                          <svg className="cursor-pointer relative" width={14}
                            height={15} viewBox="0 0 14 15" fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => increaseQuantity(item.productId)}>
                            <path d="M2.33398 7.49998H11.6673M7.00065 2.83331V12.1666V2.83331Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-[#191919] font-semibold">EGP {(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-2 py-4">
                        <svg width={24} className="cursor-pointer mx-auto"
                          height={25} viewBox="0 0 24 25" fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => removeFromCart(item.productId)}>
                          <path d="M12 23.5C18.0748 23.5 23 18.5748 23 12.5C23 6.42525 18.0748 1.5 12 1.5C5.92525 1.5 1 6.42525 1 12.5C1 18.5748 5.92525 23.5 12 23.5Z" stroke="#CCCCCC" strokeMiterlimit={10} />
                          <path d="M16 8.5L8 16.5" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16 16.5L8 8.5" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-400">
                  <td className="px-2 py-6 text-left" colSpan={5}>
                    <button className="px-8 cursor-pointer py-3 bg-[#011749] rounded-[43px] text-white text-sm font-semibold"
                      onClick={() => navigate('/shop')}
                    >
                      Return to Shop
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="w-full lg:w-[424px] bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-[#191919] mb-4 text-xl font-bold border-b pb-4">
              Cart Totals
            </h2>
            <div className="py-4 justify-between items-center flex">
              <span className="text-[#4c4c4c] text-lg">Subtotal:</span>
              <span className="text-[#191919] text-xl font-bold">EGP {totalPrice.toFixed(2)}</span>
            </div>
            <div className="py-4 border-t border-b justify-between items-center flex mb-6">
              <span className="text-[#4c4c4c] text-lg font-bold">Total:</span>
              <span className="text-[#E7A01C] text-2xl font-bold">EGP {totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/order')}
              disabled={cartItems.length === 0}
              className={`w-full text-white px-10 py-4 rounded-[44px] text-lg font-bold transition-all ${cartItems.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#E7A01C] hover:bg-[#d8961a] shadow-lg"
                }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
