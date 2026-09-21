import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        toast.success("Login successful!");
        navigate(res.role === "ADMIN" ? "/admin" : "/");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Invalid credentials or email not verified.",
      );
    } finally {
      setLoading(false);
    }
  };

  const googleLoginAction = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await googleLogin(tokenResponse.access_token);
        if (res.success) {
          toast.success("Google Login successful!");
          navigate(res.role === "ADMIN" ? "/admin" : "/");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Google Login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login failed");
    },
  });

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 overflow-hidden relative border border-stone-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-stone-800">
            Welcome Back
          </h2>
          <p className="text-stone-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleStandardLogin}
          className="space-y-6 relative z-10"
        >
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 ml-1">
              Email Address
            </label>
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
            <label className="block text-sm font-medium text-stone-700 mb-2 ml-1">
              Password
            </label>
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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px bg-stone-200 flex-1"></div>
          <span className="text-stone-400 text-sm">OR</span>
          <div className="h-px bg-stone-200 flex-1"></div>
        </div>

        <button
          onClick={() => googleLoginAction()}
          disabled={loading}
          className="mt-6 w-full py-3.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-2xl hover:bg-stone-50 transition-all duration-300 active:scale-[0.98] shadow-sm flex items-center justify-center gap-3"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-stone-500 relative z-10">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
