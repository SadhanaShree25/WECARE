import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { username } = useAuth();

  return (
    <div className="home-container" style={{ padding: '2rem' }}>
      <h1>Welcome, {username || 'Friend'}</h1>
      <p className="subtitle" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        What support do you need today?
      </p>

      <div className="features-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <Link to="/chatbot" className="card feature-card" style={cardStyle}>
          <div className="icon">🤖</div>
          <h3>AI Chatbot</h3>
          <p>Talk through your feelings with our supportive AI. Available 24/7.</p>
        </Link>

        <Link to="/selfcare" className="card feature-card" style={cardStyle}>
          <div className="icon">🧘</div>
          <h3>Self-Care Tools</h3>
          <p>Access meditations, breathing exercises, and journaling prompts.</p>
        </Link>

        <Link to="/history" className="card feature-card" style={cardStyle}>
          <div className="icon">🗒️</div>
          <h3>History</h3>
          <p>Review your past AI chats and journal entries to see your progress.</p>
        </Link>

        <Link to="/support" className="card feature-card" style={cardStyle}>
          <div className="icon">🧑‍⚕️</div>
          <h3>Get Support</h3>
          <p>Find contact info for campus counseling, therapists, and crisis hotlines.</p>
        </Link>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '10px',
  textDecoration: 'none',
  color: 'inherit',
  backgroundColor: '#f9f9f9',
  transition: 'transform 0.2s ease',
};

export default Dashboard;