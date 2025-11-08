import React from 'react';
import { Link } from 'react-router-dom';
import ProfileMenu from '../Component/ProfileMenu';

function HomePage() {
  return (
    <div
      id="public-home"
      className="home-container"
      style={{
        minHeight: '100vh',
        position: 'relative',
        padding: '0 20px',
      }}
    >
      {/* ✅ Profile icon floats in top-right */}
      <ProfileMenu />

      {/* Centered content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <h1 className="home-title">Welcome to MindShift</h1>

        <p
          className="home-subtitle"
          style={{
            fontSize: '1.5rem',
            marginBottom: '2.5rem',
            textAlign: 'center',
          }}
        >
          A safe, anonymous space for student mental wellness.
        </p>

        <Link
          to="/login"
          className="btn"
          style={{
            fontSize: '1.25rem',
            padding: '16px 32px',
          }}
        >
          Chat With Me
        </Link>
      </div>
    </div>
  );
}

export default HomePage;