import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Helper to make Firebase errors friendlier
const getFriendlyErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

function Reg() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Only for registration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        if (!username.trim()) {
          setError('Please choose a username.');
          setLoading(false);
          return;
        }
        await register(email, password, username);
      } else {
        await login(email, password);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(getFriendlyErrorMessage(err.code));
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-box">
        <h1>{isRegistering ? 'Create Your Account' : 'Welcome Back'}</h1>
        <p>
          {isRegistering
            ? 'Create an account to get started.'
            : 'Log in to access your dashboard.'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              className="form-input"
              placeholder="Choose a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          )}
          <input
            type="email"
            className="form-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            className="form-input"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            {isRegistering
              ? 'Already have an account? Log In'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reg;