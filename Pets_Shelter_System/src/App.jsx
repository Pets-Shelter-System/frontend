import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import Shop from "./pages/Shop";
import Cart from "./pages/cart";
import ProductDetails from "./pages/ProductDetails";
import CartContextProvider from "./components/context/CartContext";

import { Toaster } from "react-hot-toast";
import FavoriteContextProvider from "./components/context/FavoriteContext";
import Favorite from "./pages/Favorite";
import AuthContextProvider from "./components/context/AuthContext";
import Order from "./pages/Order/Order";
import CheckoutContextProvider from './components/context/CheckoutContext'
import ThankYou from "./pages/ThankYou";


function App() {
  return (
    <>
      <AuthContextProvider>

        <FavoriteContextProvider>
          <CartContextProvider>
            <CheckoutContextProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="favorite" element={<Favorite />} />
                  <Route path="shop/product/:id" element={<ProductDetails />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/order/thank-you" element={<ThankYou />} />
                </Route>

                <Route
                  path="/login"
                  element={
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  }
                />

                <Route
                  path="/signup"
                  element={
                    <AuthLayout>
                      <Signup />
                    </AuthLayout>
                  }
                />
              </Routes>
            </CheckoutContextProvider>
          </CartContextProvider>
        </FavoriteContextProvider>
      </AuthContextProvider>
      <Toaster />
    </>
  );
}

export default App;
