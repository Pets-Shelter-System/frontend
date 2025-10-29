import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const INPUT_CLASS =
  "w-full border border-[#717070] rounded-[10px] px-4 py-2 text-sm text-[#999999] focus:outline-none focus:ring-0 focus:border-[#717070] ";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/Account/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });

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
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-[50px] font-bold mb-2 text-gray-900">Sign Up</h2>
      <p className="text-gray-500 mb-8 text-sm">
        Enter your personal information
      </p>

      {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <input
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <input
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <input
            name="userName"
            type="text"
            placeholder="Enter your user name"
            value={formData.userName}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
        </div>

        {/* Password field */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            name="passwordConfirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className={INPUT_CLASS}
            required
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-login-btn text-white font-bold w-full py-3.5 rounded-full tracking-wider mt-6"
        >
          Sign Up
        </button>
      </form>

      <p className="text-xs text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-login-btn font-semibold hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

const SignupScreen = () => (
  <AuthLayout>
    <Signup />
  </AuthLayout>
);

export default SignupScreen;
