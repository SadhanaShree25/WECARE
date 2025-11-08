import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './ProfileMenu.css';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="profile-menu-container">
      <img
        src="/assets/user-icon.png"
        alt="Profile"
        className="profile-icon"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="dropdown">
          <button onClick={() => navigate('/profile')}>View Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;