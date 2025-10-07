import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!", { autoClose: 2000 });
      return;
    }

    setLoading(true);

    try {
      // ✅ Use relative path (proxy will handle it in dev)
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Notify Header to update avatar immediately
        window.dispatchEvent(new Event("login"));

        toast.success("Login successful!", { autoClose: 2000 });
        setTimeout(() => navigate("/Homepage", { replace: true }), 2000);
      } else {
        toast.error(data.message || "Login failed", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoFocus
              required
            />
          </div>

          <div className="input-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </form>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Login;
