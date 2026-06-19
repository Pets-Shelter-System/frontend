import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../API/api";
import { toast } from "react-hot-toast";

const INPUT_CLASS =
  "w-full border border-[#717070] rounded-[10px] px-4 py-2 my-2 text-sm text-[#999999] focus:outline-none focus:ring-0 focus:border-[#717070] disabled:bg-gray-100 disabled:cursor-not-allowed";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus input on mount or when returning to form
  useEffect(() => {
    if (!emailSent && inputRef.current) {
      inputRef.current.focus();
    }
  }, [emailSent]);

  // Cleanup loading state on unmount
  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,13}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your email.");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await api.get("/Account/send-email-forget-password", {
        params: { email: normalizedEmail },
      });
      
      setSubmittedEmail(normalizedEmail);
      setEmailSent(true);
    } catch (err) {
      if (
        err.response?.status === 404 &&
        err.response?.data?.message === "User not found"
      ) {
        toast.error("No account exists with this email.");
      } else if (!err.response) {
        toast.error("Please check your internet connection.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      console.error("Forgot Password Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAgain = () => {
    setEmailSent(false);
  };

  return (
    <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-[500px] mx-auto md:mx-0">
      {!emailSent ? (
        <>
          <h2 className="font-poppins font-medium text-[40px] text-gray-900 leading-tight">
            Forgot Password
          </h2>
          <p className="text-gray-500 mb-8 mt-2 text-sm">
            Enter your email and we will send a reset link.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                ref={inputRef}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
                disabled={loading}
                autoFocus
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-login-btn text-white font-bold w-full py-4 rounded-full tracking-wider mt-4 transition-all hover:opacity-90 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors mt-2"
            >
              Back to Login
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
             </svg>
          </div>
          <h2 className="font-poppins font-medium text-[40px] text-gray-900 leading-tight">
            Check your email
          </h2>
          <div className="text-gray-500 mt-4 text-sm max-w-[320px]">
            <p>If this email can receive messages, a reset link will arrive shortly.</p>
            <p className="font-semibold text-gray-800 break-all mt-2">{submittedEmail}</p>
          </div>
          <p className="text-gray-400 mt-4 text-xs">
            Please check your inbox and spam folder.
          </p>

          <div className="w-full space-y-3 mt-8">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-login-btn text-white font-bold w-full py-4 rounded-full tracking-wider transition-all hover:opacity-90"
            >
              Back to Login
            </button>
            <button
              type="button"
              onClick={handleSendAgain}
              className="w-full py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Send Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
