import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import Shop from "./pages/Shop";
import ProductDetails from "./components/ProductDetails";
function App() {
  return (
    <Routes>
      {/* ✅ الصفحات العادية فيها ناف و فوتر */}
      <Route path="/" element={<Layout />}>
  <Route index element={<Home />} />

  <Route path="shop/*">
  <Route index element={<Shop />} />
  <Route path="productdetails/:id" element={<ProductDetails />} />
</Route>
</Route>
      {/* ✅ صفحات الـAuth */}
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
  );
}

export default App;