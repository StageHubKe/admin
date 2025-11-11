// src/components/Admin/AdminLogin.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { adminLogin } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(adminLogin(formData));

    if (adminLogin.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4">
      <div className="bg-white/90 shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-200 backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-full mb-3 shadow-md">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-1">
            Access your admin dashboard securely
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-center bg-red-100 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Admin Panel • Secure Access</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
