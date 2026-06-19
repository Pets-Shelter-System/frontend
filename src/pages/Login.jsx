import React, { useState, useContext } from "react";
import api from "../API/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { FavoriteContext } from "../components/context/FavoriteContext";
import { CartContext } from "../components/context/CartContext";
import { AuthContext } from "../components/context/AuthContext";
const INPUT_CLASS =
  "w-full border border-[#717070] rounded-[10px] px-4 py-2 my-2 text-sm text-[#999999] focus:outline-none focus:ring-0 focus:border-[#717070]";

const Login = () => {
  const navigate = useNavigate();

  const { fetchFavorites } = useContext(FavoriteContext);
  const { fetchCart } = useContext(CartContext);
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/Account/login", formData);

      if (!res.data?.isAuthenticated) {
        setError("Invalid email or password!");
        return;
      }

      // Use the centralized login method
      login(res.data);

      // Load favorites & cart immediately
      await fetchFavorites();
      await fetchCart();

      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="font-poppins font-medium text-[40px] text-gray-900">
        Login
      </h2>
      <p className="text-gray-500 mb-8 mt-2 text-sm">
        Welcome back! Please login to your account
      </p>

      {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={INPUT_CLASS}
          required
        />

        <div className="relative">
          <label className="text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
          <span
            className="absolute right-4 top-10 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <Link
          to="/forgot-password"
          className="text-right text-xs text-blue-500 hover:text-blue-700 font-medium"
        >
          Forgot Password?
        </Link>

        <button
          type="submit"
          className="bg-login-btn text-white font-bold w-full py-3.5 rounded-full tracking-wider mt-6"
        >
          Login
        </button>
      </form>

      <p className="text-xs text-center text-gray-600 mt-6">
        New User?{" "}
        <a href="/signup" className="text-login-btn font-semibold hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default Login;
