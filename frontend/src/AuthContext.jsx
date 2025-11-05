import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userProfileRef = doc(db, "users", user.uid, "profile", "main");
        const docSnap = await getDoc(userProfileRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
        } else {
          console.log("No profile found for user, but they are logged in.");
        }
      } else {
        setUsername(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (email, password, chosenUsername) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userProfileRef = doc(db, "users", user.uid, "profile", "main");
    await setDoc(userProfileRef, {
      username: chosenUsername,
      email: user.email,
      joined: new Date()
    });
    setUsername(chosenUsername);
    setCurrentUser(user);
    return user;
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    username,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};