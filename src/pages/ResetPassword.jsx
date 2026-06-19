import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../API/api";
import { toast } from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const INPUT_CLASS =
  "w-full border border-[#717070] rounded-[10px] px-4 py-2 my-2 text-sm text-[#333] focus:outline-none focus:ring-0 focus:border-[#717070] disabled:bg-gray-100 disabled:cursor-not-allowed";

const ResetPassword = () => {
  const navigate = useNavigate();

  const rawQuery = window.location.search;

  // email عادي
  const email = new URLSearchParams(rawQuery).get("email") || "";

  const code = rawQuery.split("code=")[1] || "";

  console.log("EMAIL =", email);
  console.log("TOKEN =", code);


  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("form"); // 'form' | 'success' | 'invalid'

  useEffect(() => {
    if (!email || !code) {
      setStatus("invalid");
    }
  }, [email, code]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    if (formData.password.length < 12) {
      toast.error("Password must be at least 12 characters long.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        email,
        token: code,
        password: formData.password,
      };

      console.log("PAYLOAD:", payload);

      await api.post("/Account/reset-password", payload);

      setStatus("success");
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || "Reset link expired");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === "invalid") {
    return (
      <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-[500px] text-center">
        <div className="flex justify-center mb-6 text-red-500">
          <FaExclamationCircle size={60} />
        </div>
        <h2 className="font-poppins font-medium text-[40px] text-gray-900 leading-tight">
          Invalid Reset Link
        </h2>
        <p className="text-gray-500 mt-4 mb-8">
          This password reset link is invalid or expired.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-login-btn text-white font-bold w-full py-4 rounded-full tracking-wider transition-all hover:opacity-90"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-[500px] text-center">
        <div className="flex justify-center mb-6 text-green-500">
          <FaCheckCircle size={60} />
        </div>
        <h2 className="font-poppins font-medium text-[40px] text-gray-900 leading-tight">
          Password Updated
        </h2>
        <p className="text-gray-500 mt-4 mb-8">
          Your password has been updated successfully.
          <br />
          You can now sign in using your new password.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-login-btn text-white font-bold w-full py-4 rounded-full tracking-wider transition-all hover:opacity-90"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-[500px]">
      <h2 className="font-poppins font-medium text-[40px] text-gray-900 leading-tight">
        Reset Password
      </h2>
      <p className="text-gray-500 mb-8 mt-2 text-sm">
        Enter your new password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="relative">
          <label className="text-sm font-semibold text-gray-700">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
            className={INPUT_CLASS}
            disabled={loading}
            required
            minLength={12}
          />
          <span
            className="absolute right-4 top-10 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative">
          <label className="text-sm font-semibold text-gray-700">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={INPUT_CLASS}
            disabled={loading}
            required
            minLength={12}
          />
          <span
            className="absolute right-4 top-10 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {formData.password && formData.password.length < 12 && (
          <p className="text-xs text-red-500">
            Password must be at least 12 characters.
          </p>
        )}

        {formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500">Passwords do not match.</p>
          )}

        <button
          type="submit"
          disabled={loading}
          className="bg-login-btn text-white font-bold w-full py-4 rounded-full tracking-wider mt-6 transition-all hover:opacity-90 disabled:opacity-70 flex justify-center items-center"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors mt-2"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
