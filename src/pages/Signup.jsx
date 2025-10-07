import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 chars, with uppercase, lowercase, number & symbol.";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setPopup("Please fix the form errors before submitting.");
      return;
    }

    try {
      // ✅ No localhost — use relative path for proxy
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPopup("Signup successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setPopup(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setPopup("An error occurred. Please try again.");
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="toggle-btn" onClick={togglePassword}>
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span className="toggle-btn" onClick={togglePassword}>
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>

          {popup && <p className="bottom-error">{popup}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
