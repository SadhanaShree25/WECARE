import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext'; // 1. We must use useAuth to get the correct user

const ProfilePage = () => {
  // 2. Get user data from our AuthContext
  const { currentUser, username } = useAuth(); 
  
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);

  // 3. Load data from Firestore using the user from context
  const fetchProfile = useCallback(async () => {
    if (currentUser) {
      setLoading(true);
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data()); // Load data from Firestore
      } else {
        // If no profile, set default from registration
        setProfile({ displayName: username, bio: '', photoURL: '' });
      }
      setLoading(false);
    }
  }, [currentUser, username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (currentUser) {
      // Use "merge: true" to only update fields, not erase others
      await setDoc(doc(db, 'users', currentUser.uid), profile, { merge: true });
      alert('Profile updated!');
    }
  };

  if (loading) {
    return <div className="card" style={{ textAlign: 'center' }}>Loading profile...</div>;
  }

  return (
    // 4. --- STYLING FIXES START HERE ---
    // We use the "card" class from index.css for the main container
    <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>My Profile</h2>

      {/* Email (disabled) */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Email:</label>
        {/* We use the "form-input" class */}
        <input 
          type="text" 
          className="form-input" 
          value={currentUser?.email} 
          disabled 
        />
      </div>

      {/* Display Name */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Display Name:</label>
        <input
          name="displayName"
          className="form-input" // <-- ADDED CLASS
          value={profile.displayName}
          onChange={handleChange}
        />
      </div>

      {/* Bio */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Bio:</label>
        <textarea
          name="bio"
          className="form-input" // <-- ADDED CLASS
          rows="4"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Tell us something about you..."
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Save Button */}
      <button className="btn btn-primary" onClick={handleSave}> {/* <-- ADDED CLASSES */}
        Save Changes
      </button>
    </div>
  );
};

export default ProfilePage;