import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import { AuthProvider } from './AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="App-loading">Loading...</div>;
  }

  return (
    <Router> {/* ✅ Router must be outermost */}
      <AuthProvider value={{ currentUser }}>
        <div className="App">
          <header className="App-header">
            <h1>WeCare Mental Health Support</h1>
          </header>
          <main>
            <AppRouter />
          </main>
          <footer className="App-footer">
            <p>&copy; {new Date().getFullYear()} WeCare. All rights reserved.</p>
          </footer>
        </div>
        
      </AuthProvider>
    </Router>
    
  );
}

export default App;