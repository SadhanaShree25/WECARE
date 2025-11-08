import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth to get data

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, currentUser, fetchUserData } = useAuth(); // Get user and data fetcher

  const [profilePic, setProfilePic] = useState(''); // Default pic

  // Fetch the user's profile picture when they are logged in
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

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    navigate('/login');
  };

  return (
    <div className="profile-menu-container">
      <img
        src={profilePic} // Use the real profile picture
        alt=""
        className="profile-icon"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="dropdown">
          <button onClick={() => { setOpen(false); navigate('/profile'); }}>View Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;