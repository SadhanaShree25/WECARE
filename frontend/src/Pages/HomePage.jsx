import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to MindShift</h1>
      <p>A safe, anonymous space for student mental wellness.</p>
      <Link to="/login" className="btn btn-primary">
        Chat With Me
      </Link>
    </div>
  );
}

export default HomePage;