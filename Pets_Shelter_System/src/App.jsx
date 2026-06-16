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
import Adoption from "./pages/Adoption";
import AnimalDetails from "./pages/AnimalDetails";
import AdoptMe from "./pages/AdoptMe";
import ScrollToTop from "./components/ScrollTop";
import AdminLayout from "./components/AdminLayout";
import Request from "./pages/Admin/Request";
import Users from './pages/Admin/Users'
import Animals from "./pages/Admin/Animals";
import EditAnimal from "./pages/Admin/EditAnimal";
import AddAnimal from "./pages/Admin/AddAnimal";
import AnimalRequests from "./pages/Admin/AnimalRequests";
import ManageShop from "./pages/Admin/ManageShop";
import AddProduct from "./pages/Admin/AddProduct";
import Foster from "./pages/Foster";
import FosterDetails from "./pages/FosterDetails";
import FosterMe from "./pages/FosterMe";
import Profile from "./pages/Profile";
import UserApplications from "./pages/UserApplications";
import ApplicationDetails from "./pages/ApplicationDetails";



import ProfileLayout from "./components/ProfileLayout";

function App() {
  return (
    <>
      <AuthContextProvider>

        <FavoriteContextProvider>
          <CartContextProvider>
            <CheckoutContextProvider>
              <ScrollToTop />

              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="favorite" element={<Favorite />} />
                  <Route path="shop/product/:id" element={<ProductDetails />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/order/thank-you" element={<ThankYou />} />
                  <Route path="/adoption" element={<Adoption />} />
                  <Route path="/adoption/:id" element={<AnimalDetails />} />
                  <Route path="/adoption/:id/adopt-me" element={<AdoptMe />} />
                  <Route path="/foster" element={<Foster />} />
                  <Route path="/foster/:id" element={<FosterDetails />} />
                  <Route path="/foster/:id/foster-me" element={<FosterMe />} />

                  <Route path="/profile" element={<ProfileLayout />}>
                    <Route index element={<Profile />} />
                    <Route path="applications" element={<UserApplications />} />
                    <Route path="applications/:id" element={<ApplicationDetails />} />
                  </Route>

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

                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="requests" element={<Request />} />
                  <Route path="requests/:name" element={<AnimalRequests />} />
                  <Route path="users" element={<Users />} />
                  <Route path="animals" element={<Animals />} />
                  <Route path="animals/edit/:id" element={<EditAnimal />} />
                  <Route path="animals/add" element={<AddAnimal />} />
                  <Route path="shop" element={<ManageShop />} />
                  <Route path="shop/add" element={<AddProduct />} />

                  {/* <Route path="shop/product/:id" element={<AdminProductDetails />} /> */}


                </Route>
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
