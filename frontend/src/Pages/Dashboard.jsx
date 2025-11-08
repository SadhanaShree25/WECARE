import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // adjust the path if different
import "../index.css"; // make sure global styles are applied

function Dashboard() {
  const { username, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <Link to="/" className="logo">
          WeCare
        </Link>

        <div className="nav-links">
          {/* Profile Menu */}
          <div
            className="profile-menu-container"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {/* Profile Icon */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Profile"
              className="profile-icon"
            />

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="dropdown">
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={() => navigate("/history")}>History</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- DASHBOARD CONTENT --- */}
      <div className="home-container">
        <h1>Welcome, {username || "Friend"} 👋</h1>
        

        <p
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            color: "#555",
            marginBottom: "40px",
          }}
        >
          What support do you need today?
        </p>


        <div className="features-grid">
          <Link to="/chatbot" className="card feature-card">
            <div className="icon">🤖</div>
            <h3>AI Chatbot</h3>
            <p>Talk through your feelings with our supportive AI. Available 24/7.</p>
          </Link>

          <Link to="/selfcare" className="card feature-card">
            <div className="icon">🧘</div>
            <h3>Self-Care Tools</h3>
            <p>Access meditations, breathing exercises, and journaling prompts.</p>
          </Link>

          <Link to="/history" className="card feature-card">
            <div className="icon">🗒️</div>
            <h3>History</h3>
            <p>Review your past AI chats and journal entries to see your progress.</p>
          </Link>

          <Link to="/support" className="card feature-card">
            <div className="icon">🧑‍⚕️</div>
            <h3>Get Support</h3>
            <p>Find contact info for counseling, therapists, and crisis hotlines.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
