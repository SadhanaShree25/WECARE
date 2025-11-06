import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Test HomePage</h1>
      <button onClick={() => {
        console.log('Button clicked');
        navigate('/login');
      }}>
        Go to Login
      </button>
    </div>
  );
}

export default HomePage;