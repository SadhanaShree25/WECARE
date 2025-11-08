import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- 1. TYPO FIXED
import { useAuth } from '../AuthContext'; // Make sure this path is correct

function Navbar() {
  // 2. Get 'currentUser' and 'fetchUserData'
  const { currentUser, username, logout, fetchUserData } = useAuth();
  const navigate = useNavigate();

  // 3. Add state to hold the profile picture URL
  const [profilePic, setProfilePic] = useState('https://i.pravatar.cc/150'); // Default pic

  // 4. Fetch the user's profile picture when they are logged in
  useEffect(() => {
    const loadData = async () => {
      if (currentUser && fetchUserData) {
        const data = await fetchUserData(currentUser);
        // Use the profile_picture from Firestore, or the default if it's missing
        if (data && data.profile_picture) {
          setProfilePic(data.profile_picture);
        }
      }
    };
    loadData();
  }, [currentUser, fetchUserData]); // Re-run if the user logs in

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Navigate to homepage on logout
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar">
      {/* 5. Logo on the left */}
      <Link to={currentUser ? "/dashboard" : "/"} className="logo">
        WeCare Mental Health Support
      </Link>
      
      {/* 6. Profile/Login links on the right */}
      <div className="nav-links">
        {currentUser ? (
          // If user is logged in, show Profile and Logout
          <>
            <Link to="/profile" className="profile-link">
              <span className="nav-username">Hi, {username}</span>
              <img 
                src={profilePic} 
                alt="Profile" 
                className="profile-image" 
              />
            </Link>
            
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </>
        ) : (
          // If user is logged out, show Login
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;