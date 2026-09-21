import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", mobileNumber: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.mobileNumber) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.mobileNumber);
      toast.success("Registration successful. Please check your email to verify your account.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 overflow-hidden relative border border-stone-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-stone-800">Create Account</h2>
          <p className="text-stone-500 text-sm mt-2">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 ml-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-stone-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-stone-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 ml-1">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">+91</span>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-stone-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 ml-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-stone-400"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-dark transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-stone-500 relative z-10">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
