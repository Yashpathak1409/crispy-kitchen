import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/hand-drawn-hungry-emoji-illustration_23-2151048229.jpg";
import "./Header.css";

const Header = () => {
  const [role, setRole] = useState(null);
  const [userInitial, setUserInitial] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch current user using backend API (not token decode)
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      setUserInitial(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.user) {
        const { name, role } = data.user;
        setRole(role || null);
        setUserInitial(name ? name.charAt(0).toUpperCase() : "U");
      } else {
        console.warn("Failed to fetch user:", data.message);
        setRole(null);
        setUserInitial(null);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setRole(null);
      setUserInitial(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // 🔄 Listen for login/logout and refresh avatar
    const handleLogin = () => fetchUserProfile();
    const handleLogout = () => {
      setRole(null);
      setUserInitial(null);
    };

    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="left-section">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">Food Recipe</h1>
      </div>

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span className={menuOpen ? "bar active" : "bar"}></span>
        <span className={menuOpen ? "bar active" : "bar"}></span>
        <span className={menuOpen ? "bar active" : "bar"}></span>
      </div>

      <nav className={menuOpen ? "nav-links active" : "nav-links"}>
        <Link to="/Homepage">Home</Link>
        <Link to="/about">About</Link>

        {role ? (
          <>
            {/* ✅ Avatar shows correct user initial */}
            <div
              className="user-avatar"
              title="Go to Profile"
              onClick={() => navigate("/profile")}
            >
              {userInitial || "U"}
            </div>

            {role === "admin" && (
              <>
                <Link to="/add-recipe">Add Recipe</Link>
                <Link to="/Admin-Home">Admin Dashboard</Link>
              </>
            )}

            
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
