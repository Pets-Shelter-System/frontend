import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import Shop from "./pages/Shop";
function App() {
  return (
    <Routes>
      {/* ✅ الصفحات العادية فيها ناف و فوتر */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* ✅ صفحة الشوب */}
        <Route path="shop" element={<Shop />} />
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