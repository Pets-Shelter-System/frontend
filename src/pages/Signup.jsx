import React, { useState } from "react";
import api from "../API/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const INPUT_CLASS =
  "w-full border border-[#717070] rounded-[10px] px-4 py-2 text-sm text-[#999999] focus:outline-none focus:ring-0 focus:border-[#717070]";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/Account/register", formData);

      if (res.data?.isAuthenticated) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        alert("Signup successful!");
        navigate("/login");
      } else {
        setError("Signup failed, please try again!");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="bg-white p-9 rounded-2xl shadow-2xl w-full max-w-md text-sm">
      <h2 className="text-[32px] font-bold mb-5 text-gray-900">Sign Up</h2>
      <p className="text-gray-500 mb-4 text-xs">
        Enter your personal information
      </p>

      {error && (
        <p className="text-red-500 text-xs text-center mb-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          name="firstName"
          type="text"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          className={INPUT_CLASS}
          required
        />

        <input
          name="lastName"
          type="text"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          className={INPUT_CLASS}
          required
        />

        <input
          name="userName"
          type="text"
          placeholder="User name"
          value={formData.userName}
          onChange={handleChange}
          className={INPUT_CLASS}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={INPUT_CLASS}
          required
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-sm"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-sm"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-login-btn text-white font-semibold w-full py-2.5 rounded-full tracking-wide mt-4 text-sm"
        >
          Sign Up
        </button>
      </form>

      <p className="text-xs text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-login-btn font-semibold hover:underline"
        >
          Login
        </a>
      </p>
    </div>
  );
};

export default Signup;
