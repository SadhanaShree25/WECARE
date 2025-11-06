import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function HomePage() {
  return (
    <div 
      id="public-home" // <-- THIS ID CATCHES THE ANIMATION
      className="home-container" 
      style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <h1 className="home-title">Welcome to MindShift</h1>
      
      <p className="home-subtitle" style={{ 
        fontSize: '1.5rem', 
        marginBottom: '2.5rem'
      }}>
        A safe, anonymous space for student mental wellness.
      </p>
      
      {/* Use a Link component instead of a button with navigate() */}
      <Link 
        to="/login" 
        className="btn" // The CSS will style this button
        style={{ 
          fontSize: '1.25rem', 
          padding: '16px 32px' 
        }}
      >
        Chat With Me
      </Link>
      
    </div>
  );
}

export default HomePage;