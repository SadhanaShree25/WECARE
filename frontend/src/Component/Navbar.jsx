import React from 'react';
import { Link, useNavigate } from 'react-react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { currentUser, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to={currentUser ? "/dashboard" : "/"} className="logo">
        WeCare
      </Link>
      
      <div className="nav-links">
        {currentUser ? (
          <>
            <span className="nav-username">Hi, {username}</span>
            <button onClick={handleLogout} className="btn btn-primary">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;