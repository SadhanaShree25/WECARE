// Pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ displayName: '', bio: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), profile);
      alert('Profile updated!');
    }
  };

  return (
    <div>
      <h2>My Profile</h2>
      <input
        name="displayName"
        value={profile.displayName}
        onChange={handleChange}
        placeholder="Display Name"
      />
      <textarea
        name="bio"
        value={profile.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ProfilePage;